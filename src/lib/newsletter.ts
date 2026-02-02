import crypto from 'crypto'

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'newsletter-unsubscribe-secret'

// Generate unsubscribe token
export function generateUnsubscribeToken(email: string): string {
  const data = `${email}:${UNSUBSCRIBE_SECRET}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Verify unsubscribe token
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expectedToken = generateUnsubscribeToken(email)
  return token === expectedToken
}