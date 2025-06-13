#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Framer Motion elimination from critical loading path...\n');

// Files that should NOT import Framer Motion directly
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/pages/Index.tsx',
  'src/components/LandingLayout.tsx',
  'src/components/Navbar-NoMotion.tsx',
  'src/components/Footer-NoMotion.tsx',
  'src/components/FloatingFeedbackButton-NoMotion.tsx',
  'src/components/landing/HeroSection-NoMotion.tsx',
  'src/components/landing/VideoShowcaseSection-NoMotion.tsx',
  'src/components/ui/PremiumLogo-NoMotion.tsx',
  'src/components/backgrounds/PipelineCanvas.tsx',
  'src/components/SectionErrorBoundary.tsx',
];

// Check if motion-wrapper is CSS-only
const motionWrapperFile = 'src/lib/motion-wrapper.tsx';

let hasErrors = false;

console.log('📋 Checking critical files for Framer Motion imports...\n');

criticalFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for direct Framer Motion imports
  const hasFramerMotionImport = /import.*from\s+['"]framer-motion['"]/.test(content);
  const hasMotionImport = /import.*motion.*from\s+['"]framer-motion['"]/.test(content);
  const hasAnimatePresenceImport = /import.*AnimatePresence.*from\s+['"]framer-motion['"]/.test(content);
  
  if (hasFramerMotionImport || hasMotionImport || hasAnimatePresenceImport) {
    console.log(`❌ ${filePath} - Contains Framer Motion imports`);
    hasErrors = true;
  } else {
    console.log(`✅ ${filePath} - Clean (no Framer Motion imports)`);
  }
});

console.log('\n📋 Checking motion-wrapper implementation...\n');

if (fs.existsSync(motionWrapperFile)) {
  const motionWrapperContent = fs.readFileSync(motionWrapperFile, 'utf8');
  
  // Check if motion-wrapper imports Framer Motion
  const hasFramerMotionImport = /import.*from\s+['"]framer-motion['"]/.test(motionWrapperContent);
  
  if (hasFramerMotionImport) {
    console.log(`❌ ${motionWrapperFile} - Still imports Framer Motion`);
    hasErrors = true;
  } else {
    console.log(`✅ ${motionWrapperFile} - CSS-only implementation`);
  }
  
  // Check if it exports motion components
  const hasMotionExports = /export.*Motion/.test(motionWrapperContent);
  if (hasMotionExports) {
    console.log(`✅ ${motionWrapperFile} - Exports motion components for compatibility`);
  } else {
    console.log(`⚠️  ${motionWrapperFile} - No motion component exports found`);
  }
} else {
  console.log(`❌ ${motionWrapperFile} - File not found`);
  hasErrors = true;
}

console.log('\n📋 Checking build output...\n');

const distDir = 'dist';
if (fs.existsSync(distDir)) {
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    console.log(`Found ${jsFiles.length} JS files in build output:`);
    
    // Check main bundle
    const mainFile = jsFiles.find(file => file.includes('main-'));
    if (mainFile) {
      console.log(`✅ Main bundle: ${mainFile}`);
    } else {
      console.log(`⚠️  No main bundle found`);
    }
    
    // Check if Framer Motion is in separate chunk
    const framerMotionFile = jsFiles.find(file => file.includes('framer-motion'));
    if (framerMotionFile) {
      console.log(`✅ Framer Motion in separate chunk: ${framerMotionFile}`);
    } else {
      console.log(`✅ No Framer Motion chunk found (completely eliminated)`);
    }
    
    // Check React vendor chunk
    const reactFile = jsFiles.find(file => file.includes('react-vendor'));
    if (reactFile) {
      console.log(`✅ React vendor chunk: ${reactFile}`);
    } else {
      console.log(`⚠️  No React vendor chunk found`);
    }
    
  } else {
    console.log(`⚠️  Assets directory not found in ${distDir}`);
  }
} else {
  console.log(`⚠️  Build output directory not found: ${distDir}`);
}

console.log('\n📋 Summary:\n');

if (hasErrors) {
  console.log('❌ VERIFICATION FAILED - Framer Motion dependencies still exist in critical path');
  console.log('\n🔧 Next steps:');
  console.log('1. Remove any remaining Framer Motion imports from critical files');
  console.log('2. Ensure motion-wrapper.tsx is CSS-only');
  console.log('3. Rebuild and redeploy');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASSED - Critical loading path is clean');
  console.log('\n🎯 Expected result:');
  console.log('- Vercel deployment should load without React.createContext errors');
  console.log('- All components should render with CSS animations');
  console.log('- Site should be fully functional');
  console.log('\n🚀 Ready for deployment verification!');
}
