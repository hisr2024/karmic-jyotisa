const http = require('http')

function fetchHtml(url){
  return new Promise((resolve,reject)=>{
    http.get(url,res=>{
      let d=''
      res.on('data',c=>d+=c)
      res.on('end',()=>resolve({ status: res.statusCode, body: d }))
    }).on('error',reject)
  })
}

(async function(){
  try{
    const url = process.argv[2] || 'http://127.0.0.1:3000'
    const r = await fetchHtml(url)
    if(r.status !== 200){
      console.error('Bad status', r.status)
      process.exit(2)
    }
    if(!/Mokṣa Current|Moksa Current|Signals of renunciation/i.test(r.body)){
      console.error('Smoke check failed: Theme text not found')
      process.exit(3)
    }
    console.log('Smoke test passed')
    process.exit(0)
  }catch(e){
    console.error('Error fetching', e && e.message)
    process.exit(1)
  }
})()
