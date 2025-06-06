#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the built bundle and provides insights on chunk sizes and optimization opportunities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('🔍 Analyzing bundle...\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));

  console.log('📊 JavaScript Chunks:');
  console.log('=====================');

  const jsStats = jsFiles
    .map(file => {
      const filePath = path.join(ASSETS_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        type: getChunkType(file),
      };
    })
    .sort((a, b) => b.size - a.size);

  let totalJsSize = 0;
  jsStats.forEach(file => {
    totalJsSize += file.size;
    const sizeStr = formatBytes(file.size);
    const typeStr = file.type ? `[${file.type}]` : '';
    console.log(`  ${file.name.padEnd(40)} ${sizeStr.padStart(10)} ${typeStr}`);
  });

  console.log('\n📊 CSS Files:');
  console.log('==============');

  const cssStats = cssFiles
    .map(file => {
      const filePath = path.join(ASSETS_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
      };
    })
    .sort((a, b) => b.size - a.size);

  let totalCssSize = 0;
  cssStats.forEach(file => {
    totalCssSize += file.size;
    const sizeStr = formatBytes(file.size);
    console.log(`  ${file.name.padEnd(40)} ${sizeStr.padStart(10)}`);
  });

  console.log('\n📈 Summary:');
  console.log('===========');
  console.log(`Total JavaScript: ${formatBytes(totalJsSize)}`);
  console.log(`Total CSS: ${formatBytes(totalCssSize)}`);
  console.log(`Total Assets: ${formatBytes(totalJsSize + totalCssSize)}`);
  console.log(`Number of JS chunks: ${jsStats.length}`);

  // Analyze large chunks
  const largeChunks = jsStats.filter(file => file.size > 500 * 1024); // > 500KB
  if (largeChunks.length > 0) {
    console.log('\n⚠️  Large Chunks (>500KB):');
    console.log('===========================');
    largeChunks.forEach(file => {
      console.log(`  ${file.name} - ${formatBytes(file.size)}`);
      console.log(`    Recommendation: ${getOptimizationRecommendation(file)}`);
    });
  }

  // Check for optimization opportunities
  console.log('\n💡 Optimization Recommendations:');
  console.log('=================================');

  if (totalJsSize > 2 * 1024 * 1024) {
    // > 2MB
    console.log('  • Consider more aggressive code splitting');
    console.log('  • Review and remove unused dependencies');
    console.log('  • Implement dynamic imports for heavy features');
  }

  if (jsStats.length < 5) {
    console.log('  • Consider splitting large chunks into smaller ones');
    console.log('  • Use manual chunking for better caching');
  }

  if (jsStats.length > 20) {
    console.log('  • Too many chunks may hurt performance');
    console.log('  • Consider consolidating smaller chunks');
  }

  const vendorChunks = jsStats.filter(file => file.type && file.type.includes('vendor'));
  if (vendorChunks.length === 0) {
    console.log('  • Consider creating vendor chunks for better caching');
  }

  console.log('\n✅ Analysis complete!');
}

function getChunkType(filename) {
  if (filename.includes('vendor')) return 'vendor';
  if (filename.includes('react')) return 'react';
  if (filename.includes('three')) return '3d';
  if (filename.includes('framer')) return 'animation';
  if (filename.includes('charts')) return 'charts';
  if (filename.includes('crypto')) return 'crypto';
  if (filename.includes('landing')) return 'landing';
  if (filename.includes('workflow')) return 'workflow';
  if (filename.includes('auth')) return 'auth';
  if (filename.includes('dashboard')) return 'dashboard';
  if (filename.includes('index')) return 'main';
  return null;
}

function getOptimizationRecommendation(file) {
  if (file.type === 'vendor') {
    return 'Split vendor libraries into smaller chunks';
  }
  if (file.type === '3d') {
    return 'Lazy load 3D components and use dynamic imports';
  }
  if (file.type === 'main') {
    return 'Move heavy components to separate chunks';
  }
  if (file.name.includes('NexusCrystal')) {
    return 'This 3D component should be lazy loaded and code-split';
  }
  return 'Consider code splitting this chunk further';
}

// Run the analysis
analyzeBundle();
