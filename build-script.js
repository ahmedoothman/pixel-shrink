const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
  console.log('Created assets directory');
}

// Check for icon file
const iconPath = path.join(assetsDir, 'icon.ico');
if (!fs.existsSync(iconPath)) {
  console.log(
    'No icon.ico file found in assets folder. Creating a placeholder...'
  );

  // Create a basic text file to remind you to replace it with a real icon
  fs.writeFileSync(
    iconPath,
    Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x68, 0x05, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00,
      0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x01, 0x00,
      0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x05, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00,
    ])
  );
  console.log('Created a placeholder icon file.');
}

console.log('Checking package.json for build scripts...');

// Check if package.json exists and has the necessary scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found!');
  process.exit(1);
}

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Check if the required scripts exist
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.log('Adding build script to package.json...');
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.build = 'react-scripts build';

    // Also make sure we have the dist script
    if (!packageJson.scripts.dist) {
      packageJson.scripts.dist = 'electron-builder --win --x64';
    }

    // Add build configuration if not present
    if (!packageJson.build) {
      packageJson.build = {
        appId: 'com.pixelshrink.app',
        productName: 'Pixel Shrink',
        files: ['build/**/*', 'node_modules/**/*', 'public/**/*', 'main.js'],
        directories: {
          buildResources: 'assets',
        },
        win: {
          target: ['nsis'],
          icon: 'assets/icon.ico',
        },
      };
    }

    // Write back the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with build configuration');
  }

  // Check if electron-builder is installed
  const nodeModulesPath = path.join(
    __dirname,
    'node_modules',
    'electron-builder'
  );
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Installing electron-builder...');
    exec('npm install --save-dev electron-builder', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing electron-builder: ${error.message}`);
        return;
      }
      console.log('electron-builder installed successfully.');
      startBuildProcess();
    });
  } else {
    startBuildProcess();
  }
} catch (error) {
  console.error(`Error reading or parsing package.json: ${error.message}`);
  process.exit(1);
}

function startBuildProcess() {
  console.log('Building React app...');
  const buildProcess = exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error building React app: ${error.message}`);
      console.error('Full build error details:');
      console.error(stderr);
      return;
    }

    console.log('React build complete. Building Electron app...');
    const distProcess = exec('npm run dist', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building Electron app: ${error.message}`);
        console.error('Full build error details:');
        console.error(stderr);
        return;
      }

      console.log('Electron build complete!');
      console.log('Your executable can be found in the dist folder');
    });

    // Show output in real time
    distProcess.stdout.on('data', (data) => {
      console.log(data);
    });

    distProcess.stderr.on('data', (data) => {
      console.error(data);
    });
  });

  // Show output in real time
  buildProcess.stdout.on('data', (data) => {
    console.log(data);
  });

  buildProcess.stderr.on('data', (data) => {
    console.error(data);
  });
}
