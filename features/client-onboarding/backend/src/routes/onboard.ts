import { Hono } from 'hono'
import textlink from 'textlink-sms'
import {
  createDashboardDataApi,
  createOrgUsersApi,
  createEmailsApi,
  ONBOARDING_DASHBOARD_ID,
  ONBOARDING_VIEW_ID,
  COMPANIES_DASHBOARD_ID,
  COMPANIES_VIEW_ID,
  COMPANIES_COL,
  ORG_ID,
  COL,
  STATUS_LABELS,
  GOAL_LABELS,
  BUDGET_LABELS,
} from '../sdk.js'

interface OnboardBody {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  contactRole?: string
  businessAddress: string
  industry: string
  websiteUrl?: string
  servicesOffered: string[]
  topServices: string[]
  primaryGoal: string
  monthlyBudget: string
  serviceArea?: string
  idealCustomer?: string
  competitors?: string
  differentiator?: string
  gbpUrl?: string
  facebookUrl?: string
  instagramHandle?: string
  tiktokHandle?: string
  linkedinUrl?: string
  youtubeUrl?: string
  otherSocialLinks?: string
  specialOffers?: string
  contactMethod: string[]
  bestTime?: string
  additionalNotes?: string
  emergencyService: boolean
  freeEstimates: boolean
  employeeRange?: string
}

function makeLinkValue(url: string): { url: string; text: string } {
  return { url, text: url }
}

export const onboardRoutes = new Hono()

onboardRoutes.post('/', async (c) => {
  const featureToken = c.get('featureToken' as never) as string
  const body = await c.req.json<OnboardBody>()

  // Validate required fields
  if (!body.companyName || !body.contactName || !body.contactEmail || !body.businessAddress) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const dashboardApi = createDashboardDataApi(featureToken)

  // 1. Create onboarding row
  const goalNanoid = GOAL_LABELS[body.primaryGoal]
  const budgetNanoid = BUDGET_LABELS[body.monthlyBudget]

  const values: Array<{ item_key: string; value: string | number | boolean | object | unknown[] }> = [
    { item_key: COL.companyName, value: body.companyName },
    { item_key: COL.contactName, value: body.contactName },
    { item_key: COL.contactEmail, value: body.contactEmail },
    { item_key: COL.contactPhone, value: body.contactPhone || '' },
    { item_key: COL.contactRole, value: body.contactRole || '' },
    { item_key: COL.businessAddress, value: body.businessAddress },
    { item_key: COL.industry, value: body.industry },
    { item_key: COL.servicesOffered, value: body.servicesOffered.join(', ') },
    { item_key: COL.topServices, value: body.topServices.join(', ') },
    { item_key: COL.serviceArea, value: body.serviceArea || '' },
    { item_key: COL.idealCustomer, value: body.idealCustomer || '' },
    { item_key: COL.competitors, value: body.competitors || '' },
    { item_key: COL.differentiator, value: body.differentiator || '' },
    { item_key: COL.instagramHandle, value: body.instagramHandle || '' },
    { item_key: COL.tiktokHandle, value: body.tiktokHandle || '' },
    { item_key: COL.otherSocialLinks, value: body.otherSocialLinks || '' },
    { item_key: COL.specialOffers, value: body.specialOffers || '' },
    { item_key: COL.contactMethod, value: body.contactMethod.join(', ') },
    { item_key: COL.bestTime, value: body.bestTime || '' },
    { item_key: COL.additionalNotes, value: body.additionalNotes || '' },
    { item_key: COL.emergencyService, value: body.emergencyService },
    { item_key: COL.freeEstimates, value: body.freeEstimates },
    { item_key: COL.employeeRange, value: body.employeeRange || '' },
    { item_key: COL.status, value: [STATUS_LABELS.new] },
    { item_key: COL.submittedAt, value: new Date().toISOString() },
  ]

  // Add link columns
  if (body.websiteUrl) values.push({ item_key: COL.websiteUrl, value: makeLinkValue(body.websiteUrl) })
  if (body.gbpUrl) values.push({ item_key: COL.gbpUrl, value: makeLinkValue(body.gbpUrl) })
  if (body.facebookUrl) values.push({ item_key: COL.facebookUrl, value: makeLinkValue(body.facebookUrl) })
  if (body.linkedinUrl) values.push({ item_key: COL.linkedinUrl, value: makeLinkValue(body.linkedinUrl) })
  if (body.youtubeUrl) values.push({ item_key: COL.youtubeUrl, value: makeLinkValue(body.youtubeUrl) })

  // Add label columns
  if (goalNanoid) values.push({ item_key: COL.primaryGoal, value: [goalNanoid] })
  if (budgetNanoid) values.push({ item_key: COL.monthlyBudget, value: [budgetNanoid] })

  let submissionId = ''
  try {
    const result = await dashboardApi.batchPutDashboardData({
      path: { dashboardId: ONBOARDING_DASHBOARD_ID, viewId: ONBOARDING_VIEW_ID },
      body: { rows: [{ create_new_row: true, values }] },
    })
    const data = result.data as Record<string, unknown> | undefined
    const rows = data?.data as Array<Record<string, unknown>> | undefined
    submissionId = (rows?.[0]?.root_index_value as string) || ''
  } catch (err) {
    console.error('Failed to create onboarding row:', err)
    return c.json({ error: 'Failed to save onboarding data' }, 500)
  }

  // 2. Create company in Companies DB (best-effort)
  let companyCreated = false
  try {
    const companyValues: Array<{ item_key: string; value: string | number | boolean | object | unknown[] }> = [
      { item_key: COMPANIES_COL.name, value: body.companyName },
      { item_key: COMPANIES_COL.description, value: `${body.industry} business in ${body.businessAddress}` },
    ]
    if (body.websiteUrl) {
      companyValues.push({ item_key: COMPANIES_COL.url, value: makeLinkValue(body.websiteUrl) })
    }
    await dashboardApi.batchPutDashboardData({
      path: { dashboardId: COMPANIES_DASHBOARD_ID, viewId: COMPANIES_VIEW_ID },
      body: { rows: [{ create_new_row: true, values: companyValues }] },
    })
    companyCreated = true
  } catch (err) {
    console.error('Failed to create company (continuing):', err)
  }

  // 3. Invite client to org (best-effort)
  let inviteSent = false
  try {
    const orgUsersApi = createOrgUsersApi(featureToken)
    await orgUsersApi.addOrgUser({
      path: { orgId: ORG_ID },
      body: {
        email: body.contactEmail,
        orgRole: 'client',
        autoConfirmClientInvite: true,
        fullName: body.contactName,
      },
    })
    inviteSent = true
  } catch (err) {
    console.error('Failed to invite client (continuing):', err)
  }

  // 4. Send notification email to agency owner (best-effort)
  try {
    const emailsApi = createEmailsApi(featureToken)
    await emailsApi.sendOrgEmail({
      path: { orgId: ORG_ID },
      body: {
        recipient: 'anton@boostbusiness.ai',
        subject: `New Client Onboarding: ${body.companyName} — ${body.industry} — ${body.businessAddress}`,
        body: `<h2>New onboarding submission received</h2>
<p><strong>Business:</strong> ${body.companyName}</p>
<p><strong>Industry:</strong> ${body.industry}</p>
<p><strong>Location:</strong> ${body.businessAddress}</p>
<p><strong>Contact:</strong> ${body.contactName} · ${body.contactEmail}${body.contactPhone ? ' · ' + body.contactPhone : ''}</p>
<p><strong>Services Requested:</strong> ${body.servicesOffered.join(', ')}</p>
<p><strong>Primary Goal:</strong> ${body.primaryGoal}</p>
<p><strong>Monthly Budget:</strong> ${body.monthlyBudget}</p>
<p><strong>What makes customers choose them:</strong> "${body.differentiator || 'Not provided'}"</p>
<p><strong>Action Required:</strong> Review this submission and create workspace.</p>`,
      },
    })
  } catch (err) {
    console.error('Failed to send notification email (continuing):', err)
  }

  // 5. Send welcome email to client (best-effort)
  if (inviteSent) {
    try {
      const emailsApi = createEmailsApi(featureToken)
      await emailsApi.sendOrgEmail({
        path: { orgId: ORG_ID },
        body: {
          recipient: body.contactEmail,
          subject: "You're in — here's what happens next",
          body: `<p>Hi ${body.contactName},</p>
<p>Thank you for completing your onboarding — we're genuinely excited to start working with you.</p>
<p>Your information is now with your dedicated strategist, who's already beginning to research your market and map out your custom marketing plan.</p>
<h3>Here's the timeline:</h3>
<ul>
<li><strong>Within 48 hours:</strong> Your strategist finishes reviewing your business details and local market.</li>
<li><strong>Within 3-5 business days:</strong> We reach out to schedule your kickoff call.</li>
<li><strong>Within 7 business days of kickoff:</strong> Your campaigns go live and leads start coming in.</li>
</ul>
<p>You'll always have a direct line to your strategist — no call centers, no ticket queues. If something comes up, just reply to this email.</p>
<p>Welcome aboard, ${body.contactName}. We'll be in touch soon.</p>
<p>— The Boost Business AI Team</p>
<p><em>P.S. If you think of anything you forgot to mention — a seasonal promotion, a new service, a competitor you want to beat — just reply here.</em></p>`,
        },
      })
    } catch (err) {
      console.error('Failed to send welcome email (continuing):', err)
    }
  }

  // 6. Send SMS welcome to client (best-effort)
  if (body.contactPhone) {
    try {
      const smsKey = process.env.TEXTLINK_API_KEY
      if (smsKey) {
        textlink.useKey(smsKey)
        const phone = body.contactPhone.replace(/[^+\d]/g, '')
        await textlink.sendSMS(
          phone,
          `Welcome to Boost Business AI, ${body.contactName.split(' ')[0]}! We just sent you an email with your onboarding details. Your strategist will reach out within 48 hours. — Boost Business AI`
        )
      }
    } catch (err) {
      console.error('SMS failed (continuing):', err)
    }
  }

  return c.json({
    success: true,
    submissionId,
    companyCreated,
    inviteSent,
  })
})
