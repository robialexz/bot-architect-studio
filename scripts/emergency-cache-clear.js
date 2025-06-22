#!/usr/bin/env node
/**
 * Emergency Cache Clear Script for FlowsyAI
 * Clears all caching layers to ensure users see the latest version
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const DOMAIN = process.env.DOMAIN || 'flowsyai.com';
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

console.log('🚨 EMERGENCY CACHE CLEAR FOR FLOWSYAI');
console.log('=====================================');

async function clearCloudflareCache() {
  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
    console.log('⚠️  Cloudflare credentials not found. Manual clear needed.');
    console.log('   1. Go to Cloudflare Dashboard');
    console.log('   2. Select your domain');
    console.log('   3. Go to Caching > Configuration');
    console.log('   4. Click "Purge Everything"');
    return false;
  }

  try {
    console.log('🔄 Clearing Cloudflare cache...');
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cloudflare cache cleared successfully');
      return true;
    } else {
      console.log('❌ Cloudflare cache clear failed:', result.errors);
      return false;
    }
  } catch (error) {
    console.log('❌ Cloudflare API error:', error.message);
    return false;
  }
}

function updateServiceWorkerVersion() {
  console.log('🔄 Updating Service Worker version...');
  
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.log('⚠️  Service Worker not found at public/sw.js');
    return false;
  }

  try {
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Generate new version with timestamp
    const newVersion = `v${Date.now()}`;
    
    // Update cache names
    swContent = swContent.replace(
      /const CACHE_NAME = 'ai-flow-v[\d.]+';/,
      `const CACHE_NAME = 'ai-flow-${newVersion}';`
    );
    
    swContent = swContent.replace(
      /const STATIC_CACHE_NAME = 'ai-flow-static-v[\d.]+';/,
      `const STATIC_CACHE_NAME = 'ai-flow-static-${newVersion}';`
    );
    
    swContent = swContent.replace(
      /const DYNAMIC_CACHE_NAME = 'ai-flow-dynamic-v[\d.]+';/,
      `const DYNAMIC_CACHE_NAME = 'ai-flow-dynamic-${newVersion}';`
    );

    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Service Worker updated to version: ${newVersion}`);
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
  
  try {
    fs.writeFileSync(timestampPath, timestamp);
    console.log(`✅ Build timestamp updated: ${timestamp}`);
    return true;
  } catch (error) {
    console.log('❌ Build timestamp update failed:', error.message);
    return false;
  }
}

function generateCacheBustingHeaders() {
  console.log('🔄 Generating cache-busting headers...');
  
  const headersPath = path.join(process.cwd(), 'public', '_headers');
  
  const newHeaders = `# Cache-busting headers for FlowsyAI
# Generated: ${new Date().toISOString()}

# HTML files - no cache
/*.html
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Root index
/
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Service Worker - no cache
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# Build timestamp - no cache
/build-timestamp.txt
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

# JavaScript assets with hash - long cache
/assets/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

# CSS assets with hash - long cache
/assets/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

# Images and fonts - medium cache
/assets/*.{png,jpg,jpeg,gif,svg,webp,woff,woff2}
  Cache-Control: public, max-age=86400

# Manifest file
/manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400

# Favicon
/favicon.ico
  Content-Type: image/x-icon
  Cache-Control: public, max-age=86400

# Security headers for all pages
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`;

  try {
    fs.writeFileSync(headersPath, newHeaders);
    console.log('✅ Cache-busting headers generated');
    return true;
  } catch (error) {
    console.log('❌ Headers generation failed:', error.message);
    return false;
  }
}

async function main() {
  console.log(`🎯 Target domain: ${DOMAIN}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

  const results = [];

  // 1. Update Service Worker version
  results.push(updateServiceWorkerVersion());

  // 2. Update build timestamp
  results.push(updateBuildTimestamp());

  // 3. Generate cache-busting headers
  results.push(generateCacheBustingHeaders());

  // 4. Clear Cloudflare cache
  results.push(await clearCloudflareCache());

  console.log('\n📊 RESULTS SUMMARY:');
  console.log('==================');
  
  const successful = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`✅ Successful operations: ${successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 ALL CACHE CLEARING OPERATIONS COMPLETED!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Rebuild and redeploy your application');
    console.log('2. Test from multiple devices/locations');
    console.log('3. Ask users to hard refresh (Ctrl+F5)');
    console.log('4. Monitor for consistency across all users');
  } else {
    console.log('\n⚠️  Some operations failed. Check logs above.');
    console.log('\n📋 MANUAL STEPS NEEDED:');
    console.log('1. Clear Cloudflare cache manually if API failed');
    console.log('2. Update Service Worker version manually');
    console.log('3. Rebuild and redeploy');
  }

  console.log(`\n⏰ Completed at: ${new Date().toISOString()}`);
}

// Run the script
main().catch(console.error);
