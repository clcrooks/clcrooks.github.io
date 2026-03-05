const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT = 4443;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.JPG':  'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.json': 'application/json',
};

const opts = {
  key:  fs.readFileSync(path.join(ROOT, 'key.pem')),
  cert: fs.readFileSync(path.join(ROOT, 'cert.pem')),
};

https.createServer(opts, (req, res) => {
  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}
  if (urlPath === '/' || urlPath === '') urlPath = '/index-v9.html';

  const filePath = path.join(ROOT, urlPath);

  // Security: stay within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  HTTPS server running\n`);
  console.log(`  Local:   https://localhost:${PORT}`);
  console.log(`  Network: https://10.0.0.69:${PORT}\n`);
  console.log(`  iPhone:  https://10.0.0.69:${PORT}`);
});
