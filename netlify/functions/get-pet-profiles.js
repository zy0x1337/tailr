const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Nicht authentifiziert: userId fehlt." }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    await client.connect();

    const result = await client.query(
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

    await client.end();

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
    console.error('FEHLER in get-pet-profiles:', error);
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server-Fehler beim Abrufen der Profile." }),
      headers: { "Content-Type": "application/json" }
    };
  }
};
