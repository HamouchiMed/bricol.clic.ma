const pool = require('./db');
require('dotenv').config();

const prestatairesData = [
  { nom: 'Abdelhak 7ouma', metier: 'Non spécifié', telephone: '+212 630-594781' },
  { nom: 'Agouri Mecanecien', metier: 'Mécanicien', telephone: '+212 668-731033' },
  { nom: 'Abdelouahed Tailleur', metier: 'Tailleur', telephone: '+212 653-339697' },
  { nom: 'Abdelhadi 2', metier: 'Non spécifié', telephone: '+212 674-760033' },
  { nom: 'Aziz Babouche', metier: 'Babouche (artisan/vendeur)', telephone: '+212 678-091530' },
  { nom: 'Mbarek Boucher', metier: 'Boucher', telephone: '+212 666-089057' },
  { nom: 'Jamal Lampes', metier: 'Lampes / Éclairage', telephone: '+212 662-683648' },
  { nom: 'Ahmed Lampes', metier: 'Lampes / Éclairage', telephone: '+212 661-675551' },
  { nom: 'Taib . Plamp', metier: 'Plombier', telephone: '+212 668-944220' },
  { nom: 'Si Lampe', metier: 'Lampes / Éclairage', telephone: '+212 668-188735' },
  { nom: 'Sté Tapissier Soumia Omo Tarike', metier: 'Tapissier / Mobilier', telephone: '+212 777-178214' },
  { nom: 'Hahmid Peintre', metier: 'Peintre / Décoration de Bâtiment', telephone: '+212 666-396461' },
  { nom: 'Mustafa', metier: 'Carrelage / Zellij / Marbre / Mosaïque', telephone: '+212 667-660286' },
  { nom: 'Morocco Go Events', metier: 'Organisation événements (mariage, séminaire)', telephone: '+212 701-033002' },
  { nom: 'STARPROD EVENTS', metier: 'Animation / Production événementielle', telephone: '+212 698-350444' },
  { nom: 'Anniversaire Marrakech Management', metier: 'Organisation fêtes / anniversaires', telephone: '+212 619-322277' },
  { nom: 'Donald Event', metier: 'Organisation événements sur mesure', telephone: '+212 661-293024' },
  { nom: 'infoclic.ma', metier: 'Réparation ordinateurs / Maintenance IT', telephone: '+212 638-807754' },
  { nom: 'Up Informatique', metier: 'Assistance informatique entreprises', telephone: '+212 691-490960' },
  { nom: 'SOS Informatique', metier: 'Dépannage informatique rapide', telephone: '+212 524-338809' },
  { nom: 'Event Marrakech', metier: 'Organisation événements entreprises', telephone: '+212 661-334166' },
  { nom: 'Cherif Events', metier: 'Gestion complète d\'événements', telephone: '+212 668-045245' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '+212 660-680038' },
  { nom: 'Plombier Service', metier: 'Plombier (urgence 24h/24)', telephone: '+212 762-613457' },
  { nom: 'Plomberie Marrakech | Bouricha Travaux', metier: 'Plomberie / Travaux', telephone: '+212 676-305038' },
  { nom: 'Plombier à Marrakech', metier: 'Plombier', telephone: '+212 650-933826' },
  { nom: 'Salon Cham Hair & Makeup Marrakech', metier: 'Coiffure / Maquillage', telephone: '+212 679-272756' },
  { nom: 'Metamorfose Marrakech', metier: 'Coiffure / Esthétique', telephone: '+212 610-921754' },
  { nom: 'INSIDE BEAUTY', metier: 'Coiffure / Esthétique', telephone: '+212 662-628735' },
  { nom: 'Luxury Coiffeur à domicile Marrakech', metier: 'Coiffeur à domicile', telephone: '+212 784-694003' },
  { nom: 'Climatisation Marrakech', metier: 'Climatisation (24h/24)', telephone: '+212 767-793837' },
  { nom: 'Maintenance et Réparation Froid Générale', metier: 'Réparation climatisation / Électroménager', telephone: '+212 661-696458' },
  { nom: 'Réparation climatisation et électroménager', metier: 'Climatisation / Électroménager', telephone: '+212 666-546259' },
  { nom: 'Froid et climatisation', metier: 'Climatisation / Froid', telephone: '+212 670-638279' },
  { nom: 'Hassan Coiffeur', metier: 'Coiffeur', telephone: '+212 687-544223' },
  { nom: 'Mohammed Coiffeur', metier: 'Coiffeur', telephone: '+212 621-873087' },
  { nom: 'Samir Gazzar', metier: 'Non spécifié', telephone: '+212 645-233137' },
  { nom: 'Youssef Carrelages', metier: 'Carrelage', telephone: '+212 668-141625' },
  { nom: 'Abdelaziz Gabbas Haddadine', metier: 'Forgeron / Ferronnerie', telephone: '+212 666-185489' },
  { nom: 'Ait Aal Cuire', metier: 'Cuir / Maroquinerie', telephone: '+212 652-949281' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '0639396740' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '0622679529' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '0767148719' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '0602628460' },
  { nom: 'Plombier Marrakech', metier: 'Plombier', telephone: '0600952569' },
  { nom: 'Contact Jardinage 1', metier: 'Jardinage', telephone: '0602570489' },
  { nom: 'Contact Jardinage 2', metier: 'Jardinage', telephone: '0662155911' },
  { nom: 'Contact Jardinage 3', metier: 'Jardinage', telephone: '0618182021' },
  { nom: 'Contact Jardinage 4', metier: 'Jardinage', telephone: '0624483567' },
  { nom: 'Contact Jardinage 5', metier: 'Jardinage', telephone: '+212661409190' },
  { nom: 'Contact Électromécanicien 1', metier: 'Électromécanicien', telephone: '0607691087' },
  { nom: 'Contact Électromécanicien 2', metier: 'Électromécanicien', telephone: '+212661409190' },
  { nom: 'Contact Électromécanicien 3', metier: 'Électromécanicien', telephone: '0772000026' },
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

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with prestataires...');
    
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prestataires (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        metier VARCHAR(255),
        telephone VARCHAR(20) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clear existing data (optional - comment out if you want to keep it)
    // await pool.query('DELETE FROM prestataires');

    // Insert prestataires
    let inserted = 0;
    let duplicates = 0;

    for (const { nom, metier, telephone } of prestatairesData) {
      try {
        await pool.query(
          'INSERT INTO prestataires (nom, metier, telephone) VALUES ($1, $2, $3)',
          [nom, metier, telephone]
        );
        inserted++;
      } catch (err) {
        if (err.code === '23505') {
          // Unique constraint violation - phone already exists
          duplicates++;
        } else {
          throw err;
        }
      }
    }

    console.log(`✓ Database seeded successfully!`);
    console.log(`  • Inserted: ${inserted} prestataires`);
    console.log(`  • Duplicates skipped: ${duplicates}`);
    
    // Verify
    const result = await pool.query('SELECT COUNT(*) FROM prestataires');
    console.log(`  • Total in database: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
