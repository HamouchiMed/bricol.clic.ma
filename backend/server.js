const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db');

const app = express();

// Custom Morgan token to log request body (redacting passwords)
morgan.token('body', (req) => {
  const body = { ...req.body };
  if (body.password) body.password = '********'; // Security: Never log plain-text passwords
  return JSON.stringify(body);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms | Body: :body'));

// Database initialization
const initDatabase = async () => {
  try {
    // 1. Base Auth Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 2. Client Profile Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nom VARCHAR(255)
      )
    `);

    // 3. Provider Profile Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        nom VARCHAR(255),
        metier VARCHAR(255),
        telephone VARCHAR(20) UNIQUE
      )
    `);

    console.log('✓ Database schema (users, clients, providers) ready');

    //  (Keep existing categories/transactions logic)


    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        prestataire_id INTEGER REFERENCES prestataires(id),
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        prix DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Services table ready');

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);
    
    // Seed initial categories
    const initialCategories = ['Plomberie', 'Électricité', 'Carpentry', 'Peinture', 'Ménage', 'Déménagement', 'Jardinage', 'Climatisation', 'Serrurerie', 'Chauffage', 'Coiffeur', 'Informatique', 'Décoration', 'Mécanique', 'Organisation événements', 'Cuisine'];
    for (const cat of initialCategories) {
      await pool.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING', [cat]);
    }
    console.log('✓ Categories table ready');

    // Create missions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS missions (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        provider_id INTEGER REFERENCES providers(id),
        title VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Missions table ready');


  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// Get current client profile
app.get('/api/clients/me', async (req, res) => {
  const token = req.query.token;
  console.log('DEBUG: /api/clients/me called with token:', token);
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  const userId = token.split('-')[2];
  console.log('DEBUG: Extracted userId:', userId);
  try {
    const result = await pool.query(`
      SELECT c.*, u.email, u.phone 
      FROM clients c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.user_id = $1
    `, [userId]);
    if (result.rows.length === 0) {
        console.log('DEBUG: No client found for userId:', userId);
        return res.status(404).json({ error: 'Client not found' });
    }
    console.log('DEBUG: Found client:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching client profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current client profile
app.put('/api/clients/me', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  const userId = token.split('-')[2];
  const { nom, email, phone } = req.body;
  
  const clientQuery = await pool.connect();
  try {
    await clientQuery.query('BEGIN');
    
    if (email !== undefined || phone !== undefined) {
      await clientQuery.query('UPDATE users SET email = COALESCE($1, email), phone = COALESCE($2, phone) WHERE id = $3', [email, phone, userId]);
    }
    
    if (nom !== undefined) {
      await clientQuery.query('UPDATE clients SET nom = $1 WHERE user_id = $2', [nom, userId]);
    }
    
    await clientQuery.query('COMMIT');
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    await clientQuery.query('ROLLBACK');
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    clientQuery.release();
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM categories ORDER BY name');
    res.json(result.rows.map(r => r.name));
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Authentication
app.post('/api/signup', async (req, res) => {
  const client = await pool.connect();
  try {
    const { phone, email, password, role, name, metier } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });
    
    await client.query('BEGIN');
    
    // Insert into users table
    const userResult = await client.query(
      'INSERT INTO users (phone, email, role) VALUES ($1, $2, $3) RETURNING *',
      [phone, email, role || 'client']
    );
    const newUser = userResult.rows[0];

    // If provider, add to providers AND prestataires table for visibility
    if (role === 'provider') {
      await client.query(
        'INSERT INTO providers (user_id, nom, metier, telephone) VALUES ($1, $2, $3, $4)',
        [newUser.id, name || 'Prestataire', metier || 'Expert', phone]
      );
      await client.query(
        'INSERT INTO prestataires (nom, metier, telephone) VALUES ($1, $2, $3)',
        [name || 'Prestataire', metier || 'Expert', phone]
      );
    } 
    // If client, add to clients table
    else {
      console.log('DEBUG: Creating client entry for user_id:', newUser.id);
      await client.query(
        'INSERT INTO clients (user_id, nom) VALUES ($1, $2)',
        [newUser.id, name || 'Client']
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token: 'real-token-' + newUser.id
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in signup transaction:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  } finally {
    client.release();
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    let result;
    
    if (phone) {
      result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    } else if (email) {
      result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    } else {
      return res.status(400).json({ error: 'Phone or email required' });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    // In a real app, verify hashed password here
    
    res.json({
      message: 'Login successful',
      user,
      token: 'real-token-' + user.id
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all prestataires
app.get('/api/prestataires', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM prestataires ORDER BY created_at DESC, nom');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching prestataires:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get prestataires by metier (service type)
app.get('/api/prestataires/metier/:metier', async (req, res) => {
  try {
    const { metier } = req.params;
    const result = await pool.query('SELECT * FROM prestataires WHERE metier ILIKE $1 ORDER BY created_at DESC, nom', [`%${metier}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching prestataires by metier:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single prestataire
app.get('/api/prestataires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM prestataires WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prestataire not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching prestataire:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new prestataire
app.post('/api/prestataires', async (req, res) => {
  try {
    const { nom, metier, telephone } = req.body;
    if (!nom || !telephone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const result = await pool.query(
      'INSERT INTO prestataires (nom, metier, telephone) VALUES ($1, $2, $3) RETURNING *',
      [nom, metier || 'Non spécifié', telephone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    console.error('Error creating prestataire:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search prestataires
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    const result = await pool.query(
      'SELECT * FROM prestataires WHERE nom ILIKE $1 OR metier ILIKE $1 OR telephone ILIKE $1 ORDER BY created_at DESC, nom',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    // In a real app, we would filter by user_id from the token
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get provider profile by user_id
app.get('/api/providers/:userId', async (req, res) => {
  console.log('Fetching profile for userId:', req.params.userId);
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT p.*, u.email 
      FROM providers p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = $1
    `, [userId]);
    if (result.rows.length === 0) {
      console.log('Provider not found for user_id:', userId);
      return res.status(404).json({ error: 'Provider not found' });
    }
    console.log('Returning provider profile:', result.rows[0]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching provider profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get missions for a client
app.get('/api/clients/me/missions', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Token required' });
  const userId = token.split('-')[2];
  try {
    const clientResult = await pool.query('SELECT id FROM clients WHERE user_id = $1', [userId]);
    if (clientResult.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    const clientId = clientResult.rows[0].id;
    
    const result = await pool.query(
      `SELECT m.*, p.nom as provider_name, p.metier as provider_metier 
       FROM missions m 
       JOIN providers p ON m.provider_id = p.id 
       WHERE m.client_id = $1 ORDER BY m.created_at DESC`,
      [clientId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client missions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update mission status
app.put('/api/missions/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE missions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Mission not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating mission status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new mission (booking)
app.post('/api/missions', async (req, res) => {
  try {
    const { clientId, providerId, title } = req.body;
    if (!clientId || !providerId || !title) return res.status(400).json({ error: 'Required fields missing' });
    
    let clientCheck = await pool.query('SELECT id FROM clients WHERE id = $1', [clientId]);
    if (clientCheck.rows.length === 0) clientCheck = await pool.query('SELECT id FROM clients WHERE user_id = $1', [clientId]);
    if (clientCheck.rows.length === 0) return res.status(400).json({ error: 'Client not found' });
    const actualClientId = clientCheck.rows[0].id;
    
    const prestataireResult = await pool.query('SELECT telephone FROM prestataires WHERE id = $1', [providerId]);
    if (prestataireResult.rows.length === 0) return res.status(400).json({ error: 'Prestataire not found' });
    
    const phone = prestataireResult.rows[0].telephone;
    const providerCheck = await pool.query('SELECT id FROM providers WHERE telephone = $1', [phone]);
    if (providerCheck.rows.length === 0) return res.status(400).json({ error: 'Provider record not found' });
    const actualProviderId = providerCheck.rows[0].id;
    
    const result = await pool.query(
      'INSERT INTO missions (client_id, provider_id, title) VALUES ($1, $2, $3) RETURNING *',
      [actualClientId, actualProviderId, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get missions for a provider
app.get('/api/providers/:providerId/missions', async (req, res) => {
  try {
    const { providerId } = req.params;
    const result = await pool.query(
      `SELECT m.*, c.nom as client_name, u.phone as client_phone 
       FROM missions m 
       JOIN clients c ON m.client_id = c.id 
       JOIN users u ON c.user_id = u.id
       WHERE m.provider_id = $1 ORDER BY m.created_at DESC`,
      [providerId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
});

module.exports = app;
