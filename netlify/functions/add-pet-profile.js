const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    // Pflichtfelder prüfen
    if (!data.petName || !data.species || !data.ownerName || !data.ownerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Pflichtfelder fehlen: petName, species, ownerName und ownerEmail müssen gesetzt sein." })
      };
    }

    // Optionale Felder mit "leerer String" zu null konvertieren
    const sanitizeString = (str) => (str && str.trim() !== "" ? str.trim() : null);

    const birthDate = sanitizeString(data.birthDate);
    // Für birthDate akzeptieren wir entweder korrektes Datum-Format oder null
    // (Hier keine ausführliche Validierung, kann ergänzt werden)

    // Numerische Felder: weight (NUMERIC)
    const weight = data.weight && data.weight.toString().trim() !== "" ? parseFloat(data.weight) : null;

    // Größe (size) nehmen wir als Text an
    const size = sanitizeString(data.size);

    // Alle anderen optionalen Felder als Strings, null falls leer
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

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    await client.query(
      `INSERT INTO pet_profiles
      (pet_name, species, breed, gender, birth_date, microchip, size, weight, fur_color, temperament, activity_level, social_behavior, health_status, allergies, care_notes, owner_name, owner_email)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
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
        data.ownerName,
        data.ownerEmail
      ]
    );

    await client.end();

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || error.toString() }) };
  }
};
