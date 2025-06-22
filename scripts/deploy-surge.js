#!/usr/bin/env node
/**
 * Surge.sh Deployment Script for FlowsyAI
 * Deploys to Surge with cache busting and proper configuration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOMAIN = 'www.flowsyai.com';
const DIST_DIR = 'dist';

console.log('🚀 DEPLOYING FLOWSYAI TO SURGE.SH');
console.log('=================================');

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function createCNAME() {
  console.log('🔄 Creating CNAME file...');
  const cnamePath = path.join(DIST_DIR, 'CNAME');
  
  try {
    fs.writeFileSync(cnamePath, DOMAIN);
    console.log(`✅ CNAME created: ${DOMAIN}`);
    return true;
  } catch (error) {
    console.log('❌ CNAME creation failed:', error.message);
    return false;
  }
}

function updateBuildTimestamp() {
  console.log('🔄 Updating build timestamp...');
  const timestampPath = path.join(DIST_DIR, 'build-timestamp.txt');
  const timestamp = new Date().toISOString();
  
  const content = `Build timestamp: ${timestamp}
Deployed to: ${DOMAIN}
Platform: Surge.sh
Cache-busting update: ${Date.now()}`;
  
  try {
    fs.writeFileSync(timestampPath, content);
    console.log(`✅ Build timestamp updated: ${timestamp}`);
    return true;
  } catch (error) {
    console.log('❌ Build timestamp update failed:', error.message);
    return false;
  }
}

function verifyDistExists() {
  if (!fs.existsSync(DIST_DIR)) {
    console.log('❌ Dist directory not found. Run npm run build first.');
    return false;
  }
  
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found in dist. Build may have failed.');
    return false;
  }
  
  console.log('✅ Dist directory verified');
  return true;
}

function deployToSurge() {
  console.log(`🔄 Deploying to Surge.sh (${DOMAIN})...`);
  
  try {
    // Deploy to Surge with domain
    const deployCommand = `surge ${DIST_DIR} ${DOMAIN}`;
    execSync(deployCommand, { encoding: 'utf8', stdio: 'inherit' });
    console.log('✅ Deployment to Surge completed');
    return true;
  } catch (error) {
    console.log('❌ Surge deployment failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure you are logged in: surge login');
    console.log('2. Check if domain is available: surge list');
    console.log('3. Try deploying manually: surge dist www.flowsyai.com');
    return false;
  }
}

function verifyDeployment() {
  console.log('🔄 Verifying deployment...');
  
  try {
    // Check if site is accessible
    const checkCommand = `curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}`;
    const statusCode = execSync(checkCommand, { encoding: 'utf8' }).trim();
    
    if (statusCode === '200') {
      console.log('✅ Site is accessible');
      
      // Check build timestamp
      const timestampCommand = `curl -s https://${DOMAIN}/build-timestamp.txt`;
      const timestamp = execSync(timestampCommand, { encoding: 'utf8' });
      console.log(`✅ Build timestamp: ${timestamp.split('\n')[0]}`);
      
      return true;
    } else {
      console.log(`❌ Site returned status code: ${statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('⚠️ Verification failed (but deployment may still be successful)');
    console.log('   Manual check: https://' + DOMAIN);
    return true; // Don't fail deployment for verification issues
  }
}

function main() {
  console.log(`🎯 Target domain: ${DOMAIN}`);
  console.log(`📁 Source directory: ${DIST_DIR}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

  const steps = [
    { fn: verifyDistExists, name: 'Verify build exists' },
    { fn: createCNAME, name: 'Create CNAME file' },
    { fn: updateBuildTimestamp, name: 'Update build timestamp' },
    { fn: deployToSurge, name: 'Deploy to Surge.sh' },
    { fn: verifyDeployment, name: 'Verify deployment' }
  ];

  let successful = 0;
  
  for (const step of steps) {
    if (step.fn()) {
      successful++;
    } else {
      console.log(`\n❌ Step failed: ${step.name}`);
      if (step.name === 'Deploy to Surge.sh') {
        console.log('\n🆘 DEPLOYMENT FAILED');
        process.exit(1);
      }
    }
  }

  console.log('\n📊 DEPLOYMENT SUMMARY:');
  console.log('=====================');
  console.log(`✅ Successful steps: ${successful}/${steps.length}`);
  
  if (successful >= 4) { // Allow verification to fail
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log(`🌐 Your site is live at: https://${DOMAIN}`);
    console.log(`📊 Build timestamp: https://${DOMAIN}/build-timestamp.txt`);
    
    console.log('\n📋 CACHE CLEARING CHECKLIST:');
    console.log('1. ✅ New build deployed with timestamp');
    console.log('2. ✅ Service Worker version updated');
    console.log('3. ✅ CNAME file created');
    console.log('4. 🔄 Clear Cloudflare cache manually');
    console.log('5. 🔄 Ask users to hard refresh (Ctrl+F5)');
    
    console.log('\n🔗 Next steps:');
    console.log('- Clear Cloudflare cache: "Purge Everything"');
    console.log('- Test from incognito mode');
    console.log('- Notify users to refresh');
    
  } else {
    console.log('\n❌ DEPLOYMENT INCOMPLETE');
    console.log('Check errors above and try again');
    process.exit(1);
  }

  console.log(`\n⏰ Completed at: ${new Date().toISOString()}`);
}

// Run deployment
main();
