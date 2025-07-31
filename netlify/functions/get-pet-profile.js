const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { Client } = require('pg');

const auth0Domain = 'dev-3pzadwjqsq4lnchu.eu.auth0.com'; // Passe ggf. an
const audience = 'https://tailr.netlify.app/api';

const clientJWKS = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
});

// Hilfsfunktion für Key-Resolver im JWT-Check
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
  // Log-Eintrag für Diagnose
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Versuche, die Profil-ID aus pathParameters zu lesen
  let profileId = event.pathParameters?.id;

  // Fallback: Falls pathParameters undefined oder leer, parse aus URL
  if (!profileId && event.rawUrl) {
    const parts = event.rawUrl.split('/');
    profileId = parts[parts.length - 1] || null;
    console.log("Fallback: parsed profileId from rawUrl:", profileId);
  }

  // Methodensicherung: nur GET erlaubt
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Nur GET erlaubt' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Prüfe, ob Profil-ID vorhanden ist
  if (!profileId) {
    console.error('Fehler: Profil-ID fehlt');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Profil-ID fehlt' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Token aus Authorization Header auslesen
  const authHeader = event.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('Kein Token im Authorization Header gefunden');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Kein Token im Authorization Header gefunden' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // JWT Token validieren
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
    console.error('Token ungültig oder nicht autorisiert:', err.message);
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

    // Profil aus DB laden, aliasing um konsistente Feldnamen zu liefern
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
      console.warn(`Profil mit ID ${profileId} nicht gefunden`);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Profil nicht gefunden' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const profile = result.rows[0];

    // Pflichtfelder prüfen (Tiername, Tierart, Besitzername, Besitzer-E-Mail)
    if (
      !profile.petName || !profile.petName.trim() ||
      !profile.species || !profile.species.trim() ||
      !profile.ownerName || !profile.ownerName.trim() ||
      !profile.ownerEmail || !profile.ownerEmail.trim()
    ) {
      console.warn('Pflichtfelder unvollständig:', {
        petName: profile.petName,
        species: profile.species,
        ownerName: profile.ownerName,
        ownerEmail: profile.ownerEmail
      });
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Pflichtfelder fehlen: Tiername, Tierart, Besitzer Name und E-Mail müssen ausgefüllt sein.'
        }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Optional: Prüfe, ob der requesting User Besitzer ist (oder optional Admin)
    if (profile.ownerUserId !== userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Zugriff verweigert' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Erfolgreiche Antwort mit Profildaten
    return {
      statusCode: 200,
      body: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json',
        // CORS Header falls nötig
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    };

  } catch (error) {
    // DB Client Cleanup und Logging
    if (client) await client.end();
    console.error('Serverfehler in get-pet-profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server-Fehler: ' + error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
