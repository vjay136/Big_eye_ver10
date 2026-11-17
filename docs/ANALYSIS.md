# Architecture and source analysis

## Source provenance

The Drive file is Big_Eye_All _Data.rar, 1,005,531,938 bytes. Its SHA-256 is 5aef3534fea60d7acd3b89cf0a852b565a3d064628514a9b3b55ff75c333aae0.

The archive has 32,917 entries spanning the explicitly labelled working model, earlier deployment experiments, an After_83_completion tree and a Final_project tree. Inspected final-tree App components advertise 82+ APIs and about 30 tools. Those strings are product claims in source. A working integration count requires execution against actual providers.

The explicitly labelled working ZIP supplies the current executable baseline. It contains a React 18, TypeScript, Vite and Tailwind frontend, Supabase Auth, 24 Edge Functions, SQL migrations, additional independent Python services, research reports and screenshots. The largely unimplemented Next.js shell is also present in the archive.

The Python services and experimental branches remain in the local original archive. Their interfaces have pending consolidation. The Vercel web build uses the existing Vite frontend, with Supabase functions as its remote backend.

## Existing tool mapping

| Existing tool | Backend or supporting module | Release status |
|---|---|---|
| All in One Analysis | comprehensive-email-analysis | Imported, live verification pending |
| Email Header Analyzer | analyze-email-header | Imported, live verification pending |
| Domain Checker | check-domain | Imported, live verification pending |
| Email Legitimacy | check-email-legitimacy | Imported, live verification pending |
| Blacklist Scanner | scan-blacklist | Imported, provider credentials pending |
| IP Intelligence | check-ip-reputation-v3 | Imported, live verification pending |
| AI Phishing Detection | analyze-phishing-probability | Imported, scoring implementation needs review |
| Temp Email Detector | detect-temp-email | Imported, provider and licensing review pending |
| Domain Age Tracker | get-domain-age | Imported, RDAP mapping needs verification |
| Link Checker | check-link-reputation | Imported, live verification pending |
| Database Analysis | database-email-validation, database-threat-intelligence, database-comprehensive-analysis | Email validation imported, two fabricated-verdict endpoints replaced with 503 |
| Admin Dashboard | get-api-usage, profile and analytics tables | Imported, server authorization review pending |

The two new tabs use modules in apps/web/src/analysis. The extension build copies triage.mjs from the same source.

## Findings addressed in this release

1. Build scripts invoked pnpm install recursively and used Unix-only deletion commands. They now use direct Vite and TypeScript commands.
2. Public Supabase settings were hardcoded. They now use deployment environment configuration.
3. Opening the application required sign-in even for local analysis. Local tools now have a usable pre-configuration route.
4. database-threat-intelligence generated random observations, confidence, attribution and threat records. database-comprehensive-analysis generated random blacklist matches. Their replacement endpoints return HTTP 503 with INTELLIGENCE_NOT_CONFIGURED.
5. The admin-role hook could keep a prior user's role after an unsuccessful lookup. It resets before each lookup and discards obsolete responses.
6. The source-instrumentation plugin was enabled by a custom production flag. The unused instrumentation dependency and plugin were removed.
7. Unused frontend dependencies were removed after checking source imports. Remaining package ranges and lockfile were refreshed.

## Findings requiring backend work

- The imported cache policy named Service role can manage cache has FOR ALL USING (true) without a role restriction. Review grants and replace it with server-only writes.
- The users table combines profile updates with is_admin. Protect administrative columns through column grants or move authorization to an administrator-managed relation.
- Some functions use service-role access for analytics. Validate user identity and enforce resource ownership before privileged access.
- Several legacy functions fetch user-submitted targets or third-party redirects. Apply destination validation, redirect validation, private-network exclusion and bounded responses before exposing those capabilities to enterprise tenants.
- Some domain handlers mark SPF or DKIM records valid based on existence. Full protocol evaluation requires separate logic and inputs.
- Existing profile updates collect IP and location via external services. Define consent, retention and operational purpose for production.
- Third-party terms, quotas, licence restrictions, availability and output schemas require verification. No successful test of 72 or 82 integrations has been established.
- Historical migrations reference tables that may already exist. They need a schema comparison against the intended project before execution.

## Later branch comparison

Inspected final-tree frontend modules add categorized navigation, AI Threat Detection, enhanced validation, training metrics, command interface, network probes, API health, certificate analysis, WHOIS, breach monitoring, OSINT, exploit data, malware repository and web/API vulnerability scanners.

The baseline choice preserves a named working application and avoids merging incompatible schema and role assumptions during the first import. Migrating later modules is outstanding work. The full source is retained for that work in sources/Big_Eye_All_Data.rar.

## Evidence handling

The new local triage engine runs without remote requests. Optional DNS lookup sends the domain to Google Public DNS. The extension stores only the configured web-app URL. Its popup has no network permission, mailbox content access or provider keys.

Email creation, first-observed and domain registration dates use distinct fields. They currently show UNKNOWN until authoritative or provider observations are added.

Official documentation used for DNS behavior is the Google Public DNS JSON API. Supabase documentation informed the authorization and RLS review.

- [Google Public DNS JSON API](https://developers.google.com/speed/public-dns/docs/doh/json)
- [Supabase function authentication](https://supabase.com/docs/guides/functions/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
