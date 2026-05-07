const pool = require('./db');
require('dotenv').config();

const checkPrestataires = async () => {
  try {
    const result = await pool.query('SELECT nom, telephone FROM prestataires ORDER BY id');
    console.log(`\n📊 Current prestataires in database: ${result.rows.length}\n`);
    
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.nom} | ${row.telephone}`);
    });
    
    console.log(`\n✓ Total: ${result.rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkPrestataires();
