# Connected backend review

Recorded on 18 November 2026 for the next local preview, version 1.0.1, release 2.

Supabase CLI login completed successfully using the account that owns project nlqqbxnifyyvibxboufb. The project reports ACTIVE_HEALTHY.

## Verified observations

- The live project has 61 deployed Edge Functions.
- The public schema has 46 tables. RLS is enabled on all 46.
- The live api_registry contains 83 entries.
- The api_keys table has two records for CPE API, with one active record. Only aggregate counts were read.
- Edge Function secret names contain Supabase platform settings and BIG_EYE_INTELLIGENCE_HMAC_SECRET. The commercial provider secret names expected by the deployed catalog are absent.
- A request to get-provider-catalog returned HTTP 200 with 26 provider configurations. It reports nine configured public adapters and 21 wired adapters. These are configuration declarations and require executed provider calls to establish live verification.
- The public Supabase client configuration was written to the ignored apps/web/.env.local file.
- Deployed function source was downloaded into .build/live-backend for comparison.

## Current gaps

The 83-entry registry includes public feeds, commercial APIs, local analysis standards and products requiring customer-hosted services. The deployed provider-catalog function covers 26 configurations. Reconciling each registry row to an implementation and validating its results remain outstanding.

RLS being enabled establishes its presence. Policy predicates, grants and two-user isolation tests still require verification.

Vercel CLI authorization succeeded for the silent-soldier-vjay team. Project big-eye was created and the apps/web directory was linked to it. Public Supabase client variables were saved for Preview and Production. The connector remains scoped to another account; deployment uses the authorized CLI.

GitHub publication remains pending explicit approval of public source publication following automatic approval review.

## Local changes

Integration Readiness now uses the live 83-entry registry and can request backend adapter configuration from get-provider-catalog. Every registry entry retains pending live-result verification until an adapter request and expected result are recorded. Version 1.0.1, release 2 preserves version 1.0.0's local artifacts.

## Hosted verification

Version 1.0.1, release 2 is deployed at https://big-eye-silk.vercel.app. Vercel reports READY. The first deployment uses Production because Vercel requires that target for new projects. Hosted message triage and the backend 26-provider configuration response were verified through the browser.

Supabase Auth Site URL and the redirect allowlist now include the deployed origin. A read-back comparison confirmed both declared settings match. Authenticated user sign-in and provider analysis results still require separate tests.
