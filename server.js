const { Client } = require('pg');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3333;

// Hilfsfunktionen zum Lesen und Schreiben von JSON-Dateien
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(path.join(__dirname, filePath), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

async function writeJsonFile(filePath, data) {
    await fs.writeFile(path.join(__dirname, filePath), JSON.stringify(data, null, 2), 'utf8');
}

// ===== AKTIVITÄTEN-LOGGING SYSTEM =====
let activityLog = [];
function logActivity(type, title, details = {}) {
    const iconMap = { 'species_added': '➕', 'login': '🔐', 'backup_created': '💾', 'pet_profile_created': '🐾', 'pet_profile_updated': '✏️', 'pet_profile_deleted': '🗑️', 'blog_added': '📝' };
    const activity = { id: Date.now(), type, title, details, timestamp: new Date().toISOString(), icon: iconMap[type] || '📊' };
    activityLog.unshift(activity);
    if (activityLog.length > 50) activityLog = activityLog.slice(0, 50);
}

function getActivityIcon(type) {
  const icons = {
    'species_added': '➕',
    'species_updated': '✏️',
    'species_deleted': '🗑️',
    'blog_added': '📝',
    'blog_updated': '✏️',
    'blog_deleted': '🗑️',
    'backup_created': '💾',
    'login': '🔐',
    'settings_updated': '⚙️',
    'data_exported': '📤'
  };
  return icons[type] || '📊';
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);
  if (diffInSeconds < 60) return 'vor wenigen Sekunden';
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min.`;
  return `vor ${Math.floor(diffInSeconds / 3600)} Std.`;
}

// =======================================================
//   VOLLSTÄNDIGER MIDDLEWARE-BLOCK (OHNE PUBLIC-ORDNER)
// =======================================================

// 1. CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://tailr.netlify.app'],
    credentials: true
}));

// 2. Body-Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Session-Middleware (entscheidend für das Account-System)
// Muss VOR den API-Routen platziert werden, die eine Session benötigen.
app.use(session({
    secret: 'bitte-diesen-sehr-geheimen-schluessel-unbedingt-aendern!',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        secure: false, // In Produktion (mit HTTPS) auf 'true' setzen
        maxAge: 24 * 60 * 60 * 1000 // 1 Tag
    }
}));

// 4. Multer-Konfiguration (für den Bild-Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Der Ordner für hochgeladene Bilder wird im Hauptverzeichnis erstellt
    const uploadPath = path.join(__dirname, 'images', 'pet-profiles');
    fs.mkdir(uploadPath, { recursive: true }).then(() => cb(null, uploadPath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Nur Bilddateien sind erlaubt!'), false);
  }
});

// 5. Spezifische HTML-Routen
// Diese Routen werden zuerst geprüft und haben Vorrang vor der allgemeinen `express.static`-Middleware.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
  res.redirect('/admin');
});

// ===== BENUTZER-ACCOUNT API =====

app.post('/api/pet-profiles', upload.single('profileImage'), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Zugriff verweigert.' });

  const {
    petName, species, breed, gender, birthDate, microchip, size, weight,
    furColor, temperament, activityLevel, socialBehavior, healthStatus,
    allergies, careNotes, ownerName, ownerEmail, specialTraits, // u.a.
  } = req.body;

  if (!petName || !species || !ownerName || !ownerEmail) {
    return res.status(400).json({ error: 'Pflichtfelder fehlen.' });
  }

  try {
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const profileImage = req.file ? `images/pet-profiles/${req.file.filename}` : null;
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO pet_profiles
      (pet_name, species, breed, gender, birth_date, microchip, size, weight, fur_color,
       temperament, activity_level, social_behavior, health_status, allergies, care_notes,
       special_traits, owner_name, owner_email, owner_user_id, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id
    `;

    const values = [
      petName, species, breed || null, gender || null, birthDate || null, microchip || null,
      size || null, weight ? parseFloat(weight) : null, furColor || null, temperament || null,
      activityLevel || null, socialBehavior || null, healthStatus || null, allergies || null,
      careNotes || null, specialTraits || null, ownerName, ownerEmail, req.session.userId, now
    ];

    const result = await client.query(insertQuery, values);
    await client.end();

    logActivity('pet_profile_created', `Neues Profil: ${petName}`, { userId: req.session.username });
    res.status(201).json({ success: true, profileId: result.rows[0].id });
  } catch (error) {
    console.error('Fehler beim Anlegen des Profils:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

app.get('/api/pet-profiles', async (req, res) => {
  if (!req.session.userId) return res.json([]);

  try {
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const selectQuery = `SELECT * FROM pet_profiles WHERE owner_user_id = $1 ORDER BY created_at DESC`;
    const result = await client.query(selectQuery, [req.session.userId]);

    await client.end();
    res.json(result.rows);
  } catch (error) {
    console.error('Fehler beim Laden der Profile:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

app.get('/api/pet-profiles/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Zugriff verweigert.' });
  
  const profileId = req.params.id;

  try {
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const result = await client.query('SELECT * FROM pet_profiles WHERE id = $1 AND owner_user_id = $2', [profileId, req.session.userId]);

    await client.end();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Profil nicht gefunden.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Fehler beim Laden des Profils:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

app.put('/api/pet-profiles/:id', upload.single('profileImage'), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Zugriff verweigert.' });

  const profileId = req.params.id;

  try {
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    // Prüfen, ob Profil zum User gehört
    const checkRes = await client.query('SELECT owner_user_id FROM pet_profiles WHERE id = $1', [profileId]);
    if (checkRes.rowCount === 0) {
      await client.end();
      return res.status(404).json({ error: 'Profil nicht gefunden.' });
    }
    if (checkRes.rows[0].owner_user_id !== req.session.userId) {
      await client.end();
      return res.status(403).json({ error: 'Keine Berechtigung.' });
    }

    // Update-Felder dynamisch zusammensetzen:
    const updatableFields = ['pet_name', 'species', 'breed', 'gender', 'birth_date', 'microchip', 'size', 'weight', 'fur_color',
      'temperament', 'activity_level', 'social_behavior', 'health_status', 'allergies', 'care_notes', 'special_traits', 'owner_name', 'owner_email'];

    const setClauses = [];
    const values = [];
    let idx = 1;

    updatableFields.forEach(field => {
      const camelCaseField = field.replace(/_([a-z])/g, g => g[1].toUpperCase()); // Snake to camel-case for req.body keys
      if (req.body[camelCaseField] !== undefined) {
        setClauses.push(`${field} = $${idx}`);
        values.push(req.body[camelCaseField]);
        idx++;
      }
    });

    if (req.file) {
      setClauses.push(`profile_image = $${idx}`);
      values.push(`images/pet-profiles/${req.file.filename}`);
      idx++;
    }

    setClauses.push(`updated_at = $${idx}`);
    values.push(new Date().toISOString());
    idx++;

    values.push(profileId);
    values.push(req.session.userId);

    if (setClauses.length === 0) {
      await client.end();
      return res.status(400).json({ error: 'Keine Felder zum Aktualisieren angegeben.' });
    }

    const updateQuery = `
      UPDATE pet_profiles
      SET ${setClauses.join(', ')}
      WHERE id = $${idx} AND owner_user_id = $${idx + 1}
      RETURNING *
    `;

    const updateRes = await client.query(updateQuery, values);
    await client.end();

    res.json({ success: true, profile: updateRes.rows[0] });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

app.delete('/api/pet-profiles/:id', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Zugriff verweigert.' });

  const profileId = req.params.id;

  try {
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
    await client.connect();

    const checkRes = await client.query('SELECT owner_user_id FROM pet_profiles WHERE id = $1', [profileId]);

    if (checkRes.rowCount === 0) {
      await client.end();
      return res.status(404).json({ error: 'Profil nicht gefunden.' });
    }

    if (checkRes.rows[0].owner_user_id !== req.session.userId) {
      await client.end();
      return res.status(403).json({ error: 'Keine Berechtigung.' });
    }

    await client.query('DELETE FROM pet_profiles WHERE id = $1 AND owner_user_id = $2', [profileId, req.session.userId]);

    await client.end();
    logActivity('pet_profile_deleted', `Profil gelöscht (ID: ${profileId})`, { userId: req.session.username });

    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Profils:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// 6. Allgemeiner Static-Server für alle anderen Dateien (CSS, JS, Bilder)
// WICHTIGER SICHERHEITSHINWEIS: Dieser Ansatz macht alle Dateien im Hauptverzeichnis zugänglich.
app.use(express.static(__dirname));


app.get('*.html', (req, res) => {
  const filename = req.path.substring(1);
  const filePath = path.join(__dirname, filename);
  
  fs.access(filePath)
    .then(() => res.sendFile(filePath))
    .catch(() => res.status(404).send(`
      <!DOCTYPE html>
      <html lang="de">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Seite nicht gefunden</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 50px; 
                  background: #f8f9fa; 
                  color: #333; 
              }
              h1 { color: #dc3545; margin-bottom: 20px; }
              a { 
                  color: #007bff; 
                  text-decoration: none; 
                  padding: 10px 20px; 
                  margin: 10px; 
                  background: white; 
                  border-radius: 5px; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                  display: inline-block;
              }
              a:hover { 
                  background: #007bff; 
                  color: white; 
                  text-decoration: none; 
              }
          </style>
      </head>
      <body>
          <h1>404 - Seite nicht gefunden</h1>
          <p>Die Datei "${filename}" existiert nicht.</p>
          <p>
              <a href="/">🏠 Zurück zur Startseite</a>
              <a href="/admin">⚙️ Zum Admin Panel</a>
          </p>
      </body>
      </html>
    `));
});

// Hilfsfunktionen für JSON-Dateien
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(__dirname, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// ===== DASHBOARD API =====
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const petsData = await readJsonFile('petsData.json');
    const blogData = await readJsonFile('blogData.json');
    
    // Echte Statistiken berechnen
    let speciesCount = 0;
    let categoriesCount = 0;
    let recentSpeciesCount = 0;
    let totalViews = 0;
    
    if (petsData && petsData.species) {
      categoriesCount = Object.keys(petsData.species).length;
      
      Object.values(petsData.species).forEach(category => {
        Object.values(category.subcategories || {}).forEach(subcat => {
          const species = subcat.species || [];
          speciesCount += species.length;
          
          // Zähle neue Arten (letzte 7 Tage)
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          
          species.forEach(animal => {
            const createdDate = new Date(animal.id); // ID ist timestamp
            if (createdDate > weekAgo) {
              recentSpeciesCount++;
            }
            // Mock views basierend auf ID (in Realität aus Analytics)
            totalViews += Math.floor(animal.id / 1000000) || 100;
          });
        });
      });
    }

    // Blog-Statistiken
    let publishedBlogCount = 0;
    let draftBlogCount = 0;
    let recentBlogCount = 0;
    let totalReadTime = 0;

    if (blogData && Array.isArray(blogData)) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      blogData.forEach(blog => {
        if (blog.content && blog.content.length > 100) {
          publishedBlogCount++;
        } else {
          draftBlogCount++;
        }

        const createdDate = new Date(blog.id);
        if (createdDate > weekAgo) {
          recentBlogCount++;
        }

        // Lesezeit extrahieren
        const readTime = blog.readingTime || '5 Min.';
        const minutes = parseInt(readTime.match(/\d+/)?.[0]) || 5;
        totalReadTime += minutes;
      });
    }

    // Aktivitäten-Statistiken
    const todayActivities = activityLog.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const today = new Date();
      return activityDate.toDateString() === today.toDateString();
    }).length;

    const stats = {
      species: {
        total: speciesCount || 0,
        recent: recentSpeciesCount || 0,
        categories: categoriesCount || 0
      },
      blog: {
        total: blogData ? blogData.length : 0,
        published: publishedBlogCount || 0,
        drafts: draftBlogCount || 0,
        recent: recentBlogCount || 0,
        totalReadTime: totalReadTime || 0
      },
      engagement: {
        totalViews: totalViews || Math.floor(Math.random() * 10000) + 5000,
        dailyActivities: todayActivities || 0,
        avgReadTime: blogData?.length > 0 ? Math.round(totalReadTime / blogData.length) : 5
      },
      system: {
        uptime: Math.floor(process.uptime()) || 0,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) || 0
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    // Fallback-Daten bei Fehlern
    res.json({
      species: { total: 0, recent: 0, categories: 0 },
      blog: { total: 0, published: 0, drafts: 0, recent: 0, totalReadTime: 0 },
      engagement: { totalViews: 0, dailyActivities: 0, avgReadTime: 0 },
      system: { uptime: 0, memoryUsage: 0 }
    });
  }
});

// Activity Log API
app.get('/api/dashboard/activities', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  // Falls keine Aktivitäten vorhanden, Standard-Aktivitäten erstellen
  if (activityLog.length === 0) {
    const defaultActivities = [
      { type: 'login', title: 'Admin Panel gestartet', details: {} },
      { type: 'species_added', title: 'System initialisiert', details: { category: 'system' } },
      { type: 'backup_created', title: 'Automatisches Backup erstellt', details: {} }
    ];
    
    defaultActivities.forEach(activity => {
      logActivity(activity.type, activity.title, activity.details);
    });
  }
  
  const activities = activityLog.slice(0, limit).map(activity => ({
    ...activity,
    timeAgo: getTimeAgo(activity.timestamp)
  }));
  
  res.json(activities);
});

// ===== TIERARTEN API =====
app.get('/api/species', async (req, res) => {
  try {
    const data = await readJsonFile('petsData.json');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Species data not found' });
    }
  } catch (error) {
    console.error('Species error:', error);
    res.status(500).json({ error: 'Could not read species data' });
  }
});

app.get('/api/species/:id', async (req, res) => {
  try {
    const speciesId = parseInt(req.params.id);
    const data = await readJsonFile('petsData.json');
    
    if (!data || !data.species) {
      return res.status(404).json({ error: 'Species data not found' });
    }

    let foundSpecies = null;
    
    for (const [categoryKey, category] of Object.entries(data.species)) {
      if (category.subcategories) {
        for (const [subcatKey, subcategory] of Object.entries(category.subcategories)) {
          if (subcategory.species) {
            const species = subcategory.species.find(s => s.id === speciesId);
            if (species) {
              foundSpecies = {
                ...species,
                category: categoryKey,
                subcategory: subcatKey
              };
              break;
            }
          }
        }
      }
      if (foundSpecies) break;
    }

    if (!foundSpecies) {
      return res.status(404).json({ error: 'Species not found' });
    }

    res.json(foundSpecies);
  } catch (error) {
    console.error('Error fetching species:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/species', upload.single('image'), async (req, res) => {
  try {
    const data = await readJsonFile('petsData.json');
    if (!data) {
      return res.status(500).json({ error: 'Could not read data file' });
    }

    const newSpecies = {
      id: Date.now(),
      name: req.body.name,
      image: req.file ? `images/${req.file.filename}` : 'images/placeholder.jpg',
      description: req.body.description,
      origin: req.body.origin,
      size: req.body.size,
      weight: req.body.weight,
      lifeExpectancy: req.body.lifeExpectancy,
      temperament: req.body.temperament ? JSON.parse(req.body.temperament) : [],
      careLevel: req.body.careLevel,
      details: {
        summary: req.body.summary || '',
        character: req.body.character || '',
        health: req.body.health || '',
        grooming: req.body.grooming || '',
        activity: req.body.activity || '',
        suitability: req.body.suitability || ''
      },
      ratings: {
        energy: parseInt(req.body.energy) || 3,
        trainability: parseInt(req.body.trainability) || 3,
        friendliness: parseInt(req.body.friendliness) || 3,
        grooming: parseInt(req.body.groomingRating) || 3,
        beginnerFriendly: parseInt(req.body.beginnerFriendly) || 3
      }
    };

    const category = req.body.category;
    const subcategory = req.body.subcategory;

    if (!data.species[category]) {
      data.species[category] = { subcategories: {} };
    }
    if (!data.species[category].subcategories[subcategory]) {
      data.species[category].subcategories[subcategory] = { 
        name: subcategory,
        species: [] 
      };
    }

    data.species[category].subcategories[subcategory].species.push(newSpecies);

    const success = await writeJsonFile('petsData.json', data);
    if (success) {
      // Activity loggen
      logActivity('species_added', `Neue Tierart hinzugefügt: ${newSpecies.name}`, {
        speciesId: newSpecies.id,
        category: category
      });
      
      res.json({ success: true, species: newSpecies });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error adding species:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/species/:id', upload.single('image'), async (req, res) => {
  try {
    const speciesId = parseInt(req.params.id);
    const data = await readJsonFile('petsData.json');
    
    if (!data) {
      return res.status(500).json({ error: 'Could not read data file' });
    }

    let found = false;
    let speciesName = 'Unbekannt';
    
    for (const category of Object.values(data.species)) {
      for (const subcategory of Object.values(category.subcategories || {})) {
        const speciesIndex = subcategory.species?.findIndex(s => s.id === speciesId);
        if (speciesIndex !== -1) {
          const existingSpecies = subcategory.species[speciesIndex];
          speciesName = req.body.name || existingSpecies.name;
          
          subcategory.species[speciesIndex] = {
            ...existingSpecies,
            name: req.body.name || existingSpecies.name,
            image: req.file ? `images/${req.file.filename}` : existingSpecies.image,
            description: req.body.description || existingSpecies.description,
            origin: req.body.origin || existingSpecies.origin,
            size: req.body.size || existingSpecies.size,
            weight: req.body.weight || existingSpecies.weight,
            lifeExpectancy: req.body.lifeExpectancy || existingSpecies.lifeExpectancy,
            temperament: req.body.temperament ? JSON.parse(req.body.temperament) : existingSpecies.temperament,
            careLevel: req.body.careLevel || existingSpecies.careLevel
          };
          
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return res.status(404).json({ error: 'Species not found' });
    }

    const success = await writeJsonFile('petsData.json', data);
    if (success) {
      // Activity loggen
      logActivity('species_updated', `Tierart bearbeitet: ${speciesName}`, {
        speciesId: speciesId
      });
      
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error updating species:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/species/:id', async (req, res) => {
  try {
    const speciesId = parseInt(req.params.id);
    const data = await readJsonFile('petsData.json');
    
    if (!data) {
      return res.status(500).json({ error: 'Could not read data file' });
    }

    let found = false;
    for (const category of Object.values(data.species)) {
      for (const subcategory of Object.values(category.subcategories || {})) {
        const speciesIndex = subcategory.species?.findIndex(s => s.id === speciesId);
        if (speciesIndex !== -1) {
          subcategory.species.splice(speciesIndex, 1);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return res.status(404).json({ error: 'Species not found' });
    }

    const success = await writeJsonFile('petsData.json', data);
    if (success) {
      // Activity loggen
      logActivity('species_deleted', `Tierart gelöscht (ID: ${speciesId})`, {
        speciesId: speciesId
      });
      
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error deleting species:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== BLOG API =====
app.get('/api/blog', async (req, res) => {
  try {
    const data = await readJsonFile('blogData.json');
    if (data) {
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Blog error:', error);
    res.json([]);
  }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const data = await readJsonFile('blogData.json') || [];
    
    const article = data.find(article => article.id === articleId);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching blog article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/blog', upload.fields([
  { name: 'cardImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = await readJsonFile('blogData.json') || [];
    
    const newArticle = {
      id: Date.now(),
      category: req.body.category,
      title: req.body.title,
      author: {
        name: req.body.authorName || 'tailr.wiki admin',
        avatar: req.body.authorAvatar || 'images/avatar-admin.jpg'
      },
      date: new Date().toISOString().split('T')[0],
      readingTime: req.body.readingTime || '5 Min.',
      cardImage: req.files?.cardImage ? `images/${req.files.cardImage[0].filename}` : 'images/placeholder.jpg',
      heroImage: req.files?.heroImage ? `images/${req.files.heroImage[0].filename}` : 'images/placeholder-hero.jpg',
      excerpt: req.body.excerpt,
      content: req.body.content
    };

    data.push(newArticle);
    
    const success = await writeJsonFile('blogData.json', data);
    if (success) {
      // Activity loggen
      logActivity('blog_added', `Neuer Blog-Artikel: ${newArticle.title}`, {
        blogId: newArticle.id,
        category: newArticle.category
      });
      
      res.json({ success: true, article: newArticle });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error adding blog article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/blog/:id', upload.fields([
  { name: 'cardImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const data = await readJsonFile('blogData.json') || [];
    
    const articleIndex = data.findIndex(article => article.id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const existingArticle = data[articleIndex];
    
    data[articleIndex] = {
      ...existingArticle,
      title: req.body.title || existingArticle.title,
      category: req.body.category || existingArticle.category,
      excerpt: req.body.excerpt || existingArticle.excerpt,
      content: req.body.content || existingArticle.content,
      readingTime: req.body.readingTime || existingArticle.readingTime,
      cardImage: req.files?.cardImage ? `images/${req.files.cardImage[0].filename}` : existingArticle.cardImage,
      heroImage: req.files?.heroImage ? `images/${req.files.heroImage[0].filename}` : existingArticle.heroImage
    };
    
    const success = await writeJsonFile('blogData.json', data);
    if (success) {
      // Activity loggen
      logActivity('blog_updated', `Blog-Artikel bearbeitet: ${data[articleIndex].title}`, {
        blogId: articleId
      });
      
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error updating blog article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const data = await readJsonFile('blogData.json') || [];
    
    const articleIndex = data.findIndex(article => article.id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const articleTitle = data[articleIndex].title;
    data.splice(articleIndex, 1);
    
    const success = await writeJsonFile('blogData.json', data);
    if (success) {
      // Activity loggen
      logActivity('blog_deleted', `Blog-Artikel gelöscht: ${articleTitle}`, {
        blogId: articleId
      });
      
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Could not save data' });
    }
  } catch (error) {
    console.error('Error deleting blog article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== ANALYTICS API =====
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = {
      pageviews: [120, 150, 180, 200, 170, 190, 220],
      popularSpecies: [
        { name: 'Golden Retriever', views: 350 },
        { name: 'Maine Coon', views: 280 },
        { name: 'Border Collie', views: 260 },
        { name: 'Siamkatze', views: 240 },
        { name: 'Labrador', views: 220 }
      ],
      blogPerformance: [50, 65, 80, 70, 85, 90, 95],
      userActivity: [800, 950, 1200, 1100, 1300, 1250, 1400]
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Could not fetch analytics' });
  }
});

// ===== BACKUP API =====
app.post('/api/backup', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Backup-Ordner erstellen falls nicht vorhanden
    const backupDir = path.join(__dirname, 'backups');
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    const petsData = await readJsonFile('petsData.json');
    const blogData = await readJsonFile('blogData.json');
    
    const backup = {
      timestamp: new Date().toISOString(),
      petsData,
      blogData,
      activities: activityLog.slice(0, 20) // Letzte 20 Aktivitäten mit backup
    };
    
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);
    
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2));
    
    // Activity loggen
    logActivity('backup_created', `Backup erstellt: ${backupFilename}`, {
      filename: backupFilename,
      size: 'N/A'
    });
    
    res.json({ 
      success: true, 
      filename: backupFilename,
      message: 'Backup erfolgreich erstellt'
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Backup fehlgeschlagen' });
  }
});

app.get('/api/backup/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const backupPath = path.join(__dirname, 'backups', filename);
    
    await fs.access(backupPath);
    res.download(backupPath);
  } catch (error) {
    res.status(404).json({ error: 'Backup file not found' });
  }
});

// ===== SYSTEM API =====
app.get('/api/system/status', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    activities: activityLog.length
  });
});

// Error handling middleware (Multer 2.0.1 kompatibel)
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Datei zu groß. Maximum: 10MB' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Zu viele Dateien. Maximum: 5 Dateien' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unerwartetes Dateifeld' });
    }
  }
  
  if (error.message === 'Nur Bilddateien sind erlaubt!') {
    return res.status(400).json({ error: 'Nur Bilddateien sind erlaubt' });
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ 404 HANDLER FÜR ALLE ANDEREN ROUTEN
app.use('*', (req, res) => {
  console.log('404 Error for:', req.originalUrl);
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Seite nicht gefunden</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f8f9fa; 
                color: #333; 
            }
            h1 { color: #dc3545; margin-bottom: 20px; }
            a { 
                color: #007bff; 
                text-decoration: none; 
                padding: 10px 20px; 
                margin: 10px; 
                background: white; 
                border-radius: 5px; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                display: inline-block;
            }
            a:hover { 
                background: #007bff; 
                color: white; 
                text-decoration: none; 
            }
        </style>
    </head>
    <body>
        <h1>404 - Seite nicht gefunden</h1>
        <p>Die angeforderte URL "${req.originalUrl}" wurde nicht gefunden.</p>
        <p>
            <a href="/">🏠 Zurück zur Startseite</a>
            <a href="/admin">⚙️ Zum Admin Panel</a>
        </p>
    </body>
    </html>
  `);
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Admin Backend running on http://localhost:${PORT}`);
  console.log(`🏠 Hauptseite: http://localhost:${PORT}/`);
  console.log(`⚙️ Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📁 Static files served from project root`);
  console.log(`✅ All API endpoints configured`);
  console.log(`🔧 Multer 2.0.1 compatible file upload`);
  
  // Standard-Aktivität beim Server-Start
  logActivity('login', 'Server gestartet', {
    port: PORT,
    timestamp: new Date().toISOString()
  });
});