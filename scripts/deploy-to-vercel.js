#!/usr/bin/env node

/**
 * Complete Vercel Deployment Script
 * Builds, fixes, and deploys FlowsyAI to Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 FlowsyAI Vercel Deployment Script\n');

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.dirname(__dirname) });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.error('❌ Vercel CLI not found. Install with: npm i -g vercel');
    process.exit(1);
  }

  // Check if we're in the right directory
  const packageJsonPath = path.join(path.dirname(__dirname), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Run this script from the project root.');
    process.exit(1);
  }

  console.log('✅ Prerequisites check passed\n');
}

function main() {
  checkPrerequisites();

  // Step 1: Clean and build
  runCommand('npm run clean', 'Cleaning previous build');
  runCommand('npm run build', 'Building production bundle');

  // Step 2: Apply Vercel fixes
  runCommand('node scripts/fix-vercel-deployment.js', 'Applying Vercel fixes');

  // Step 3: Test the build
  runCommand('node scripts/test-production-build.js', 'Testing production build');

  // Step 4: Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  console.log('📝 This will open Vercel CLI for deployment.');
  console.log('💡 Make sure you are logged in to Vercel (vercel login)');
  console.log('💡 Use --prod flag for production deployment\n');

  try {
    execSync('vercel --prod', { stdio: 'inherit', cwd: path.dirname(__dirname) });
    console.log('\n✅ Deployment completed successfully!');

    // Create deployment log
    const deploymentLog = {
      timestamp: new Date().toISOString(),
      status: 'success',
      fixes_applied: [
        'Production build optimization',
        'Vercel-specific module loading fixes',
        'React loading monitoring',
        'Fallback error handling',
      ],
    };

    fs.writeFileSync(
      path.join(path.dirname(__dirname), 'dist', 'deployment-log.json'),
      JSON.stringify(deploymentLog, null, 2)
    );

    console.log('\n🎉 FlowsyAI deployed successfully to Vercel!');
    console.log('💡 Check the Vercel dashboard for the deployment URL');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure you are logged in: vercel login');
    console.log('2. Check your Vercel project settings');
    console.log('3. Verify the build completed successfully');
    console.log('4. Check the Vercel dashboard for error details');
    process.exit(1);
  }
}

main();
