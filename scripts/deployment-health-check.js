#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Verifies that the built application is ready for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Running deployment health check...\n');

const distDir = path.join(path.dirname(__dirname), 'dist');
const errors = [];
const warnings = [];

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  errors.push('❌ dist directory not found. Run build first.');
  process.exit(1);
}

// Check for critical files
const criticalFiles = [
  'index.html',
  'manifest.webmanifest',
  'assets'
];

criticalFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`❌ Critical file missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check index.html content
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for React root element
  if (!indexContent.includes('id="root"')) {
    errors.push('❌ index.html missing root element');
  }
  
  // Check for manifest link
  if (!indexContent.includes('manifest.webmanifest')) {
    warnings.push('⚠️  index.html missing manifest link');
  }
  
  // Check for basic meta tags
  if (!indexContent.includes('<meta charset="utf-8">')) {
    warnings.push('⚠️  index.html missing charset meta tag');
  }
  
  console.log('✅ index.html structure validated');
}

// Check manifest.webmanifest
const manifestPath = path.join(distDir, 'manifest.webmanifest');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    if (!manifest.name) {
      warnings.push('⚠️  manifest.webmanifest missing name');
    }
    
    if (!manifest.start_url) {
      warnings.push('⚠️  manifest.webmanifest missing start_url');
    }
    
    console.log('✅ manifest.webmanifest validated');
  } catch (error) {
    errors.push('❌ manifest.webmanifest is not valid JSON');
  }
}

// Check assets directory
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const assets = fs.readdirSync(assetsDir);
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  const cssFiles = assets.filter(file => file.endsWith('.css'));
  
  if (jsFiles.length === 0) {
    errors.push('❌ No JavaScript files found in assets');
  } else {
    console.log(`✅ Found ${jsFiles.length} JavaScript files`);
  }
  
  if (cssFiles.length === 0) {
    warnings.push('⚠️  No CSS files found in assets');
  } else {
    console.log(`✅ Found ${cssFiles.length} CSS files`);
  }
  
  // Check for main entry point
  const mainJs = jsFiles.find(file => file.includes('index') || file.includes('main'));
  if (!mainJs) {
    warnings.push('⚠️  No main JavaScript entry point found');
  } else {
    console.log(`✅ Main entry point: ${mainJs}`);
  }
}

// Check for React imports in main JS file
const assetsFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
const mainJsFile = assetsFiles.find(file => file.includes('index') && file.endsWith('.js'));

if (mainJsFile) {
  const mainJsPath = path.join(assetsDir, mainJsFile);
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Check for React presence (basic check)
  if (!mainJsContent.includes('React') && !mainJsContent.includes('react')) {
    warnings.push('⚠️  React not detected in main JavaScript file');
  } else {
    console.log('✅ React detected in main JavaScript file');
  }
}

// Summary
console.log('\n📊 Health Check Summary:');
console.log(`✅ Passed checks: ${criticalFiles.length - errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Errors: ${errors.length}`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(error => console.log(`  ${error}`));
  console.log('\n💥 Deployment health check failed!');
  process.exit(1);
} else {
  console.log('\n🎉 Deployment health check passed!');
  console.log('✅ Application is ready for deployment');
}
