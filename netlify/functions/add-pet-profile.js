const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
      headers: { "Content-Type": "application/json" }
    };
  }

  try {
    const data = JSON.parse(event.body);

    // User-ID aus Query-Param (anstelle von Session)
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Nicht authentifiziert: userId fehlt." }),
        headers: { "Content-Type": "application/json" }
      };
    }

    // Pflichtfelder prüfen
    if (!data.petName || !data.species || !data.ownerName || !data.ownerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Pflichtfelder fehlen: petName, species, ownerName und ownerEmail müssen gesetzt sein." })
      };
    }

    const sanitizeString = (str) => (str && str.trim() !== "" ? str.trim() : null);
    const birthDate = sanitizeString(data.birthDate);
    const weight = data.weight && data.weight.toString().trim() !== "" ? parseFloat(data.weight) : null;
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

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const insertQuery = `
      INSERT INTO pet_profiles
      (pet_name, species, breed, gender, birth_date, microchip, size, weight, fur_color, temperament,
       activity_level, social_behavior, health_status, allergies, care_notes, special_traits,
       owner_name, owner_email, owner_user_id, created_at)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
       $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
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
      headers: { "Content-Type": "application/json" }
    };

  } catch (error) {
    console.error('Fehler in add-pet-profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server-Fehler: ' + (error.message || error.toString()) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
