// Prints the resolved next.config.mjs export for debugging
import('./../next.config.mjs').then(mod=>{
  console.log(JSON.stringify(mod.default || mod, null, 2))
}).catch(err=>{
  console.error('Failed to load next.config.mjs', err && err.message)
  process.exit(1)
})
