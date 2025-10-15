const fs = require('fs')
const path = require('path')

const p = path.join(process.cwd(), 'data', 'orders.json')
let arr = []
try{
  const raw = fs.readFileSync(p, 'utf8')
  arr = JSON.parse(raw)
  if(!Array.isArray(arr)) arr = []
}catch(e){ arr = [] }

const saved = { id: Date.now().toString(), created_at: new Date().toISOString(), items:[{name:'DirectAppend',quantity:2,price:30}], total:60, name:'Append', phone:'7777777777', payment:'cod' }
arr.unshift(saved)
fs.writeFileSync(p, JSON.stringify(arr, null, 2))
console.log('Appended order', saved.id)
