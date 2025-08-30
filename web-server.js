const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000; // Use port 9000

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = req.url;
  
  // Default to index.html for root path
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'text/plain';
  
  // Read the file
  fs.readFile(path.join(__dirname, filePath), (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  const actualPort = server.address().port;
  console.log(`🚀 Web server running at http://localhost:${actualPort}`);
  console.log(`📱 Open your browser and navigate to: http://localhost:${actualPort}`);
  console.log(`🖥️  This is the exact same application as the desktop version!`);
  console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down web server...');
  server.close(() => {
    console.log('✅ Web server stopped');
    process.exit(0);
  });
});
