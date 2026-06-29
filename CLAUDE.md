# MANDATORY SESSION START

**Before touching any file:**
1. Read `rules.md` — project layout system, file structure, client details
2. Read `handover.md` — current position and next steps

**Behavioural rules that are always active — no exceptions:**
- Touch ONLY what is explicitly named. If it is not mentioned, do not touch it.
- When Shayne says "lock it" or "don't touch" — everything is frozen until told otherwise.
- "commit and push" = do it immediately. No asking.
- Never use www URLs. Never suggest Vercel. Never run dev servers.
- Flag visual risks before implementing, not after.
- Ask ONE question when confused, then execute. No alternatives, no hedging.
- Never delete files — move to `_archive/`.
- State exactly what changed: "changed X to Y in file Z." Never say "fixed."

---

# SuperClaude Framework — Global Configuration
**Claude Code Enhancement System for Australian Developer in Thailand**

---

## User Context

**About You**: Australian developer based in Bangkok, Thailand. Building digital products and web solutions for global and Southeast Asian markets.

- **Technical Level**: Advanced/Senior developer
- **Focus**: Full-stack (frontend, backend, infrastructure)
- **Execution Style**: Autonomous, systematic, evidence-driven
- **Communication**: Direct, concise, problem-focused
- **Your Name**: Shayne

---

## Regional Standards — Australia + Thailand

This framework adapts to your location and working context:

### Language & Format
- **Primary Language**: Australian English (colour, organisation, realise, licence)
- **Secondary Language**: Thai (for local business/content)
- **Date Format**: DD/MM/YYYY (Australian standard)
- **Number Format**: 1,234.56 (comma for thousands, full stop for decimal)

### Currency & Business
- **Primary Currency**: AUD (Australian Dollar) — for invoices, pricing to AU clients
- **Local Currency**: THB (Thai Baht) — for Thailand operations
- **Exchange Rate Context**: 1 AUD ≈ 22–24 THB (approximate)
- **Deployment Region**: Bangkok, Thailand (Southeast Asia CDN edge)
- **Business Timezone**: GMT+7 (Thailand Standard Time — ICT)
- **Business Hours**: Monday–Friday, 9 AM–6 PM Bangkok time

### Compliance & Legal
- **Primary Jurisdiction**: Australia (ACL, Privacy Act)
- **Secondary**: Thailand (Computer Crime Act, PDPA)
- **Tax**: Australian ABN/TFN for international work, Thai tax ID for local operations

---

## Deployment Strategy

### Default Region
- **Vercel Region**: `syd1` (Sydney, Australia) — adjust per project
- **Node.js Version**: 22.x (current LTS)

---

## No Localhost Development

**NEVER run development servers unless explicitly requested.**

- ❌ Don't ask "shall I start the dev server?"
- ❌ Don't run `npm run dev`, `yarn dev`, `pnpm dev`, `next dev`
- ✅ Build and deploy to preview/staging URLs

---

## Security Rules

- ✅ Never commit secrets, API keys, or credentials
- ✅ Use `.env` and `.env.local` for sensitive data
- ✅ Australian Privacy Act compliance
- ✅ Thailand PDPA compliance if handling Thai data
- ✅ Check dependencies for vulnerabilities

---

## Project Boundary Rules

- Work within project root only
- Never navigate to parent directories
- Each project is completely isolated

---

## Core Principles

1. **Evidence-First** — Verify before asserting
2. **Autonomous** — Work independently
3. **Systematic** — Plan, implement, verify
4. **Practical** — Solve real problems
5. **Secure** — Security-first approach
6. **Accessible** — WCAG 2.2 AA minimum
7. **Performance** — Core Web Vitals optimised
8. **Reliable** — 99.9% uptime mindset

---

**Last Updated**: 30 April 2026
**Location**: Bangkok, Thailand | Timezone: GMT+7
