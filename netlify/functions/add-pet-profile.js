const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  // birth_date auf null setzen, wenn leerer String
  const birthDate = data.birthDate && data.birthDate.trim() !== "" ? data.birthDate : null;

  const client = new Client({ connectionString: process.env.NEON_DB_URL });
  await client.connect();

  try {
    await client.query(
      `INSERT INTO pet_profiles
       (pet_name, species, breed, gender, birth_date, microchip, size, weight, fur_color, temperament, activity_level, social_behavior, health_status, allergies, care_notes, owner_name, owner_email)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        data.petName, data.species, data.breed, data.gender, birthDate, data.microchip,
        data.size, data.weight, data.furColor, data.temperament, data.activityLevel, data.socialBehavior,
        data.healthStatus, data.allergies, data.careNotes, data.ownerName, data.ownerEmail
      ]
    );
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  } finally {
    await client.end();
  }
};
