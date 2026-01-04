/**
 * Simple script to check bundle size without opening browser
 * Run: node scripts/check-bundle-size.js
 */

const fs = require('fs')
const path = require('path')

const nextDir = path.join(__dirname, '..', '.next')
const staticDir = path.join(nextDir, 'static', 'chunks')

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (error) {
    return 0
  }
}

function findLargeFiles(dir, maxDepth = 3, currentDepth = 0) {
  const files = []
  
  if (!fs.existsSync(dir) || currentDepth > maxDepth) {
    return files
  }
  
  try {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...findLargeFiles(fullPath, maxDepth, currentDepth + 1))
      } else if (stat.isFile()) {
        const size = stat.size
        if (size > 100 * 1024) { // Files larger than 100KB
          files.push({
            path: fullPath.replace(nextDir, '.next'),
            size: size,
            formatted: formatBytes(size)
          })
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return files
}

console.log('🔍 Checking Bundle Size...\n')

if (!fs.existsSync(nextDir)) {
  console.log('❌ .next directory not found. Please run "npm run build" first.')
  process.exit(1)
}

const largeFiles = findLargeFiles(nextDir)
largeFiles.sort((a, b) => b.size - a.size)

console.log('📦 Large Files (> 100KB):\n')
console.log('─'.repeat(60))

let totalSize = 0
largeFiles.forEach((file, index) => {
  totalSize += file.size
  const isLarge = file.size > 500 * 1024 // > 500KB
  const icon = isLarge ? '⚠️' : '✅'
  console.log(`${icon} ${(index + 1).toString().padStart(2, ' ')}. ${file.path}`)
  console.log(`   Size: ${file.formatted}`)
  console.log('')
})

console.log('─'.repeat(60))
console.log(`📊 Total: ${formatBytes(totalSize)}`)
console.log(`📁 Files: ${largeFiles.length}`)
console.log('')

// Recommendations
const veryLargeFiles = largeFiles.filter(f => f.size > 500 * 1024)
if (veryLargeFiles.length > 0) {
  console.log('⚠️  Warning: Found very large files (> 500KB):')
  veryLargeFiles.forEach(file => {
    console.log(`   - ${file.path}: ${file.formatted}`)
  })
  console.log('')
  console.log('💡 Recommendations:')
  console.log('   1. Use dynamic imports for large components')
  console.log('   2. Remove unused dependencies')
  console.log('   3. Use code splitting')
  console.log('')
} else {
  console.log('✅ All files are reasonably sized!')
}
