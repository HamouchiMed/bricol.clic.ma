const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const backendFolder = path.join(projectRoot, 'backend');

console.log('🔄 Moving all backend files to backend/ folder...\n');

// Files to move from root to backend/
const filesToMove = [
  'backend-package.json',
  'backend-env',
  'backend-db.js',
  'backend-server.js',
  'backend-prestataires.js',
  'backend-seed-complete.js',
  'auto-setup.js',
  'setup-backend.js',
  'api.js'
];

let moved = 0;
let notFound = 0;

for (const file of filesToMove) {
  const fromPath = path.join(projectRoot, file);
  let toFile = file;
  
  // Rename backend-* files to proper names
  if (file === 'backend-package.json') toFile = 'package.json';
  if (file === 'backend-env') toFile = '.env';
  if (file === 'backend-db.js') toFile = 'db.js';
  if (file === 'backend-server.js') toFile = 'server.js';
  if (file === 'backend-seed-complete.js') toFile = 'seed.js';
  if (file === 'backend-prestataires.js') toFile = 'routes/prestataires.js';
  
  const toPath = path.join(backendFolder, toFile);
  
  try {
    if (fs.existsSync(fromPath)) {
      // Ensure directory exists
      const dir = path.dirname(toPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.copyFileSync(fromPath, toPath);
      fs.unlinkSync(fromPath);
      console.log(`  ✓ ${file} → backend/${toFile}`);
      moved++;
    } else {
      console.log(`  ⚠ ${file} not found (skipping)`);
      notFound++;
    }
  } catch (err) {
    console.error(`  ✗ Error moving ${file}:`, err.message);
  }
}

console.log(`\n✅ Moved: ${moved} files`);
console.log(`⚠️  Not found: ${notFound} files`);
console.log('\n📁 Backend folder structure:');
console.log('   backend/');
console.log('   ├── package.json');
console.log('   ├── .env');
console.log('   ├── db.js');
console.log('   ├── server.js');
console.log('   ├── seed.js');
console.log('   ├── api.js');
console.log('   ├── auto-setup.js');
console.log('   ├── setup-backend.js');
console.log('   ├── routes/');
console.log('   │   └── prestataires.js');
console.log('   └── node_modules/\n');
