const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get all prestataires with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      'SELECT * FROM prestataires ORDER BY nom LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await pool.query('SELECT COUNT(*) FROM prestataires');
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching prestataires:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
