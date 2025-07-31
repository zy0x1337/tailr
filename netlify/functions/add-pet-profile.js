const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { Client } = require('pg');

// Deine Auth0 Settings
const auth0Domain = 'dev-3pzadwjqsq4lnchu.eu.auth0.com';   // Dein Auth0-Domain ohne https://
const audience = 'https://tailr.netlify.app/api';          // Deine API Audience

const clientJWKS = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
});

function getKey(header, callback) {
  clientJWKS.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Token aus Authorization Header extrahieren
  const authHeader = event.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Kein Token im Authorization Header gefunden' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Token validieren und userId auslesen
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

  const userId = decoded.sub; // Die Auth0 User-ID aus dem Token

  try {
    const data = JSON.parse(event.body);

    // Pflichtfelder prüfen
    if (!data.petName || !data.species || !data.ownerName || !data.ownerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Pflichtfelder fehlen: petName, species, ownerName und ownerEmail müssen gesetzt sein." }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const sanitizeString = (str) => (str && str.trim() !== '' ? str.trim() : null);

    const birthDate = sanitizeString(data.birthDate);
    const weight = data.weight && data.weight.toString().trim() !== '' ? parseFloat(data.weight) : null;
    const size = sanitizeString(data.size);
    const breed = sanitizeString(data.breed);
    const gender = sanitizeString(data.gender);
    const microchip = sanitizeString(data.microchip);
    const furColor = sanitizeString(data.furColor);
    const temperament = sanitizeString(data.temperament);
    const activityLevel = sanitizeString(data.activityLevel);
    const socialBehavior = sanitizeString(data.socialBehavior);
    const healthStatus = sanitizeString(data.healthStatus);
    const allergies = sanitizeString(data.allergies);
    const careNotes = sanitizeString(data.careNotes);
    const specialTraits = sanitizeString(data.specialTraits);

    // Achtung: Profilbild-Handling musst du noch anpassen, hier kein Bild-Upload

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const insertQuery = `
      INSERT INTO pet_profiles
      (pet_name, species, breed, gender, birth_date, microchip, size, weight, fur_color, temperament,
       activity_level, social_behavior, health_status, allergies, care_notes, special_traits,
       owner_name, owner_email, owner_user_id, created_at)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
       $11,$12,$13,$14,$15,$16,
       $17,$18,$19,NOW())
      RETURNING id
    `;

    const values = [
      data.petName,
      data.species,
      breed,
      gender,
      birthDate,
      microchip,
      size,
      weight,
      furColor,
      temperament,
      activityLevel,
      socialBehavior,
      healthStatus,
      allergies,
      careNotes,
      specialTraits,
      data.ownerName,
      data.ownerEmail,
      userId
    ];

    const result = await client.query(insertQuery, values);
    await client.end();

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, profileId: result.rows[0].id }),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error) {
    console.error('Fehler in add-pet-profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server-Fehler: ' + (error.message || error.toString()) }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
