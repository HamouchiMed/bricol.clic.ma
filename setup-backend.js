const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendPath = path.join(__dirname, 'backend');
const routesPath = path.join(backendPath, 'routes');

console.log('🚀 Setting up Bricol.clic backend...\n');

// 1. Create directories
try {
  if (!fs.existsSync(backendPath)) {
    fs.mkdirSync(backendPath, { recursive: true });
    console.log('✓ Created backend directory');
  }
  
  if (!fs.existsSync(routesPath)) {
    fs.mkdirSync(routesPath, { recursive: true });
    console.log('✓ Created routes directory');
  }
} catch (err) {
  console.error('❌ Error creating directories:', err.message);
  process.exit(1);
}

// 2. Rename generated files to proper names
const fileMap = {
  'backend-package.json': 'backend/package.json',
  'backend-env': 'backend/.env',
  'backend-db.js': 'backend/db.js',
  'backend-server.js': 'backend/server.js',
  'backend-prestataires.js': 'backend/routes/prestataires.js',
  'backend-seed.js': 'backend/seed.js'
};

try {
  for (const [from, to] of Object.entries(fileMap)) {
    const fromPath = path.join(__dirname, from);
    const toPath = path.join(__dirname, to);
    
    if (fs.existsSync(fromPath)) {
      fs.copyFileSync(fromPath, toPath);
      fs.unlinkSync(fromPath);
      console.log(`✓ Moved ${from} → ${to}`);
    }
  }
} catch (err) {
  console.error('❌ Error moving files:', err.message);
  process.exit(1);
}

// 3. Install npm dependencies
console.log('\n📦 Installing npm dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✓ Dependencies installed');
} catch (err) {
  console.error('❌ Error installing dependencies:', err.message);
  process.exit(1);
}

// 4. Seed database
console.log('\n🌱 Seeding database...');
try {
  execSync('cd backend && node seed.js', { stdio: 'inherit' });
} catch (err) {
  console.error('⚠️  Database seeding warning:', err.message);
  // Don't exit - continue anyway
}

console.log('\n✅ Backend setup complete!');
console.log('\n📝 Next steps:');
console.log('   cd backend');
console.log('   npm start');
console.log('\n🌐 Backend will run on http://localhost:3000');
