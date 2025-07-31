const { Client } = require('pg');

exports.handler = async function(event) {
  // Nur POST methoden erlauben
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Nur POST ist erlaubt." }),
      headers: { "Content-Type": "application/json" }
    };
  }

  try {
    // Body parsen
    const data = JSON.parse(event.body);

    // User-ID nur aus Query-Param (nicht aus Token oder Header)
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Nicht authentifiziert: userId fehlt." }),
        headers: { "Content-Type": "application/json" }
      };
    }

    // Pflichtfelder prüfen
    const requiredFields = ['petName', 'species', 'ownerName', 'ownerEmail'];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Pflichtfelder fehlen: ${requiredFields.join(', ')} müssen gesetzt sein.` }),
          headers: { "Content-Type": "application/json" }
        };
      }
    }

    // Hilfsfunktion zur String-Säuberung
    const sanitizeString = (str) => (str && str.trim() !== '' ? str.trim() : null);

    // Optional: Werte säubern und konvertieren
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

    // DB-Client initialisieren
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    // Insert Query vorbereiten
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

    // Erfolg zurückgeben mit 201 Created
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, profileId: result.rows[0].id }),
      headers: { "Content-Type": "application/json" }
    };

  } catch (error) {
    // Fehler loggen und 500 zurückgeben
    console.error('Fehler in add-pet-profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server-Fehler: ' + (error.message || error.toString()) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
