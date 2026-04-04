# Client Onboarding Portal — Boost Business AI

Every marketing agency knows the problem: a new client signs up, and then... nothing. Days of back-and-forth emails collecting business info. Manual data entry into three different systems. The client wonders if they made a mistake. First impressions matter, and most agencies blow theirs.

**So I built a fix.** A complete client onboarding portal that takes a local business owner from "just signed" to "fully set up with welcome email in their inbox" in under 10 minutes.

**Live demo:** [https://client-onboarding.thefusebase.app/](https://client-onboarding.thefusebase.app/)

---

## What the client sees

A 5-step onboarding wizard tailored to their industry — HVAC, roofing, auto body, aesthetics, cleaning, dental, legal, and more. Services are pre-populated based on industry selection. The UX uses proven psychology patterns (progress endowment, commitment/consistency, peak-end rule) so clients actually finish the form instead of abandoning it halfway.

## What happens when they hit Submit

1. **All data saved** to a FuseBase Dashboard (34-column custom database — services, budgets, goals, competitors, branding, everything)
2. **Company record auto-created** in FuseBase Companies
3. **Client invited** to the org with "client" role via Gate SDK — instant access, no manual approval
4. **Branded welcome email** sent via Resend (custom domain, agency branding, timeline overview, "Book Your Kickoff Call" CTA)
5. **Agency owner notified** by email with full client details — zero manual data entry
6. **SMS welcome** sent via TextLink

All of that fires automatically from a single form submission. The backend (Hono on Azure Container Apps) orchestrates everything.

**On the agency side:** An admin dashboard to review submissions, view full client details, and associate FuseBase workspaces for project delivery.

---

## FuseBase features used

- **Dashboards** + custom database (34 typed columns: labels, links, files, dates, booleans)
- **Companies** managed database
- **Gate** (OrgUsersApi for auto-invites)
- **MCP** for the entire development workflow (bootstrap, schema discovery, database/view creation, data operations)
- **Feature backend** with secrets (Resend + TextLink API keys)
- **Feature permissions** with Gate sync

## Tech

React 19, Vite, Tailwind v4, TypeScript, Hono backend, Dashboard SDK, Gate SDK

## Built in ~3 hours

Single session using Claude Code with FuseBase MCP.

## Why it matters

This is not a demo. It solves a real problem that every service-business marketing agency faces. The onboarding data flows directly into the FuseBase ecosystem — Companies, workspaces, dashboards — so the agency can actually deliver on what they just sold.

---

**GitHub:** [https://github.com/antongulin/fusebase-challenge](https://github.com/antongulin/fusebase-challenge)
