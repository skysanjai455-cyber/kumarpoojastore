const fetch = require('node-fetch')

const BASE = process.env.BASE || 'http://localhost:3000'
const pages = ['/', '/products', '/product/prod-1', '/checkout']

async function run(){
  console.log('Testing pages on', BASE)
  for(const p of pages){
    const url = BASE + p
    try{
      const r = await fetch(url)
      if(r.status !== 200){
        console.error('FAIL', p, 'status', r.status)
        process.exit(2)
      }
      console.log('OK', p)
    }catch(e){
      console.error('ERROR', p, e.message)
      process.exit(2)
    }
  }
  console.log('All pages OK')
}

run()
