#!/usr/bin/env node

/**
 * FlowsyAI Deployment Readiness Verification Script
 *
 * This script verifies that all critical deployment issues have been resolved
 * and the application is ready for production deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔍 FlowsyAI Deployment Readiness Check\n');

let allChecksPass = true;
const issues = [];

// Check 1: Verify dist/index.html exists and has script tag
console.log('1. Checking production build...');
const distIndexPath = path.join(projectRoot, 'dist', 'index.html');
if (!fs.existsSync(distIndexPath)) {
  issues.push('❌ dist/index.html not found. Run "npm run build" first.');
  allChecksPass = false;
} else {
  const htmlContent = fs.readFileSync(distIndexPath, 'utf8');

  // Check for script tag with main bundle
  const hasMainScript =
    htmlContent.includes('<script type="module" crossorigin src="/assets/main-') &&
    htmlContent.includes('.js"></script>');

  if (hasMainScript) {
    console.log('   ✅ Main JavaScript bundle properly injected');
  } else {
    issues.push('❌ Main JavaScript bundle not found in HTML');
    allChecksPass = false;
  }

  // Check for CSS link
  const hasMainCSS =
    htmlContent.includes('<link rel="stylesheet" crossorigin href="/assets/main-') &&
    htmlContent.includes('.css">');

  if (hasMainCSS) {
    console.log('   ✅ Main CSS bundle properly linked');
  } else {
    issues.push('❌ Main CSS bundle not found in HTML');
    allChecksPass = false;
  }

  // Check for React vendor chunk
  const hasReactVendor = htmlContent.includes('react-vendor-');
  if (hasReactVendor) {
    console.log('   ✅ React vendor chunk properly configured');
  } else {
    console.log('   ⚠️  React vendor chunk not found (may be bundled differently)');
  }
}

// Check 2: Verify vercel.json exists and is properly configured
console.log('\n2. Checking Vercel configuration...');
const vercelConfigPath = path.join(projectRoot, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  issues.push('❌ vercel.json not found');
  allChecksPass = false;
} else {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

    if (vercelConfig.framework === 'vite') {
      console.log('   ✅ Framework correctly set to vite');
    } else {
      issues.push('❌ Framework not set to vite in vercel.json');
      allChecksPass = false;
    }

    if (vercelConfig.outputDirectory === 'dist') {
      console.log('   ✅ Output directory correctly set to dist');
    } else {
      issues.push('❌ Output directory not set to dist in vercel.json');
      allChecksPass = false;
    }

    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      console.log('   ✅ SPA routing rewrites configured');
    } else {
      issues.push('❌ SPA routing rewrites not configured');
      allChecksPass = false;
    }
  } catch (error) {
    issues.push('❌ vercel.json is not valid JSON');
    allChecksPass = false;
  }
}

// Check 3: Verify vite.config.ts has proper input configuration
console.log('\n3. Checking Vite configuration...');
const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
if (!fs.existsSync(viteConfigPath)) {
  issues.push('❌ vite.config.ts not found');
  allChecksPass = false;
} else {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

  if (viteConfig.includes('input:') && viteConfig.includes('./index.html')) {
    console.log('   ✅ HTML input properly configured');
  } else {
    console.log('   ⚠️  HTML input configuration not found (may use default)');
  }

  if (viteConfig.includes('manualChunks')) {
    console.log('   ✅ Manual chunks configured for optimization');
  } else {
    console.log('   ⚠️  Manual chunks not configured');
  }
}

// Check 4: Verify package.json has correct scripts
console.log('\n4. Checking package.json scripts...');
const packageJsonPath = path.join(projectRoot, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  issues.push('❌ package.json not found');
  allChecksPass = false;
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('   ✅ Build script configured');
  } else {
    issues.push('❌ Build script not found in package.json');
    allChecksPass = false;
  }

  if (packageJson.scripts && packageJson.scripts.preview) {
    console.log('   ✅ Preview script available for testing');
  } else {
    console.log('   ⚠️  Preview script not found');
  }
}

// Check 5: Verify critical dependencies
console.log('\n5. Checking critical dependencies...');
const nodeModulesPath = path.join(projectRoot, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  issues.push('❌ node_modules not found. Run "npm install" first.');
  allChecksPass = false;
} else {
  const criticalDeps = ['react', 'react-dom', 'vite', '@vitejs/plugin-react-swc'];
  criticalDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      issues.push(`❌ ${dep} not installed`);
      allChecksPass = false;
    }
  });
}

// Final report
console.log('\n' + '='.repeat(50));
console.log('📊 DEPLOYMENT READINESS REPORT');
console.log('='.repeat(50));

if (allChecksPass) {
  console.log('🎉 ALL CHECKS PASSED!');
  console.log('✅ Your application is ready for deployment to Vercel.');
  console.log('\n📋 Next steps:');
  console.log('1. Commit and push your changes to your repository');
  console.log('2. Deploy to Vercel (automatic if connected to Git)');
  console.log('3. Test the production deployment');
  console.log('\n🚀 Happy deploying!');
  process.exit(0);
} else {
  console.log('❌ DEPLOYMENT NOT READY');
  console.log('\n🔧 Issues found:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('\n💡 Please fix these issues before deploying.');
  process.exit(1);
}
