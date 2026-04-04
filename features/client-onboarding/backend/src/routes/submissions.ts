import { Hono } from 'hono'
import {
  createAdminDashboardDataApi,
  ONBOARDING_DASHBOARD_ID,
  ONBOARDING_VIEW_ID,
  COL,
  STATUS_LABELS,
} from '../sdk.js'

export const submissionsRoutes = new Hono()

// List all submissions
submissionsRoutes.get('/', async (c) => {
  const page = Number(c.req.query('page') || '1')
  const limit = Number(c.req.query('limit') || '50')

  const dashboardApi = createAdminDashboardDataApi()

  try {
    const result = await dashboardApi.getDashboardViewData({
      path: { dashboardId: ONBOARDING_DASHBOARD_ID, viewId: ONBOARDING_VIEW_ID },
      query: { page, limit },
    })

    // Handle both SDK shapes: direct array or { data: row[], meta } envelope
    const rawData = result.data as unknown
    let rows: Array<Record<string, unknown>>
    let meta: Record<string, unknown> | undefined

    if (Array.isArray(rawData)) {
      rows = rawData as Array<Record<string, unknown>>
      meta = undefined
    } else if (rawData && typeof rawData === 'object' && 'data' in rawData) {
      const envelope = rawData as { data: unknown[]; meta?: Record<string, unknown> }
      rows = (envelope.data as Array<Record<string, unknown>>) ?? []
      meta = envelope.meta
    } else {
      rows = []
      meta = undefined
    }
    console.log(`[submissions] Fetched ${rows.length} rows`)

    const submissions = rows.map((row) => ({
      id: row.root_index_value as string,
      companyName: row[COL.companyName] as string,
      contactName: row[COL.contactName] as string,
      contactEmail: row[COL.contactEmail] as string,
      contactPhone: row[COL.contactPhone] as string,
      industry: row[COL.industry] as string,
      businessAddress: row[COL.businessAddress] as string,
      servicesOffered: row[COL.servicesOffered] as string,
      primaryGoal: row[COL.primaryGoal] as string[],
      monthlyBudget: row[COL.monthlyBudget] as string[],
      status: row[COL.status] as string[],
      workspaceId: row[COL.workspaceId] as string,
      submittedAt: row[COL.submittedAt] as string,
      websiteUrl: row[COL.websiteUrl] as Record<string, string>,
      contactRole: row[COL.contactRole] as string,
      topServices: row[COL.topServices] as string,
      serviceArea: row[COL.serviceArea] as string,
      idealCustomer: row[COL.idealCustomer] as string,
      competitors: row[COL.competitors] as string,
      differentiator: row[COL.differentiator] as string,
      gbpUrl: row[COL.gbpUrl] as Record<string, string>,
      facebookUrl: row[COL.facebookUrl] as Record<string, string>,
      instagramHandle: row[COL.instagramHandle] as string,
      tiktokHandle: row[COL.tiktokHandle] as string,
      linkedinUrl: row[COL.linkedinUrl] as Record<string, string>,
      youtubeUrl: row[COL.youtubeUrl] as Record<string, string>,
      otherSocialLinks: row[COL.otherSocialLinks] as string,
      specialOffers: row[COL.specialOffers] as string,
      contactMethod: row[COL.contactMethod] as string,
      bestTime: row[COL.bestTime] as string,
      additionalNotes: row[COL.additionalNotes] as string,
      emergencyService: row[COL.emergencyService] as boolean,
      freeEstimates: row[COL.freeEstimates] as boolean,
      employeeRange: row[COL.employeeRange] as string,
    }))

    return c.json({ submissions, meta })
  } catch (err) {
    const errObj = err as { message?: string }
    console.error(`[submissions] Failed to fetch: ${errObj.message}`)
    return c.json({ error: 'Failed to fetch submissions' }, 500)
  }
})

// Update submission (workspace association, status change)
submissionsRoutes.post('/:id/setup', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ workspaceId: string; notes?: string }>()

  if (!body.workspaceId) {
    return c.json({ error: 'workspaceId is required' }, 400)
  }

  const dashboardApi = createAdminDashboardDataApi()

  try {
    await dashboardApi.batchPutDashboardData({
      path: { dashboardId: ONBOARDING_DASHBOARD_ID, viewId: ONBOARDING_VIEW_ID },
      body: {
        rows: [{
          root_index_value: id,
          values: [
            { item_key: COL.workspaceId, value: body.workspaceId },
            { item_key: COL.status, value: [STATUS_LABELS.workspaceCreated] },
          ],
        }],
      },
    })

    return c.json({ success: true, status: 'workspace_created' })
  } catch (err) {
    console.error('Failed to update submission:', err)
    return c.json({ error: 'Failed to update submission' }, 500)
  }
})

// Update submission status
submissionsRoutes.post('/:id/status', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ status: keyof typeof STATUS_LABELS }>()

  const statusNanoid = STATUS_LABELS[body.status]
  if (!statusNanoid) {
    return c.json({ error: 'Invalid status' }, 400)
  }

  const dashboardApi = createAdminDashboardDataApi()

  try {
    await dashboardApi.batchPutDashboardData({
      path: { dashboardId: ONBOARDING_DASHBOARD_ID, viewId: ONBOARDING_VIEW_ID },
      body: {
        rows: [{
          root_index_value: id,
          values: [{ item_key: COL.status, value: [statusNanoid] }],
        }],
      },
    })

    return c.json({ success: true })
  } catch (err) {
    console.error('Failed to update status:', err)
    return c.json({ error: 'Failed to update status' }, 500)
  }
})
