# Big Eye

Email analysis web application and Manifest V3 Chrome extension.

[Open the deployed preview](https://big-eye-silk.vercel.app) · [Supabase project](https://supabase.com/dashboard/project/nprksyjxuzxwzgmpdifa)

The hosted app carries preview release status. The Setup workspace includes the API catalog and checks whether the Supabase provider catalog function responds.

## Current release

Version 1.0.2, release 3, preview, 27 November 2026.

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

The new Supabase project is nprksyjxuzxwzgmpdifa. Its public Auth settings and JWKS endpoints respond successfully. The saved CLI identity receives HTTP 403 for project management. Project-owner access is needed to apply reviewed schema and install functions. The 83-entry catalog is a snapshot from the retired project. See docs/releases/1.0.2.md.

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

The packaging script expects staged or committed Git files and an existing web build. It creates source, web and extension ZIPs plus SHA-256 checksums in releases/1.0.2/.

## Hosting and distribution

Follow docs/DEPLOYMENT.md for GitHub, Vercel, Supabase and Chrome Web Store instructions.

## Version updates

~~~powershell
node scripts/set-version.mjs 1.0.3 4
~~~

This updates package manifests, release.json and the web release display. Update CHANGELOG.md, run verification, commit, tag and package the release. Chrome requires increasing manifest versions for subsequent uploads.

## Implementation status

The inherited tools are visible in their respective workspaces. Backend tools require sign-in and their reviewed, deployed function names in VITE_REVIEWED_FUNCTIONS. The optional setting enables UI routes only. Backend policies and authorization must be enforced separately. Two inherited database endpoints now return an explicit unavailable response because their earlier implementations generated random threat verdicts. Other inherited backend functions require provider and database verification.

The broader enterprise requirements, including licensed intelligence providers, verified mailbox-age integrations, persistent history, tenant controls and AI remediation, remain tracked in docs/IMPLEMENTATION_PLAN.md.
