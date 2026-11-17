# Implementation plan

## Release 1 foundation

Delivered in 1.0.0 preview.

- Canonical local checkout with separate web and extension applications.
- Git versioning, release metadata and reproducible packaging commands.
- Working baseline import, portable build scripts and configurable backend.
- Shared local phishing triage and attachment fingerprints.
- Email intelligence and optional public DNS evidence.
- Explicit unavailable status for fabricated threat endpoints.
- Regression tests and deployment guides.

## Backend restoration

Requires access to nlqqbxnifyyvibxboufb or an explicitly selected replacement project.

1. Inspect tables, grants, RLS, migrations, authentication settings and deployed functions.
2. Reconcile profile and role models. Keep administrative grants server-controlled.
3. Restrict cache writes and tenant access. Verify cross-user denial with two test identities.
4. Deploy corrected functions and test sign-in, analysis, persistence, history and sign-out.
5. Record which legacy features pass. Keep provider outages visible in the UI.

## Evidence and persistence

Extend the existing scan model with additive relations after schema inspection.

| Proposed relation | Purpose |
|---|---|
| investigations | Owner, target, idempotency key, collection time, workflow status |
| observations | Investigation, provider, fact type, JSON value, classification, confidence, evidence, collected and verified timestamps |
| provider_runs | Outcome, latency, timeout, quota and billable-unit metadata |
| dataset_versions | Approved source, licence, checksum, entry count, activation and rollback state |

Each tenant-owned relation needs ownership or tenant-membership policies, foreign-key indexes and retention behavior. Persist provider failures independently so successful evidence remains usable. Store minimal email content and avoid credentials in observations.

## API integration framework

Implement verified adapters one at a time with live documentation checks. Begin with IPQS, ZeroBounce, EmailRep, HIBP and VirusTotal. Existing AbuseIPDB, OTX, Safe Browsing and URLScan handlers provide reusable starting points.

Each adapter needs configuration, secret storage, explicit permission to disclose submitted data, schema validation, source attribution, timeouts, response-size bounds, quota handling, retry/backoff, cache policy and independently tested failure outcomes.

Mailbox creation requires an authorized administrative provider record. First-seen values retain their provider meaning. RDAP events populate domain registration separately.

## Public API contract

Proposed authenticated POST /investigations accepts a typed email, domain, URL, IP, message or attachment-hash target plus explicitly enabled providers. Return investigation ID, status and evidence items. Each evidence item carries value, source, classification, confidence, collection time, verification time and supporting evidence.

GET /investigations/{id} requires owner or tenant membership. Repeated requests use an idempotency key and isolated provider-run records. Commercial API keys remain in backend configuration.

## Dataset ingestion

Validate source licence and commercial permissions before ingesting disposable-domain lists. Stage downloads, validate domains, deduplicate, checksum, version and activate atomically. Keep a prior working version for rollback and offline use. Keep privacy aliases, forwarding services and ordinary free mail providers in separate classifications.

## Later module migration

Use the final-project branches as source material for category navigation, DNS, certificates, network diagnostics, API health and breach workflows. Port one module at a time to the verified backend contracts, with tests through its normal UI entry point.

## Enterprise functionality

- Header trust boundaries, MIME parsing and bounded .eml uploads.
- SPF evaluation and DKIM verification with required message context.
- Tenant isolation, organization membership and role enforcement.
- Incident state, alert delivery, audit trails and report export.
- Configurable server-side AI providers with prompt-injection isolation and source-grounded responses.
- Proposals for remediation with explicit approval before external changes.
- Licensed provider coverage, usage metering and operational support.
- Browser mail integrations with explicit permissions and platform-specific verification.

## Completion criteria

The enterprise scope is complete when authenticated multi-tenant flows, actual provider calls, persistence, failure isolation, privacy controls, extension distribution and deployed web entry points pass recorded tests. Current release evidence covers the foundation and local investigation workflow. Live backend and store publication remain pending.
