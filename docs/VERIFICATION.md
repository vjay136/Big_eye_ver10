# Verification record

Recorded on 17 November 2026 for version 1.0.0, release 1 preview.

## Passed

- All 18 Node regression tests for local triage, input bounds, URL limits, filename signals, email classification and partial DNS failure.
- TypeScript compilation and Vite production build.
- pnpm dependency audit with zero reported advisories for the installed dependency graph.
- Web browser workflow in headless Edge through the built application.
- Message text triage, bounded .eml import and downloaded JSON report.
- Empty-file SHA-256 verification and executable double-extension signal.
- Integration Readiness listing and search.
- Email provider classification and distinct unknown age fields.
- Live Google Public DNS MX, SPF and DMARC observations for gmail.com.
- Desktop and 390px mobile layout, with horizontal-overflow and page-error checks.
- Packaged Manifest V3 extension loaded in isolated Chromium.
- Extension message triage, saved HTTPS web-app URL and persistence after reload.

## Pending

- Live Supabase authentication, RLS, role checks, migrations and scan persistence.
- Verification and migration of the later branch's API adapters.
- Credentialed provider requests, schema validation and reference-result comparison.
- Vercel deployment because team access requires consent.
- Chrome Web Store review and publication.
- Broader enterprise requirements in IMPLEMENTATION_PLAN.md.

The source catalog contains 78 host references after including example subdomains. It distinguishes verified scope and pending review. Host references include several non-provider website links and examples.

The production build reports a 520 kB application chunk. Further route-based splitting remains available as a performance improvement.

Screenshots are stored locally under releases/1.0.0. Browser checks used isolated profiles. Authenticated backend behavior has pending verification because the intended Supabase project was unavailable through the current connector.
