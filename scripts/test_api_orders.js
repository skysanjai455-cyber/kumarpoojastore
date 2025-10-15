const fetch = require('node-fetch')

const BASE = 'http://localhost:3000'

async function run(){
  console.log('Ensure your dev server is running at', BASE)
  try{
    console.log('Admin API tests skipped (admin removed)')
  }catch(e){
    console.error('API orders tests failed', e.message)
    process.exit(2)
  }
}

run()
