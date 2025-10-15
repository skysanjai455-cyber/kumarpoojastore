import crypto from 'crypto'

const COOKIE_NAME = 'kp_admin_sess'

export function createSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function getCookieFromReq(req) {
  const raw = req.headers.cookie || ''
  const parts = raw.split(';').map(p => p.trim()).filter(Boolean)
  const obj = {}
  parts.forEach(p => { const i = p.indexOf('='); if(i>0) obj[p.slice(0,i)] = decodeURIComponent(p.slice(i+1)) })
  return obj[COOKIE_NAME]
}

export function setSessionCookie(res, token) {
  // HttpOnly, secure when in production, sameSite lax
  const secure = process.env.NODE_ENV === 'production'
  const cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${60*60*24}; SameSite=Lax${secure?'; Secure':''}`
  res.setHeader('Set-Cookie', cookie)
}

export function clearSessionCookie(res){
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`) 
}
