const pool = require('./db');
require('dotenv').config();

const verify = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM prestataires');
    const count = parseInt(result.rows[0].count);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE VERIFICATION');
    console.log('='.repeat(50));
    console.log(`\n📊 Total Prestataires: ${count}\n`);
    
    if (count === 73) {
      console.log('✅ PERFECT! All 73 prestataires are in the database!');
      console.log('\n🎉 Your database is ready to use!\n');
    } else if (count > 50) {
      console.log(`⚠️  You have ${count}/73 prestataires`);
      console.log(`📝 Missing: ${73 - count} entries\n`);
    } else {
      console.log(`❌ Only ${count}/73 entries found\n`);
    }
    
    console.log('='.repeat(50));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

verify();
