const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const exts = ['.tsx', '.ts', '.jsx', '.js']

function walk(dir){
  let results = []
  for(const f of fs.readdirSync(dir)){
    const full = path.join(dir,f)
    const st = fs.statSync(full)
    if(st.isDirectory()){
      // skip large or generated dirs; also skip our own scripts folder to avoid
      // false-positives (the checker script contains the word 'motion')
      if(f === 'node_modules' || f === '.next' || f === '.git' || f === 'scripts') continue
      results = results.concat(walk(full))
    } else {
      if(exts.includes(path.extname(f))) results.push(full)
    }
  }
  return results
}

const files = walk(root)
let found = []
for(const f of files){
  const src = fs.readFileSync(f,'utf8')
  if(/\b(from\s+['"]framer-motion['"])|\bmotion\b/.test(src)){
    // but skip files in .next
    if(f.includes(path.join(root,'.next'))) continue
    found.push(f)
  }
}

if(found.length){
  console.error('Found potential motion usage in these files:')
  for(const f of found) console.error(' -', path.relative(root,f))
  process.exit(2)
}
console.log('No framer-motion or motion usage found in source files.')
process.exit(0)
