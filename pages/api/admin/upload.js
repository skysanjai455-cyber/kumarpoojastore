export default function handler(req, res){
  return res.status(404).json({ ok: false, error: 'admin removed' })
}
