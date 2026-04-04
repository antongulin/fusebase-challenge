import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { getCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { onboardRoutes } from './routes/onboard.js'
import { submissionsRoutes } from './routes/submissions.js'

const app = new Hono().basePath('/api')

app.use('*', cors())

app.get('/health', (c) => c.json({ ok: true }))

// Auth middleware: extract feature token
app.use('*', async (c, next) => {
  const featureToken =
    c.req.header('x-app-feature-token') || getCookie(c, 'fbsfeaturetoken')

  if (!featureToken) {
    return c.json({ error: 'Missing feature token' }, 401)
  }

  c.set('featureToken' as never, featureToken as never)
  await next()
})

app.route('/onboard', onboardRoutes)
app.route('/submissions', submissionsRoutes)

const port = Number(process.env.BACKEND_PORT) || 3001

serve({ fetch: app.fetch, port }, () => {
  console.log(`Backend running on port ${port}`)
})

export default app
