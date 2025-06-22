#!/usr/bin/env node
/**
 * Cache Busting Script for FlowsyAI
 * Updates Service Worker version and build timestamp before deployment
 */

import fs from 'fs';
import path from 'path';

function updateServiceWorkerVersion() {
  console.log('🔄 Updating Service Worker version...');
  
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.log('⚠️  Service Worker not found');
    return false;
  }

  try {
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Generate new version with timestamp
    const newVersion = `v${Date.now()}`;
    
    // Update cache names
    swContent = swContent.replace(
      /const CACHE_NAME = 'ai-flow-v[\d]+';/,
      `const CACHE_NAME = 'ai-flow-${newVersion}';`
    );
    
    swContent = swContent.replace(
      /const STATIC_CACHE_NAME = 'ai-flow-static-v[\d]+';/,
      `const STATIC_CACHE_NAME = 'ai-flow-static-${newVersion}';`
    );
    
    swContent = swContent.replace(
      /const DYNAMIC_CACHE_NAME = 'ai-flow-dynamic-v[\d]+';/,
      `const DYNAMIC_CACHE_NAME = 'ai-flow-dynamic-${newVersion}';`
    );

    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker updated to: ${newVersion}`);
    return true;
  } catch (error) {
    console.log('❌ Service Worker update failed:', error.message);
    return false;
  }
}

function updateBuildTimestamp() {
  console.log('🔄 Updating build timestamp...');
  
  const timestampPath = path.join(process.cwd(), 'public', 'build-timestamp.txt');
  const timestamp = new Date().toISOString();
  
  const content = `Build timestamp: ${timestamp}
This file forces a fresh build on Vercel to ensure asset hashes are correctly synchronized.
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

function main() {
  console.log('🚀 CACHE BUSTING FOR FLOWSYAI');
  console.log('============================');
  
  const results = [];
  results.push(updateServiceWorkerVersion());
  results.push(updateBuildTimestamp());
  
  const successful = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${successful}/${total} successful`);
  
  if (successful === total) {
    console.log('✅ Cache busting completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Some cache busting operations failed');
    process.exit(1);
  }
}

main();
