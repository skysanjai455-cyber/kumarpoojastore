const http = require('http')

const data = JSON.stringify({
  items: [{ name: 'Test Flower', quantity: 1, price: 100 }],
  total: 100,
  name: 'Tester',
  phone: '9999999999',
  payment: 'whatsapp'
})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}

const req = http.request(options, res => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Response:', body)
  })
})

req.on('error', e => console.error('Request error', e))
req.write(data)
req.end()
