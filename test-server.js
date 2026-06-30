const http = require('http')
const path = require('path')
const fs = require('fs')

const DIST_DIR = path.join(__dirname, '.vitepress', 'dist')
const PORT = 8765

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
}

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url
  // Remove query string
  url = url.split('?')[0]
  
  const filePath = path.join(DIST_DIR, url)
  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html for fallback routing
      if (url.endsWith('.html') === false) {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('Not Found')
            return
          }
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(data2)
        })
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      }
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running at http://127.0.0.1:${PORT}`)
})