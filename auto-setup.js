#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'backend');
const routesPath = path.join(backendPath, 'routes');

console.log('🚀 Bricol.clic Backend Setup Automation\n');
console.log('=' .repeat(50));

// Step 1: Create directories
function createDirectories() {
  return new Promise((resolve) => {
    console.log('\n📁 Step 1: Creating directories...');
    try {
      if (!fs.existsSync(backendPath)) {
        fs.mkdirSync(backendPath, { recursive: true });
        console.log('  ✓ Created: backend/');
      }
      if (!fs.existsSync(routesPath)) {
        fs.mkdirSync(routesPath, { recursive: true });
        console.log('  ✓ Created: backend/routes/');
      }
      resolve();
    } catch (err) {
      console.error('  ✗ Error:', err.message);
      process.exit(1);
    }
  });
}

// Step 2: Copy and rename files
function copyFiles() {
  return new Promise((resolve) => {
    console.log('\n📄 Step 2: Copying and organizing files...');
    const files = [
      { from: 'backend-package.json', to: 'backend/package.json' },
      { from: 'backend-env', to: 'backend/.env' },
      { from: 'backend-db.js', to: 'backend/db.js' },
      { from: 'backend-server.js', to: 'backend/server.js' },
      { from: 'backend-prestataires.js', to: 'backend/routes/prestataires.js' },
      { from: 'backend-seed-complete.js', to: 'backend/seed.js' }
    ];

    let success = 0;
    for (const file of files) {
      const fromPath = path.join(projectRoot, file.from);
      const toPath = path.join(projectRoot, file.to);
      
      try {
        if (fs.existsSync(fromPath)) {
          fs.copyFileSync(fromPath, toPath);
          console.log(`  ✓ ${file.from} → ${file.to}`);
          success++;
        } else {
          console.log(`  ⚠ ${file.from} not found (skipping)`);
        }
      } catch (err) {
        console.error(`  ✗ Error copying ${file.from}:`, err.message);
      }
    }
    
    if (success > 0) {
      console.log(`\n  ✓ Successfully copied ${success}/${files.length} files`);
    }
    resolve();
  });
}

// Step 3: Install npm packages
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('\n📦 Step 3: Installing npm dependencies...');
    console.log('  (This may take 1-2 minutes)...\n');
    
    const npm = spawn('npm', ['install'], {
      cwd: backendPath,
      stdio: 'inherit'
    });

    npm.on('close', (code) => {
      if (code === 0) {
        console.log('\n  ✓ Dependencies installed successfully');
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    npm.on('error', (err) => {
      reject(err);
    });
  });
}

// Step 4: Seed database
function seedDatabase() {
  return new Promise((resolve, reject) => {
    console.log('\n🌱 Step 4: Seeding database with 73 prestataires...\n');
    
    const node = spawn('node', ['seed.js'], {
      cwd: backendPath,
      stdio: 'inherit'
    });

    node.on('close', (code) => {
      if (code === 0) {
        console.log('\n  ✓ Database seeded successfully');
        resolve();
      } else {
        console.log('\n  ⚠ Seeding finished (check output above)');
        resolve(); // Don't reject, continue anyway
      }
    });

    node.on('error', (err) => {
      console.error('\n  ✗ Error:', err.message);
      resolve(); // Continue anyway
    });
  });
}

// Step 5: Start server
function startServer() {
  return new Promise((resolve) => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Step 5: Starting backend server...\n');
    console.log('  Starting on http://localhost:3000');
    console.log('  Press Ctrl+C to stop\n');
    console.log('='.repeat(50) + '\n');
    
    const npm = spawn('npm', ['start'], {
      cwd: backendPath,
      stdio: 'inherit'
    });

    npm.on('error', (err) => {
      console.error('Error starting server:', err.message);
      process.exit(1);
    });
  });
}

// Run all steps
async function runSetup() {
  try {
    await createDirectories();
    await copyFiles();
    await installDependencies();
    await seedDatabase();
    await startServer();
  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  }
}

runSetup();
