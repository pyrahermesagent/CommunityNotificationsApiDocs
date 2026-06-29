const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8765
const DIR = path.join(__dirname, '.vitepress/dist')

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webm': 'video/webm',
  '.webp': 'image/webp'
}

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url
  
  // Handle base path rewriting
  if (urlPath.startsWith('/CommunityNotificationsApiDocs/')) {
    urlPath = urlPath.replace('/CommunityNotificationsApiDocs', '')
  }
  
  const filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath)
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404)
        res.end('Not Found')
      } else {
        res.writeHead(500)
        res.end('Server Error')
      }
    } else {
      const ext = path.parse(filePath).ext
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      })
      res.end(content, 'utf-8')
    }
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running at http://127.0.0.1:${PORT}`)
})
