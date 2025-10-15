const { execSync } = require('child_process')
try{
  console.log('Running test_write_orders.js...')
  const out = execSync('node scripts/test_write_orders.js', { encoding: 'utf8' })
  console.log(out)
  console.log('Test completed OK')
}catch(e){
  console.error('Test failed', e.stdout || e.message)
  process.exit(1)
}
