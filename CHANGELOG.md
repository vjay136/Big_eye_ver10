# Changelog

## 1.0.2 · Release 3 · 2026-11-27

- Grouped tools into Email, Domains & IP, Links, Attachments, Inventory and Setup.
- Added separate browser-only workflows for message headers, URLs and attachment fingerprints.
- Added keyless mail DNS with Google and Cloudflare and an optional DKIM selector.
- Added NIST CPE product lookup through a dedicated server route.
- Switched the public client to the new Supabase project and clarified missing deployment state.
- Added use-case filters to the 83-entry provider catalog.

## 1.0.1 · Release 2 · 2026-11-18

- Verified CLI access to the owning Supabase project and inspected live backend metadata.
- Updated Integration Readiness to use the live 83-entry API registry.
- Added an explicit backend configuration check using the deployed provider catalog.
- Configured the local public Supabase client and recorded outstanding provider verification.

## 1.0.0 · Release 1 · 2026-11-17

Preview foundation imported from the explicitly labelled working project.

- Organized the web frontend, Chrome extension and Supabase backend under one checkout.
- Added local message and URL triage, bounded .eml import, JSON reports, attachment fingerprints, provider hints and DNS evidence.
- Added the later-source integration inventory and readiness dashboard.
- Added an extension that shares the web triage implementation.
- Replaced two fabricated database threat endpoints with explicit unavailable responses.
- Made build commands portable and backend client settings configurable.
- Added regression tests, release metadata, packaging and deployment instructions.
- Recorded the later archive branches and outstanding backend and enterprise work.
