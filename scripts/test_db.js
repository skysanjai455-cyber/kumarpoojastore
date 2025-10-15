const { getProducts, saveProducts, getOrders, saveOrder, updateOrderStatus } = require('../lib/db')

async function run(){
  let originalProducts
  try{
    originalProducts = await getProducts()
    console.log('Products (before):', originalProducts.length)

    // run product save against a temporary test set, then restore original
    const testProducts = [{ id: 'tprod1', slug: 'tprod1', name: 'Test Prod', description: 'desc', images: [], stock: 10 }]
    await saveProducts(testProducts)
    console.log('Products (after save - test only):', (await getProducts()).length)

    console.log('Orders (before):', (await getOrders()).length)
    const saved = await saveOrder({ id: 'tord1', created_at: new Date().toISOString(), data: { items: [] }, status: 'new' })
    console.log('Saved order id:', saved.id)
    const orders = await getOrders()
    console.log('Orders (after save):', orders.length)

    const updated = await updateOrderStatus('tord1', 'fulfilled')
    console.log('Updated order status:', updated && updated.status)

    console.log('DB tests passed')
    return 0
  }catch(e){
    console.error('DB tests failed', e)
    return 2
  }finally{
    // restore original products to avoid destructive behavior
    try{
      if(originalProducts){
        await saveProducts(originalProducts)
        console.log('Original products restored:', originalProducts.length)
      }
    }catch(e){
      console.error('Failed to restore original products', e)
      // still exit with prior code
    }
  }
}

run().then(code => process.exit(code)).catch(e => { console.error(e); process.exit(2) })
