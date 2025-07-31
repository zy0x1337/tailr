const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { Client } = require('pg');

const auth0Domain = 'dev-3pzadwjqsq4lnchu.eu.auth0.com'; // Dein Auth0 Domain (ohne https://)
const audience = 'https://tailr.netlify.app/api';

const clientJWKS = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
});

function getKey(header, callback){
  clientJWKS.getSigningKey(header.kid, function(err, key) {
    if (err) { callback(err); return; }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

exports.handler = async function(event) {
  const authHeader = event.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: "Kein Token gefunden" }), headers: { "Content-Type": "application/json" } };
  }

  let decoded;
  try {
    decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        audience: audience,
        issuer: `https://${auth0Domain}/`,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded);
      });
    });
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: "Token ungültig oder nicht autorisiert" }), headers: { "Content-Type": "application/json" } };
  }

  const userId = decoded.sub;

  const dbClient = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    await dbClient.connect();

    const result = await dbClient.query(
      `SELECT 
         id, pet_name AS "petName", species, breed, gender,
         birth_date AS "birthDate", microchip, size, weight,
         fur_color AS "furColor", temperament, activity_level AS "activityLevel",
         social_behavior AS "socialBehavior", health_status AS "healthStatus",
         allergies, care_notes AS "careNotes", special_traits AS "specialTraits",
         owner_name AS "ownerName", owner_email AS "ownerEmail",
         profile_image AS "profileImage", created_at AS "createdAt", updated_at AS "updatedAt",
         owner_user_id AS "ownerUserId"
       FROM pet_profiles
       WHERE owner_user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    await dbClient.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      }
    };
  } catch (error) {
    await dbClient.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server-Fehler beim Abrufen der Profile." }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
