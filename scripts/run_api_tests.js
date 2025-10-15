// Simple API integration tests. Ensure the app is running on http://localhost:3000
// Set ADMIN_PASSWORD to the same value used to start the server (e.g., 'testpass')

// polyfill fetch in Node
if(typeof fetch === 'undefined'){
  global.fetch = require('node-fetch')
}

async function run(){
  const base = 'http://localhost:3000'
  const adminPass = process.env.ADMIN_PASSWORD || 'testpass'
  const headers = { 'Content-Type': 'application/json' }

  try{
    // create an order
    const orderBody = { items: [{ id: 't1', name: 'test item', quantity: 1 }], total: 100, name: 'Tester', phone: '9999999999', payment: 'whatsapp' }
    let r = await fetch(base + '/api/orders/create', { method: 'POST', headers, body: JSON.stringify(orderBody) })
    let j = await r.json()
    if(!j.ok || !j.order || !j.order.id) throw new Error('create order failed: ' + JSON.stringify(j))
    console.log('create order ok, id=', j.order.id)

    const orderId = j.order.id

    // fetch local orders
    r = await fetch(base + '/api/orders/local')
    j = await r.json()
    if(!Array.isArray(j)) throw new Error('local orders not array')
    console.log('local orders count:', j.length)

    // admin endpoints have been removed in this build; skip admin API tests
    console.log('Skipping admin API checks (admin removed)')

    console.log('\nALL TESTS PASSED')
    process.exit(0)
  }catch(e){
    console.error('TEST FAILED:', e && e.message || e)
    process.exit(2)
  }
}

run()
