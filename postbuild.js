const fs = require('fs')
const path = require('path')

// CSS file is at .vitepress/styles/custom.css
const cssPath = path.join(__dirname, '.vitepress', 'styles', 'custom.css')
const customCSS = fs.readFileSync(cssPath, 'utf8')

// Inject the custom CSS into the built HTML files as <style> tags in the <head>
const distDir = path.join(__dirname, '.vitepress', 'dist')
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'))

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  // Inject after <head> opening tag
  content = content.replace('<head>', `<head>\n    <style>\n${customCSS}\n    </style>`)
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`Injected CSS into ${file}`)
})

console.log(`Post-build CSS injection complete: ${htmlFiles.length} files`)