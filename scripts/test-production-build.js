#!/usr/bin/env node

/**
 * Test Production Build Script
 * Verifies that the production build is working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing Production Build...\n');

// Check if dist directory exists
const distPath = path.join(path.dirname(__dirname), 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found. Run npm run build first.');
  process.exit(1);
}

// Check critical files
const criticalFiles = ['index.html', 'assets', 'favicon.ico'];

console.log('📋 Checking critical files...');
for (const file of criticalFiles) {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} MISSING!`);
  }
}

// Check index.html content
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  console.log('\n📄 Analyzing index.html...');

  // Check for script tags
  const scriptMatches = indexContent.match(/<script[^>]*src="[^"]*"[^>]*>/g);
  if (scriptMatches) {
    console.log(`   ✅ Found ${scriptMatches.length} script tag(s)`);
    scriptMatches.forEach((script, index) => {
      console.log(`      ${index + 1}. ${script}`);
    });
  } else {
    console.log('   ❌ No script tags found!');
  }

  // Check for CSS links
  const cssMatches = indexContent.match(/<link[^>]*rel="stylesheet"[^>]*>/g);
  if (cssMatches) {
    console.log(`   ✅ Found ${cssMatches.length} CSS link(s)`);
    cssMatches.forEach((css, index) => {
      console.log(`      ${index + 1}. ${css}`);
    });
  } else {
    console.log('   ❌ No CSS links found!');
  }

  // Check for debug panel
  if (indexContent.includes('debug-panel')) {
    console.log('   ✅ Debug panel found');
  } else {
    console.log('   ❌ Debug panel missing');
  }
}

// Check assets directory
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  const cssFiles = assets.filter(file => file.endsWith('.css'));

  console.log('\n📦 Assets analysis...');
  console.log(`   ✅ Total assets: ${assets.length}`);
  console.log(`   ✅ JavaScript files: ${jsFiles.length}`);
  console.log(`   ✅ CSS files: ${cssFiles.length}`);

  // Check main bundle
  const mainJs = jsFiles.find(file => file.startsWith('main-'));
  if (mainJs) {
    console.log(`   ✅ Main bundle: ${mainJs}`);
    const mainJsPath = path.join(assetsPath, mainJs);
    const mainJsSize = fs.statSync(mainJsPath).size;
    console.log(`   📊 Main bundle size: ${(mainJsSize / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.log('   ❌ Main bundle not found!');
  }

  // Check main CSS
  const mainCss = cssFiles.find(file => file.startsWith('main-'));
  if (mainCss) {
    console.log(`   ✅ Main CSS: ${mainCss}`);
    const mainCssPath = path.join(assetsPath, mainCss);
    const mainCssSize = fs.statSync(mainCssPath).size;
    console.log(`   📊 Main CSS size: ${(mainCssSize / 1024).toFixed(2)} KB`);
  } else {
    console.log('   ❌ Main CSS not found!');
  }
}

console.log('\n✅ Production build test completed!');
console.log('\n💡 To test locally, run: npm run preview');
console.log('💡 To deploy to Vercel, run: vercel --prod');
