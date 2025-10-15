// Razorpay integration removed. This route intentionally returns 410 Gone.
export default function handler(req, res){
  res.status(410).json({ ok: false, message: 'Razorpay integration removed' })
}
