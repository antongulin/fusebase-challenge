import { Hono } from 'hono'
import textlink from 'textlink-sms'
import { Resend } from 'resend'

function formatPhone(phone: string): string {
  const digits = phone.replace(/[^+\d]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.length === 10) return '+1' + digits
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits
  return '+' + digits
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Boost Business AI <onboarding@resend.dev>'

import {
  createDashboardDataApi,
  createOrgUsersApi,
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

// ---------------------------------------------------------------------------
// Email HTML builders
// ---------------------------------------------------------------------------

function buildOwnerNotificationHtml(body: OnboardBody): string {
  const socialLinks: string[] = []
  if (body.websiteUrl) socialLinks.push(`<a href="${body.websiteUrl}" style="color:#2563EB;text-decoration:none;">${body.websiteUrl}</a>`)
  if (body.gbpUrl) socialLinks.push(`<a href="${body.gbpUrl}" style="color:#2563EB;text-decoration:none;">Google Business Profile</a>`)
  if (body.facebookUrl) socialLinks.push(`<a href="${body.facebookUrl}" style="color:#2563EB;text-decoration:none;">Facebook</a>`)
  if (body.instagramHandle) socialLinks.push(`Instagram: ${body.instagramHandle}`)
  if (body.tiktokHandle) socialLinks.push(`TikTok: ${body.tiktokHandle}`)
  if (body.linkedinUrl) socialLinks.push(`<a href="${body.linkedinUrl}" style="color:#2563EB;text-decoration:none;">LinkedIn</a>`)
  if (body.youtubeUrl) socialLinks.push(`<a href="${body.youtubeUrl}" style="color:#2563EB;text-decoration:none;">YouTube</a>`)
  if (body.otherSocialLinks) socialLinks.push(body.otherSocialLinks)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="background-color:#2563EB;padding:24px 32px;border-radius:8px 8px 0 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">New Client Onboarding</td>
    <td align="right" style="color:rgba(255,255,255,0.85);font-size:13px;">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
  </tr>
  </table>
</td></tr>

<!-- Company Header -->
<tr><td style="background-color:#ffffff;padding:28px 32px 20px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0 0 4px;">${body.companyName}</div>
  <div style="font-size:15px;color:#6b7280;">${body.industry}${body.businessAddress ? ' &middot; ' + body.businessAddress : ''}</div>
</td></tr>

<!-- Contact Info -->
<tr><td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Contact</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-bottom:6px;color:#1a1a1a;font-size:15px;width:50%;"><strong>${body.contactName}</strong>${body.contactRole ? ' &middot; ' + body.contactRole : ''}</td>
  </tr>
  <tr>
    <td style="padding-bottom:4px;">
      <a href="mailto:${body.contactEmail}" style="color:#2563EB;text-decoration:none;font-size:14px;">${body.contactEmail}</a>
    </td>
  </tr>
  ${body.contactPhone ? `<tr><td style="padding-bottom:4px;"><a href="tel:${body.contactPhone}" style="color:#2563EB;text-decoration:none;font-size:14px;">${body.contactPhone}</a></td></tr>` : ''}
  </table>
</td></tr>

<!-- Services & Goals -->
<tr><td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Services &amp; Goals</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#1a1a1a;">
  <tr><td style="padding:4px 0;color:#6b7280;width:140px;vertical-align:top;">Services</td><td style="padding:4px 0;">${body.servicesOffered.join(', ')}</td></tr>
  ${body.topServices?.length ? `<tr><td style="padding:4px 0;color:#6b7280;vertical-align:top;">Top Services</td><td style="padding:4px 0;">${body.topServices.join(', ')}</td></tr>` : ''}
  <tr><td style="padding:4px 0;color:#6b7280;">Primary Goal</td><td style="padding:4px 0;font-weight:600;">${body.primaryGoal}</td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;">Budget</td><td style="padding:4px 0;font-weight:600;">${body.monthlyBudget}</td></tr>
  ${body.emergencyService ? '<tr><td style="padding:4px 0;color:#6b7280;">Emergency</td><td style="padding:4px 0;">Yes - offers emergency service</td></tr>' : ''}
  ${body.freeEstimates ? '<tr><td style="padding:4px 0;color:#6b7280;">Free Estimates</td><td style="padding:4px 0;">Yes</td></tr>' : ''}
  ${body.employeeRange ? `<tr><td style="padding:4px 0;color:#6b7280;">Team Size</td><td style="padding:4px 0;">${body.employeeRange}</td></tr>` : ''}
  </table>
</td></tr>

<!-- Market & Differentiator -->
<tr><td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Market &amp; Positioning</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#1a1a1a;">
  ${body.serviceArea ? `<tr><td style="padding:4px 0;color:#6b7280;width:140px;vertical-align:top;">Service Area</td><td style="padding:4px 0;">${body.serviceArea}</td></tr>` : ''}
  ${body.idealCustomer ? `<tr><td style="padding:4px 0;color:#6b7280;vertical-align:top;">Ideal Customer</td><td style="padding:4px 0;">${body.idealCustomer}</td></tr>` : ''}
  ${body.competitors ? `<tr><td style="padding:4px 0;color:#6b7280;vertical-align:top;">Competitors</td><td style="padding:4px 0;">${body.competitors}</td></tr>` : ''}
  </table>
  ${body.differentiator ? `<div style="margin-top:12px;padding:12px 16px;background-color:#f0f7ff;border-left:3px solid #2563EB;border-radius:0 4px 4px 0;font-size:14px;color:#1a1a1a;line-height:1.5;font-style:italic;">"${body.differentiator}"</div>` : ''}
</td></tr>

<!-- Online Presence -->
${socialLinks.length || body.specialOffers ? `<tr><td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Online Presence</div>
  ${socialLinks.length ? `<div style="font-size:14px;line-height:1.8;">${socialLinks.join(' &nbsp;&middot;&nbsp; ')}</div>` : ''}
  ${body.specialOffers ? `<div style="margin-top:10px;font-size:14px;"><span style="color:#6b7280;">Current Offers:</span> ${body.specialOffers}</div>` : ''}
</td></tr>` : ''}

<!-- Communication Preferences & Notes -->
<tr><td style="background-color:#ffffff;padding:20px 32px;border-bottom:1px solid #e5e7eb;">
  <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;margin-bottom:12px;">Communication</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#1a1a1a;">
  ${body.contactMethod?.length ? `<tr><td style="padding:4px 0;color:#6b7280;width:140px;">Preferred</td><td style="padding:4px 0;">${body.contactMethod.join(', ')}</td></tr>` : ''}
  ${body.bestTime ? `<tr><td style="padding:4px 0;color:#6b7280;">Best Time</td><td style="padding:4px 0;">${body.bestTime}</td></tr>` : ''}
  </table>
  ${body.additionalNotes ? `<div style="margin-top:12px;padding:12px 16px;background-color:#f9fafb;border-radius:6px;font-size:14px;color:#1a1a1a;line-height:1.5;"><span style="color:#6b7280;font-weight:600;">Notes:</span> ${body.additionalNotes}</div>` : ''}
</td></tr>

<!-- CTA -->
<tr><td style="background-color:#ffffff;padding:28px 32px;border-radius:0 0 8px 8px;" align="center">
  <a href="https://thefusebase.com" style="display:inline-block;background-color:#2563EB;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:6px;letter-spacing:-0.2px;">Review and Create Workspace</a>
  <div style="margin-top:12px;font-size:13px;color:#6b7280;">Submission ID: ${body.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}</div>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 32px;text-align:center;">
  <div style="font-size:12px;color:#9ca3af;">Boost Business AI &middot; Internal Notification</div>
</td></tr>

</table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`
}

function buildClientWelcomeHtml(body: OnboardBody): string {
  const firstName = body.contactName.split(' ')[0]
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<!--[if !mso]><!--><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');</style><!--<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<!-- Preheader (inbox preview text) -->
<div style="display:none;font-size:1px;color:#f9fafb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Your dedicated strategist is already reviewing your market. Here is exactly what happens next and when.
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:32px 16px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

<!-- Logo / Brand Mark -->
<tr><td style="padding:0 0 24px;" align="center">
  <div style="font-size:22px;font-weight:700;color:#2563EB;letter-spacing:-0.5px;">Boost Business AI</div>
</td></tr>

<!-- Main Card -->
<tr><td style="background-color:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

<!-- Hero Section -->
<tr><td style="padding:40px 40px 0;">
  <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;line-height:1.2;">Welcome aboard, ${firstName}.</h1>
  <div style="width:48px;height:3px;background-color:#2563EB;border-radius:2px;margin:16px 0 0;"></div>
</td></tr>

<!-- Body Copy -->
<tr><td style="padding:24px 40px 0;">
  <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#1a1a1a;">
    You made a great decision. Your onboarding is complete, and your dedicated strategist is already digging into your market, your competitors, and the opportunities specific to ${body.companyName}.
  </p>
  <p style="margin:0;font-size:16px;line-height:1.65;color:#1a1a1a;">
    You do not need to do anything else right now. We have everything we need to get started. Here is exactly what happens next:
  </p>
</td></tr>

<!-- Timeline -->
<tr><td style="padding:24px 40px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

  <!-- Step 1 -->
  <tr>
    <td style="width:48px;vertical-align:top;padding:0 0 20px;">
      <div style="width:36px;height:36px;background-color:#eff6ff;border-radius:50%;text-align:center;line-height:36px;font-size:15px;font-weight:700;color:#2563EB;">1</div>
    </td>
    <td style="vertical-align:top;padding:2px 0 20px;">
      <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:3px;">Strategy Review <span style="color:#6b7280;font-weight:400;">&mdash; within 48 hours</span></div>
      <div style="font-size:14px;color:#6b7280;line-height:1.5;">Your strategist finishes a deep-dive into your business details, local market, and competitive landscape.</div>
    </td>
  </tr>

  <!-- Step 2 -->
  <tr>
    <td style="width:48px;vertical-align:top;padding:0 0 20px;">
      <div style="width:36px;height:36px;background-color:#eff6ff;border-radius:50%;text-align:center;line-height:36px;font-size:15px;font-weight:700;color:#2563EB;">2</div>
    </td>
    <td style="vertical-align:top;padding:2px 0 20px;">
      <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:3px;">Kickoff Call <span style="color:#6b7280;font-weight:400;">&mdash; within 3-5 business days</span></div>
      <div style="font-size:14px;color:#6b7280;line-height:1.5;">A focused 30-minute call to walk through your custom strategy, answer questions, and lock in a launch date.</div>
    </td>
  </tr>

  <!-- Step 3 -->
  <tr>
    <td style="width:48px;vertical-align:top;padding:0 0 4px;">
      <div style="width:36px;height:36px;background-color:#eff6ff;border-radius:50%;text-align:center;line-height:36px;font-size:15px;font-weight:700;color:#2563EB;">3</div>
    </td>
    <td style="vertical-align:top;padding:2px 0 4px;">
      <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-bottom:3px;">Campaigns Go Live <span style="color:#6b7280;font-weight:400;">&mdash; within 7 days of kickoff</span></div>
      <div style="font-size:14px;color:#6b7280;line-height:1.5;">Your campaigns launch and leads start coming in. You will see results in real-time with clear, honest reporting.</div>
    </td>
  </tr>

  </table>
</td></tr>

<!-- CTA Section -->
<tr><td style="padding:28px 40px 0;" align="center">
  <div style="background-color:#f9fafb;border-radius:8px;padding:24px;text-align:center;">
    <div style="font-size:15px;color:#1a1a1a;margin-bottom:16px;font-weight:500;">Ready to get ahead of schedule? Book your kickoff call now.</div>
    <a href="https://book.boostbusiness.ai" style="display:inline-block;background-color:#2563EB;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:6px;letter-spacing:-0.2px;mso-padding-alt:14px 36px;">Book Your Kickoff Call</a>
  </div>
</td></tr>

<!-- What to Expect -->
<tr><td style="padding:28px 40px 0;">
  <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#1a1a1a;">
    You will always have a direct line to your strategist &mdash; no call centers, no ticket queues, no runaround. If anything comes up before your kickoff, just reply to this email.
  </p>
  <p style="margin:0;font-size:16px;line-height:1.65;color:#1a1a1a;">
    We measure everything and hide nothing. You will get clear reporting that shows exactly where your leads are coming from, what they cost, and what is working. No jargon, no vanity metrics &mdash; just the numbers that matter to your business.
  </p>
</td></tr>

<!-- Sign-off -->
<tr><td style="padding:28px 40px 0;">
  <p style="margin:0;font-size:16px;line-height:1.65;color:#1a1a1a;">
    Looking forward to working with you, ${firstName}.
  </p>
  <p style="margin:16px 0 0;font-size:16px;color:#1a1a1a;">
    <strong>Anton Gulin</strong><br>
    <span style="color:#6b7280;">Founder, Boost Business AI</span>
  </p>
</td></tr>

<!-- P.S. -->
<tr><td style="padding:24px 40px 36px;">
  <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;font-style:italic;">
    P.S. If you think of anything you forgot to mention &mdash; a seasonal promotion coming up, a new service you are rolling out, a competitor who has been winning jobs you want &mdash; just reply here. We factor everything in, and the more we know, the sharper your strategy will be.
  </p>
</td></tr>

</table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px 32px;" align="center">
  <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
    <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">Boost Business AI</div>
    <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Marketing that actually moves the needle for local businesses.</div>
    <a href="https://book.boostbusiness.ai" style="font-size:13px;color:#2563EB;text-decoration:none;">book.boostbusiness.ai</a>
  </div>
</td></tr>

</table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`
}

// Subject line options for welcome email (picked best: option 2)
// 1. "Welcome to Boost Business AI - Here Is What Happens Next"
// 2. "You Are In - Here Is Your Roadmap to More Leads"
// 3. "Your Marketing Strategy Starts Now"
// Winner: Option 2 - creates anticipation, confirms they are in, and promises value

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

  // 4. Send notification email to agency owner via Resend (best-effort)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const resend = new Resend(resendKey)

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: 'anton@boostbusiness.ai',
        subject: `New Client Onboarding: ${body.companyName} - ${body.industry} - ${body.businessAddress}`,
        html: buildOwnerNotificationHtml(body),
      })
      console.log('Notification email sent to anton@boostbusiness.ai')
    } catch (err) {
      console.error('Failed to send notification email:', err)
    }

    // 5. Send welcome email to client via Resend (best-effort)
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.contactEmail,
        subject: 'You Are In - Here Is Your Roadmap to More Leads',
        html: buildClientWelcomeHtml(body),
      })
      console.log('Welcome email sent to', body.contactEmail)
    } catch (err) {
      console.error('Failed to send welcome email:', err)
    }
  }

  // 6. Send SMS welcome to client (best-effort)
  if (body.contactPhone) {
    try {
      const smsKey = process.env.TEXTLINK_API_KEY
      if (smsKey) {
        textlink.useKey(smsKey)
        const phone = formatPhone(body.contactPhone)
        console.log('Sending SMS to:', phone)
        const smsResult = await textlink.sendSMS(
          phone,
          `Welcome to Boost Business AI, ${body.contactName.split(' ')[0]}! We just sent you an email with your onboarding details. Your strategist will reach out within 48 hours.`
        )
        console.log('SMS result:', JSON.stringify(smsResult))
      } else {
        console.log('TEXTLINK_API_KEY not set, skipping SMS')
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
