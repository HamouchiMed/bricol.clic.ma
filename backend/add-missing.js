const pool = require('./db');
require('dotenv').config();

const missingPrestataires = [
  { nom: 'Contact Serrurier', metier: 'Serrurier', telephone: '0648816538' },
  { nom: 'Plombier Marrakech Express', metier: 'Plombier', telephone: '+212606928104' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '+212660680038' },
  { nom: 'Climatisation Marrakech', metier: 'Climatisation', telephone: '+212767793837' },
  { nom: 'ARIHA FROID', metier: 'Climatisation', telephone: '+212666088348' },
  { nom: 'Bar à Boucles Marrakech', metier: 'Coiffeur / Beauté', telephone: '+212664379970' },
  { nom: 'Hamam & Massage Marrakech & SPA', metier: 'Hammam / Massage / SPA', telephone: '+212608007111' },
  { nom: 'Electricien Marrakech', metier: 'Électricité', telephone: '+212648227725' },
  { nom: 'Electricien Marrakech 2', metier: 'Électricité', telephone: '+212673867083' },
  { nom: 'Tati Ménage', metier: 'Ménage', telephone: '+212602018446' },
  { nom: 'Serrurier Marrakech SAROUTY', metier: 'Serrurier', telephone: '+212665259903' },
  { nom: 'Réparation électroménager', metier: 'Réparation électroménager', telephone: '+212681107900' },
  { nom: 'Dar lux peinture Marrakech', metier: 'Peinture', telephone: '+212613726457' },
  { nom: 'mon jardinier a kech', metier: 'jardinage', telephone: '0616450667' },
  { nom: 'hammou le jardinier', metier: 'jardinage', telephone: '0667662033' },
  { nom: 'plombier et climatisation kech', metier: 'plb et cli', telephone: '0666482132' }
];

const addMissing = async () => {
  try {
    console.log('📝 Adding missing prestataires...\n');
    
    let inserted = 0;
    let duplicates = 0;

    for (const { nom, metier, telephone } of missingPrestataires) {
      try {
        await pool.query(
          'INSERT INTO prestataires (nom, metier, telephone) VALUES ($1, $2, $3)',
          [nom, metier, telephone]
        );
        console.log(`✓ Added: ${nom}`);
        inserted++;
      } catch (err) {
        if (err.code === '23505') {
          console.log(`⚠ Already exists: ${nom}`);
          duplicates++;
        } else {
          throw err;
        }
      }
    }

    const result = await pool.query('SELECT COUNT(*) FROM prestataires');
    console.log(`\n✅ Completed!`);
    console.log(`  • Inserted: ${inserted}`);
    console.log(`  • Duplicates: ${duplicates}`);
    console.log(`  • Total in DB: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

addMissing();
