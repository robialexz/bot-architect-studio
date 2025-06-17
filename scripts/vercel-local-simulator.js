#!/usr/bin/env node

/**
 * Vercel Local Simulator
 * Simulates Vercel's production environment locally to test deployment issues
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import url from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3005;
const distPath = path.join(path.dirname(__dirname), 'dist');

console.log('🚀 Starting Vercel Local Simulator...\n');

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found. Run npm run build first.');
  process.exit(1);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.html':
      return 'text/html; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.ico':
      return 'image/x-icon';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

function setVercelHeaders(res, filePath, requestUrl) {
  const contentType = getContentType(filePath);
  res.setHeader('Content-Type', contentType);

  // Simulate Vercel caching headers
  if (requestUrl.startsWith('/assets/') || filePath.includes('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (filePath.endsWith('.html')) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`📋 ${req.method} ${pathname}`);

  // Handle root path
  if (pathname === '/') {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      setVercelHeaders(res, indexPath, pathname);
      const content = fs.readFileSync(indexPath);
      res.writeHead(200);
      res.end(content);
      console.log(`📁 Served: index.html`);
      return;
    }
  }

  // Try to serve static file
  const filePath = path.join(distPath, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    setVercelHeaders(res, filePath, pathname);
    const content = fs.readFileSync(filePath);
    res.writeHead(200);
    res.end(content);
    console.log(`📁 Served: ${pathname}`);
    return;
  }

  // SPA fallback - serve index.html for non-asset routes
  if (!pathname.startsWith('/api') && !pathname.startsWith('/assets') && !pathname.includes('.')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      setVercelHeaders(res, indexPath, pathname);
      const content = fs.readFileSync(indexPath);
      res.writeHead(200);
      res.end(content);
      console.log(`🔄 SPA Fallback: ${pathname} -> /index.html`);
      return;
    }
  }

  // 404 for everything else
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
  console.log(`❌ 404: ${pathname}`);
});

server.listen(PORT, () => {
  console.log(`✅ Vercel Local Simulator running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log(`🔍 Simulating Vercel production environment\n`);

  console.log('🧪 Test URLs:');
  console.log(`   Main app: http://localhost:${PORT}`);
  console.log(`   Assets: http://localhost:${PORT}/assets/`);
  console.log(`   Debug: http://localhost:${PORT}/debug`);
  console.log('\n💡 This simulates exactly how Vercel serves your app');
  console.log('💡 Check browser console and network tab for issues');
  console.log('💡 Press Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Vercel Local Simulator...');
  server.close();
  process.exit(0);
});
