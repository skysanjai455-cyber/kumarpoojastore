const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'data', 'orders.json')
let arr = []
try{ arr = JSON.parse(fs.readFileSync(p,'utf8')) }catch(e){ arr = [] }
const saved = { id: Date.now().toString(), created_at: new Date().toISOString(), items:[{name:'TestItem',quantity:1,price:10}], total:10, name:'Tester', phone:'0000000000', payment:'test' }
arr.unshift(saved)
fs.writeFileSync(p, JSON.stringify(arr,null,2))
console.log('Wrote order', saved.id)
