const path = require('path')

async function run(){
  const handler = require(path.join(process.cwd(),'pages','api','orders','create.js')).default
  const req = { method: 'POST', body: { items:[{name:'Direct Test',quantity:1,price:50}], total:50, name:'Direct', phone:'8888888888', payment:'upi' } }
  const res = {
    statusCode: 200,
    headers: {},
    status(code){ this.statusCode = code; return this },
    json(obj){ console.log('res.json ->', obj); return obj },
    end(text){ console.log('res.end ->', text); }
  }

  await handler(req, res)
}

run().catch(e=>{ console.error(e); process.exit(1) })
