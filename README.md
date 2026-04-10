# Client Onboarding Portal — FuseBase

A complete client onboarding portal built on FuseBase. A new client fills out a 5-step wizard, and everything fires automatically: data saved to a FuseBase Dashboard, company record created, org invite sent, welcome email + SMS delivered. Zero manual data entry for the agency.

**Live demo:** [https://client-onboarding.thefusebase.app/](https://client-onboarding.thefusebase.app/)

---

## What It Does

**Client-facing:** A 5-step onboarding wizard tailored by industry (HVAC, roofing, dental, legal, etc.). Services are pre-populated based on industry. The UX uses progressive disclosure so clients finish the form instead of abandoning it.

**What happens on submit:**

1. All data saved to a FuseBase Dashboard (34-column custom database)
2. Company record auto-created in FuseBase Companies managed database
3. Client invited to the org with "client" role via Gate SDK — instant access, no manual approval
4. Branded welcome email sent to the client (via Resend)
5. Agency owner notified by email with full client details
6. SMS welcome sent to the client (via TextLink)

**Agency-facing:** An admin dashboard at `/admin` to review submissions, view full client details, associate FuseBase workspaces for project delivery, and change submission status.

---

## Architecture

```
Browser (React SPA)
  ├─ /              → 5-step onboarding wizard
  ├─ /admin         → submission list
  └─ /admin/:id     → submission detail + workspace assignment
       │
       ▼
  /api/onboard      → Hono backend
  /api/submissions      │
  /api/submissions/workspaces
       │
       ├─ Dashboard SDK → FuseBase Dashboards (onboarding DB + companies DB)
       ├─ Gate SDK      → FuseBase Gate (org invite)
       ├─ Resend        → welcome + notification emails
       └─ TextLink      → SMS welcome
```

- **Frontend:** React 19 SPA (Vite, Tailwind v4, TypeScript, react-hook-form + zod)
- **Backend:** Hono server (runs as FuseBase feature backend, Node.js target)
- **Data layer:** FuseBase Dashboard SDK for all database operations, Gate SDK for org membership and workspaces
- **Communication:** Resend for email, TextLink for SMS (both optional — the portal works without them)

---

## FuseBase Features Used

| Feature | How it's used |
|---------|--------------|
| **Dashboards & custom database** | 34-column onboarding database (labels, links, dates, booleans, text) |
| **Companies managed database** | Auto-creates a company record on each submission |
| **Gate SDK — OrgUsersApi** | Invites the new client to the org with `client` role |
| **Gate SDK — EmailsApi** | Reserved for future email campaigns through Gate |
| **Gate SDK — WorkspacesApi** | Admin can assign a workspace to a submission (service token) |
| **Feature backend** | Hono server with `/api` routes, secrets for API keys |
| **Feature permissions** | `org.members.write` synced via `--sync-gate-permissions` |
| **MCP** | Entire development workflow — bootstrap, schema discovery, database/view creation, data operations |

---

## Prerequisites

- [FuseBase](https://thefusebase.com) account (free or paid)
- Node.js 18+
- [Resend](https://resend.com) account (optional — for email)
- [TextLink](https://textlink.it) account (optional — for SMS)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/antongulin/fusebase-challenge.git
cd fusebase-challenge
npm install
cd features/client-onboarding && npm install
cd backend && npm install && cd ../..
```

### 2. Initialize FuseBase

```bash
fusebase init
```

This creates your `.env` with `DASHBOARDS_MCP_TOKEN` and `DASHBOARDS_MCP_URL`. You'll also need a Gate MCP token — add to `.env`:

```env
GATE_MCP_URL=https://gate-mcp.thefusebase.com/mcp
GATE_MCP_TOKEN=<your-gate-mcp-token>
```

### 3. Create the databases via MCP

Using FuseBase MCP (in Claude Code, Cursor, or another MCP client), create two dashboards with views:

**Onboarding Dashboard** — a custom database with these columns:

| Column | Key type | Description |
|--------|-----------|-------------|
| Company Name | label | Client company name |
| Contact Name | label | Primary contact |
| Contact Email | label | Email address |
| Contact Phone | label | Phone number |
| Contact Role | label | Role at company |
| Business Address | label | Physical address |
| Industry | label | Business industry |
| Website URL | link | Company website |
| Services Offered | label | Comma-separated services |
| Top Services | label | Top 3 services |
| Primary Goal | label (select) | Marketing goal |
| Monthly Budget | label (select) | Budget range |
| Service Area | label | Geographic service area |
| Ideal Customer | label | Target customer description |
| Competitors | label | Main competitors |
| Differentiator | label | What makes them unique |
| Google Business Profile | link | GBP URL |
| Facebook | link | Facebook page URL |
| Instagram Handle | label | Instagram @handle |
| TikTok Handle | label | TikTok @handle |
| LinkedIn | link | LinkedIn URL |
| YouTube | link | YouTube channel URL |
| Other Social Links | label | Additional social links |
| Logo | file | Company logo |
| Work Photos | file | Portfolio/work photos |
| Special Offers | label | Current promotions |
| Preferred Contact Method | label | Email/phone/text |
| Best Time to Reach | label | Availability |
| Additional Notes | label | Free-form notes |
| Emergency Service | boolean | Offers emergency service |
| Free Estimates | boolean | Offers free estimates |
| Employee Range | label (select) | Team size |
| Status | label (select) | New / Under Review / Workspace Created / Active / Rejected |
| Workspace | label | Associated workspace ID |
| Submitted At | label | Submission timestamp |

**Companies Dashboard** — a managed or custom database with at least these columns:

| Column | Key type |
|--------|-----------|
| Name | label |
| URL | link |
| Description | label |
| Categories | label |
| Employee Range | label |

> **Tip:** Use MCP `tool_call` to create the databases and columns. The exact opIds and schema are documented in the FuseBase dashboards skill. You can also create them manually in the FuseBase UI.

### 4. Update all configuration constants

After creating the databases and views, you must update the IDs and column keys in **multiple files**. Every item below needs to be replaced with the values from your own FuseBase org:

#### `features/client-onboarding/src/lib/constants.ts`

| Constant | What to replace with |
|----------|----------------------|
| `ONBOARDING_DASHBOARD_ID` | Your onboarding dashboard ID (from MCP `getAllDatabases` / `getDashboards`) |
| `ONBOARDING_VIEW_ID` | Your onboarding view ID (from `getDashboard` response) |
| `COMPANIES_DASHBOARD_ID` | Your companies dashboard ID |
| `COMPANIES_VIEW_ID` | Your companies view ID |
| `ORG_ID` | Your FuseBase org ID (found in `fusebase.json` or via Gate `whoami`) |
| `FUSEBASE_HOST` | Your FuseBase host (e.g. `thefusebase.com`) |
| `COL.*` | Every column key must match the nanoid keys from your dashboard schema (from `getDashboardView` or `describeDashboard`) |
| `STATUS_LABELS.*` | Nanoid IDs for each Status select option (from your dashboard schema) |
| `GOAL_LABELS.*` | Nanoid IDs for each Primary Goal select option |
| `BUDGET_LABELS.*` | Nanoid IDs for each Monthly Budget select option |

#### `features/client-onboarding/backend/src/sdk.ts`

| Constant | What to replace with |
|----------|----------------------|
| `DASHBOARD_BASE_URL` | Update host if different (`thefusebase.com` vs custom) |
| `GATE_BASE_URL` | Update host if different |
| All dashboard/view IDs | Same values as `constants.ts` above |
| `ORG_ID` | Same org ID |
| `COL.*` | Same column keys as `constants.ts` |
| `STATUS_LABELS.*` | Same nanoid IDs |
| `GOAL_LABELS.*` | Same nanoid IDs |
| `BUDGET_LABELS.*` | Same nanoid IDs |
| `COMPANIES_COL.*` | Column keys from your Companies dashboard schema |

#### `fusebase.json`

| Field | What to replace with |
|-------|----------------------|
| `orgId` | Your org ID |
| `appId` | Your FuseBase app ID |
| `features[0].id` | Your feature ID (set by `fusebase feature create`) |
| `features[0].path` | Keep as `features/client-onboarding` |
| `features[0].fusebaseGateMeta.usedOps` | Gate operations used by your feature |
| `features[0].fusebaseGateMeta.permissions` | Gate permissions for your feature |

> **Important:** Column keys and label nanoids are unique to each dashboard. They cannot be copied from this repo — you must discover your own using MCP (`getDashboardView` or `describeDashboard`).

### 5. Register the feature

```bash
fusebase feature create \
  --name="Client Onboarding" \
  --subdomain=client-onboarding \
  --path=features/client-onboarding \
  --dev-command="npm run dev" \
  --build-command="npm run build" \
  --output-dir=dist \
  --permissions="dashboardView.YOUR_DASHBOARD_ID:YOUR_VIEW_ID.read,write"
```

Then sync Gate permissions:

```bash
fusebase feature update YOUR_FEATURE_ID --sync-gate-permissions
```

### 6. Set up feature secrets

```bash
fusebase secret create --feature=YOUR_FEATURE_ID --secret "RESEND_API_KEY:Resend API key for sending emails"
fusebase secret create --feature=YOUR_FEATURE_ID --secret "RESEND_FROM_EMAIL:Sender email like 'Your Agency <onboarding@yourdomain.com>'"
fusebase secret create --feature=YOUR_FEATURE_ID --secret "TEXTLINK_API_KEY:TextLink API key for SMS"
fusebase secret create --feature=YOUR_FEATURE_ID --secret "DASHBOARD_SERVICE_TOKEN:Dashboard service token for admin routes"
fusebase secret create --feature=YOUR_FEATURE_ID --secret "GATE_SERVICE_TOKEN:Gate service token for admin workspace listing"
fusebase secret create --feature=YOUR_FEATURE_ID --secret "ADMIN_SECRET:Secret string for protecting /admin routes"
```

### 7. Run locally

```bash
fusebase dev start features/client-onboarding
```

### 8. Deploy

```bash
fusebase deploy
```

---

## Environment Variables

### `.env` (project root — used by MCP during development)

| Variable | Purpose | Example |
|----------|---------|---------|
| `DASHBOARDS_MCP_URL` | Dashboard MCP endpoint for development | `https://dashboards-mcp.thefusebase.com/mcp` |
| `DASHBOARDS_MCP_TOKEN` | Dashboard MCP auth token (from `fusebase init`) | `c391...` |
| `GATE_MCP_URL` | Gate MCP endpoint | `https://gate-mcp.thefusebase.com/mcp` |
| `GATE_MCP_TOKEN` | Gate MCP auth token | `477a...` |
| `FUSEBASE_HOST` | FuseBase host for links | `thefusebase.com` |
| `FUSEBASE_APP_HOST` | Apps subdomain host | `thefusebase.app` |

### Feature secrets (set via `fusebase secret create` — available as `process.env` in backend)

| Variable | Purpose | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Resend API key for sending client welcome + agency notification emails | No (emails skipped if missing) |
| `RESEND_FROM_EMAIL` | Sender email address | No (defaults to `Boost Business AI <onboarding@resend.dev>`) |
| `TEXTLINK_API_KEY` | TextLink API key for SMS welcome message | No (SMS skipped if missing) |
| `DASHBOARD_SERVICE_TOKEN` | Dashboard service token for admin API routes (read all submissions, update status) | Yes (admin routes fail without it) |
| `GATE_SERVICE_TOKEN` | Gate service token for listing workspaces on admin detail page | Yes (workspace listing fails without it) |
| `ADMIN_SECRET` | Secret string — clients must send `x-admin-secret` header matching this value to access `/api/submissions` routes | No (if set, admin routes are protected; if unset, no auth check) |

---

## How It Works — Data Flow

```
Client fills out 5-step form
        │
        ▼
POST /api/onboard  (Hono backend)
        │
        ├─── 1. Dashboard SDK → batchPutDashboardData
        │         Saves all 34 fields to onboarding dashboard
        │
        ├─── 2. Dashboard SDK → batchPutDashboardData
        │         Creates company record in companies dashboard
        │
        ├─── 3. Gate SDK → addOrgUser
        │         Invites client email to org with "client" role
        │
        ├─── 4. Resend → send email
        │         Welcome email to client
        │         Notification email to agency owner
        │
        └─── 5. TextLink → send SMS
                  SMS welcome to client phone
```

Each step after the first is **best-effort** — if Resend or TextLink fails, the submission still succeeds. The onboarding row is always created first.

---

## Admin Dashboard

The `/admin` route provides:

- **Submission list** — all onboarding submissions with status badges
- **Submission detail** (`/admin/:id`) — full client details, status management, workspace assignment
- **Delete submission** — removes the row from the dashboard

Admin routes are protected by `x-admin-secret` header matching the `ADMIN_SECRET` env var.

---

## Customization Guide

### Industries & Pre-populated Services

Edit `features/client-onboarding/src/lib/constants.ts`:

```typescript
export const INDUSTRY_SERVICES: Record<string, string[]> = {
  'HVAC': ['AC Repair', 'AC Installation', ...],
  'Your Industry': ['Service 1', 'Service 2', ...],
}

export const INDUSTRIES = [
  'HVAC',
  'Plumbing',
  'Your Industry',
  ...
]
```

### Email Templates

Edit `features/client-onboarding/backend/src/routes/onboard.ts`:

- `buildClientWelcomeHtml()` — welcome email sent to the client
- `buildOwnerNotificationHtml()` — notification email sent to the agency
- `FROM_EMAIL` constant — change the sender name/domain

### Branding

The onboarding wizard and admin dashboard use Tailwind CSS. Key branding constants are inline in the components:

- Primary color: `blue-600` / `#2563EB` throughout
- Agency name: "Boost Business AI" in email templates and footer
- CTA links: update `https://book.boostbusiness.ai` in the welcome email

### Status Labels

Status labels are defined as dashboard select options. To change them:

1. Update the dashboard schema (add/remove select options) via MCP or UI
2. Update `STATUS_LABELS` in both `constants.ts` and `backend/src/sdk.ts` with the new nanoid values
3. Update `STATUS_DISPLAY` in `AdminPage.tsx` and `AdminDetailPage.tsx` if you add/remove statuses

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind v4, TypeScript, react-hook-form, zod |
| Backend | Hono, Node.js |
| Data | FuseBase Dashboard SDK (`@fusebase/dashboard-service-sdk`) |
| Auth/Membership | FuseBase Gate SDK (`@fusebase/fusebase-gate-sdk`) |
| Email | [Resend](https://resend.com) |
| SMS | [TextLink](https://textlink.it) |
| Development | FuseBase CLI, MCP |

---

## Key Files

```
features/client-onboarding/
├── src/
│   ├── lib/
│   │   ├── constants.ts      ← Dashboard IDs, column keys, label nanoids, industries
│   │   ├── types.ts          ← TypeScript interfaces for form data and submissions
│   │   ├── auth.ts           ← Feature token helper, apiFetch wrapper
│   │   └── utils.ts          ← cn() utility
│   ├── components/
│   │   ├── onboarding/       ← Wizard steps (WelcomeScreen, Step1-5, ConfirmationScreen)
│   │   └── AuthExpiredModal.tsx
│   ├── pages/
│   │   ├── OnboardingPage.tsx  ← Main wizard page
│   │   ├── AdminPage.tsx       ← Submission list
│   │   └── AdminDetailPage.tsx  ← Submission detail + workspace assignment
│   └── App.tsx
├── backend/
│   └── src/
│       ├── index.ts            ← Hono app, CORS, auth middleware
│       ├── sdk.ts              ← SDK client factories, IDs, column keys (mirrors constants.ts)
│       └── routes/
│           ├── onboard.ts      ← POST /api/onboard (save data, invite, email, SMS)
│           └── submissions.ts  ← GET /api/submissions, POST status/workspace, DELETE
├── fusebase.json              ← Org ID, app ID, feature config
└── .env                        ← MCP tokens (gitignored)
```

---

## License

MIT