import { Hono } from 'hono'
// Use hono/serve-static for Cloudflare Workers compatibility
import { serveStatic } from '@hono/node-server/serve-static'
const app = new Hono()

// Serve static files for backoffice
app.use('/*', serveStatic({ root: 'static' }))
app.get('/', serveStatic({ path: 'static/index.html' }))

// API route for monitoring Fataplus forms intake
app.get('/api/status', (c) => {
  return c.json({ status: 'ok', message: 'Fataplus intake monitoring active' })
})

// API route for setup/config
app.post('/api/setup', async (c) => {
  const data = await c.req.json()
  // Here we would handle setup logic for Fataplus forms
  return c.json({ success: true, received: data })
})

export default app
