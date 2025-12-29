#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Check if git submodules are properly initialized
 * This script verifies that all required submodule directories contain files
 */

const REQUIRED_SUBMODULES = [
  'src/employee-profile/employee-profile.module.ts',
  'src/recruitment/recruitment.module.ts',
  'src/leaves/leaves.module.ts',
  'src/organization-structure/organization-structure.module.ts',
  'src/payroll-configuration/payroll-configuration.module.ts',
  'src/payroll-execution/payroll-execution.module.ts',
  'src/payroll-tracking/payroll-tracking.module.ts',
  'src/performance/performance.module.ts',
];

console.log('Checking git submodules...\n');

let allPresent = true;
const missing = [];

for (const submodule of REQUIRED_SUBMODULES) {
  const fullPath = path.join(__dirname, submodule);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✓ ${submodule}`);
  } else {
    console.log(`✗ ${submodule} - MISSING`);
    allPresent = false;
    missing.push(submodule);
  }
}

console.log('\n' + '='.repeat(60));

if (allPresent) {
  console.log('✓ All submodules are present and initialized correctly!');
  console.log('='.repeat(60) + '\n');
  process.exit(0);
} else {
  console.error('✗ Some submodules are missing!');
  console.error('\nMissing files:');
  missing.forEach(file => console.error(`  - ${file}`));
  console.error('\n' + '='.repeat(60));
  console.error('\nThis typically happens because:');
  console.error('1. Git submodules were not initialized');
  console.error('2. The .git directory is not available during build');
  console.error('\nFor Railway deployment, you need to:');
  console.error('1. Flatten the repository (copy submodule code directly)');
  console.error('2. Or use a Docker-based deployment');
  console.error('\nSee RAILWAY_QUICK_FIX.md for more information.');
  console.error('='.repeat(60) + '\n');
  process.exit(1);
}
