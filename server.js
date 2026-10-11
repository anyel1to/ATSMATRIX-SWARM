/** Minimal zero-dependency static server for local dev. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  file = path.normalize(file).replace(/^(\..[\/\\])+/, '');
  const full = path.join(__dirname, file);
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(3000, () => console.log('▶ ATSMATRIX SWARM running at http://localhost:3000'));
