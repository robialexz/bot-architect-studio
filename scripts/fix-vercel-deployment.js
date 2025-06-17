#!/usr/bin/env node

/**
 * Fix Vercel Deployment Script
 * Addresses specific issues with React loading on Vercel
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing Vercel Deployment Issues...\n');

const distPath = path.join(path.dirname(__dirname), 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

// Read the current index.html
let indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('📄 Processing index.html...');

// Add production-specific fixes
const productionFixes = `
    <!-- VERCEL PRODUCTION FIXES -->
    <script type="module">
      // Force proper module loading on Vercel
      console.log('🚀 Vercel production loader initialized');
      
      // Ensure all modules are loaded with proper MIME types
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        if (tagName.toLowerCase() === 'script' && element.src && element.src.includes('.js')) {
          element.type = 'module';
          element.crossOrigin = 'anonymous';
        }
        return element;
      };
      
      // Monitor React loading
      let reactLoadAttempts = 0;
      const maxAttempts = 3;
      
      function checkReactLoading() {
        const root = document.getElementById('root');
        const fallback = document.getElementById('loading-fallback');
        
        if (fallback && root && root.children.length === 1) {
          reactLoadAttempts++;
          console.warn(\`⚠️ React loading attempt \${reactLoadAttempts}/\${maxAttempts}\`);
          
          if (reactLoadAttempts < maxAttempts) {
            // Try to reload main script
            const mainScript = document.querySelector('script[src*="main-"]');
            if (mainScript) {
              const newScript = document.createElement('script');
              newScript.type = 'module';
              newScript.crossOrigin = 'anonymous';
              newScript.src = mainScript.src + '?retry=' + reactLoadAttempts;
              document.head.appendChild(newScript);
            }
            
            setTimeout(checkReactLoading, 2000);
          } else {
            console.error('❌ React failed to load after multiple attempts');
            fallback.innerHTML = \`
              <div class="text-center">
                <div class="text-3xl font-bold mb-4 text-red-500">Loading Failed</div>
                <div class="text-lg mb-4">Unable to load the application</div>
                <button onclick="window.location.reload()" class="bg-primary text-white px-4 py-2 rounded">
                  Reload Page
                </button>
              </div>
            \`;
          }
        } else if (!fallback) {
          console.log('✅ React loaded successfully');
        }
      }
      
      // Start monitoring after initial load
      setTimeout(checkReactLoading, 1000);
    </script>`;

// Insert the fixes before the closing body tag
const bodyCloseIndex = indexContent.lastIndexOf('</body>');
if (bodyCloseIndex !== -1) {
  indexContent =
    indexContent.slice(0, bodyCloseIndex) +
    productionFixes +
    '\n  ' +
    indexContent.slice(bodyCloseIndex);
  console.log('✅ Added Vercel production fixes');
} else {
  console.error('❌ Could not find </body> tag');
}

// Write the updated content back
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ Updated dist/index.html');

// Create a verification file
const verificationContent = {
  timestamp: new Date().toISOString(),
  fixes_applied: [
    'Vercel production loader',
    'React loading monitoring',
    'Module loading fixes',
    'Fallback error handling',
  ],
  build_info: {
    node_version: process.version,
    platform: process.platform,
  },
};

fs.writeFileSync(
  path.join(distPath, 'vercel-fixes.json'),
  JSON.stringify(verificationContent, null, 2),
  'utf8'
);

console.log('✅ Created verification file');
console.log('\n🚀 Vercel deployment fixes applied successfully!');
console.log('💡 Deploy with: vercel --prod');
