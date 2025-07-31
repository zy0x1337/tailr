const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { Client } = require('pg');

const auth0Domain = 'dev-3pzadwjqsq4lnchu.eu.auth0.com'; // Auth0 Domain anpassen
const audience = 'https://tailr.netlify.app/api';

const clientJWKS = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
});

function getKey(header, callback) {
  clientJWKS.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Nur GET erlaubt' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const profileId = event.pathParameters?.id;

  if (!profileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Profil-ID fehlt' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const authHeader = event.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Kein Token im Authorization Header gefunden' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  let decoded;
  try {
    decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        audience,
        issuer: `https://${auth0Domain}/`,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token ungültig oder nicht autorisiert', detail: err.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  const userId = decoded.sub;
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    await client.connect();

    // Profilabfrage
    const query = `
      SELECT
        id, pet_name AS "petName", species, breed, gender,
        birth_date AS "birthDate", microchip, size, weight,
        fur_color AS "furColor", temperament, activity_level AS "activityLevel",
        social_behavior AS "socialBehavior", health_status AS "healthStatus",
        allergies, care_notes AS "careNotes", special_traits AS "specialTraits",
        owner_name AS "ownerName", owner_email AS "ownerEmail",
        profile_image AS "profileImage", created_at AS "createdAt", updated_at AS "updatedAt",
        owner_user_id AS "ownerUserId"
      FROM pet_profiles
      WHERE id = $1
    `;

    const result = await client.query(query, [profileId]);

    await client.end();

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Profil nicht gefunden' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const profile = result.rows[0];

    // Prüfung der Pflichtfelder (Tiername, Tierart, Besitzername, Besitzer E-Mail)
    if (
      !profile.petName || profile.petName.trim() === '' ||
      !profile.species || profile.species.trim() === '' ||
      !profile.ownerName || profile.ownerName.trim() === '' ||
      !profile.ownerEmail || profile.ownerEmail.trim() === ''
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Pflichtfelder fehlen: Tiername, Tierart, Besitzer Name und E-Mail müssen ausgefüllt sein.' 
        }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Optional: Zugriffsbeschränkung - nur Besitzer oder Admin darf Profil sehen
    if (profile.ownerUserId !== userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Zugriff verweigert' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    };

  } catch (error) {
    if (client) await client.end();
    console.error('Fehler in get-pet-profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server-Fehler: ' + error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
