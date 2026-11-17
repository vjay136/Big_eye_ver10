# Big Eye

Email analysis web application and Manifest V3 Chrome extension.

## Current release

Version 1.0.1, release 2, preview, 18 November 2026.

The working baseline is the supplied archive named Big_Eye_7th_Nov_2025_last_working_model_ver2.zip. The full Drive archive is retained locally under sources/Big_Eye_All_Data.rar. It includes several later experimental branches. Their additional tools require reconciliation and backend verification.

## Repository layout

~~~text
Big_Eye/
  apps/
    web/
      src/
        analysis/       Shared local analysis and DNS evidence
        components/     Existing tools and new investigation tabs
        lib/            Supabase authentication and client
      public/
      package.json
      pnpm-lock.yaml
      vercel.json
    extension/
      src/              Popup, settings and local analysis entry point
      icons/
      manifest.json
  supabase/
    functions/          Existing Edge Functions
    migrations/         Imported migration history
    tables/             Imported schema definitions
  scripts/              Build, versioning and release packaging
  tests/                Analysis regression tests
  docs/                 Architecture, findings, deployment and release notes
  releases/             Local versioned builds, ignored by Git
  sources/              Original downloaded archive, ignored by Git
  release.json          Release version and sequence
~~~

Use this directory as the canonical checkout. Git records source history. Versioned ZIPs go into releases/<version>/.

## Run locally

Use Node.js 22 or 24 and pnpm 10.28.2.

~~~powershell
npm install --global pnpm@10.28.2
pnpm --dir apps/web install --frozen-lockfile
pnpm dev
~~~

Open the URL printed by Vite. Local Triage and Email Intelligence work before backend configuration.

## Configure the backend

Copy apps/web/.env.example to apps/web/.env.local. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY using your intended Supabase project. These values identify the public client. Put commercial provider secrets in Supabase function secrets.

Supabase CLI access to project nlqqbxnifyyvibxboufb was verified on 18 November 2026. The live project contains 61 functions, 46 public tables and the 83-entry API registry. The local public client is configured. Application authentication, scan persistence, policy enforcement and provider results require further verification. See docs/CONNECTED_BACKEND_REVIEW.md.

The inherited SQL includes permissive cache policies and a user-editable profile carrying is_admin. Review the remediation work in docs/ANALYSIS.md before enabling enterprise access.

## New capabilities

- Bounded .eml/plain-text import and JSON triage report export.
- Local message triage for reply-domain mismatch, reported authentication failure and urgency combined with payment or credential requests.
- URL checks for HTTP, user-information components, IP hosts and encoded international domains.
- Attachment SHA-256 fingerprints and filename signals for scripts, executable double extensions, macros and bidirectional controls.
- Email provider hints that distinguish ordinary free providers and selected privacy aliases.
- Separate unknown states for account creation, first observation and domain registration.
- Optional MX, SPF and DMARC DNS observations with sources, timestamps and partial-failure handling.
- Chrome extension sharing the same triage implementation, with an optional saved web app link.

Scores are heuristic signals. Attachment fingerprints and filename checks require further investigation for a malware verdict. Supplied authentication headers require validation against the receiving server.

The Integration Readiness tab shows all 83 registered APIs, their authentication requirements and pending result verification. Its backend readiness button loads the deployed provider configuration. See docs/API_VERIFICATION.md for the 80+ API verification work.

## Validate and package

~~~powershell
pnpm test
pnpm build
pnpm extension:build
python scripts/package-release.py
~~~

The packaging script expects staged or committed Git files and an existing web build. It creates source, web and extension ZIPs plus SHA-256 checksums in releases/1.0.1/.

## Hosting and distribution

Follow docs/DEPLOYMENT.md for GitHub, Vercel, Supabase and Chrome Web Store instructions.

## Version updates

~~~powershell
node scripts/set-version.mjs 1.0.2 3
~~~

This updates package manifests, release.json and the web release display. Update CHANGELOG.md, run verification, commit, tag and package the release. Chrome requires increasing manifest versions for subsequent uploads.

## Implementation status

The imported 12 tools remain available to configured, authenticated users. Two inherited database endpoints now return an explicit unavailable response because their earlier implementations generated random threat verdicts. Other inherited backend functions require provider and database verification.

The broader enterprise requirements, including licensed intelligence providers, verified mailbox-age integrations, persistent history, tenant controls and AI remediation, remain tracked in docs/IMPLEMENTATION_PLAN.md.
