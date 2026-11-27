# API verification status

On 27 November 2026, the hosted app switched to project nprksyjxuzxwzgmpdifa. The 83 entries are a snapshot from the retired project. The NIST CPE lookup is wired and was verified in the browser. The new Supabase project does not have the provider catalog function. See releases/1.0.2.md for the current state.

On 18 November 2026, the owning Supabase account was authorized through the CLI. The live api_registry supplies the full 83-entry checklist. The Integration Readiness tab now uses that registry and can load the deployed 26-adapter configuration response. See CONNECTED_BACKEND_REVIEW.md for verified access and credential availability.

The requested target is every claimed 80+ API. The later source advertises 82+. Its selected final branch has 56 Edge Function handlers and 78 distinct outbound host references. These counts describe different objects and require reconciliation. The host references include social links and example targets.

The inherited health checker checks eight targets and treats HTTP success as operational. Credential validation, successful provider-specific schemas and correct indicator results need separate tests.

The historical host inventory is apps/web/src/config/integrationCatalog.json. The current API inventory is apps/web/src/config/providerCatalog.json. Google DNS MX/SPF/DMARC was exercised through the current browser flow. Remaining source references await adapter review and live result validation.

## Verification criteria

- Confirm the official endpoint, current API version, authentication, licence and commercial terms.
- Validate the request with a benign, documented test indicator.
- Validate the response schema, indicator identity and source-specific result meaning.
- Exercise invalid input, missing credentials, rate limits, timeout and partial provider outage.
- Check evidence timestamps, cache age and unknown fields.
- Verify frontend rendering, authenticated backend request and owned persistence records.

## Credential names found in later source

- ABUSEIPDB_API_KEY
- APIVOID_API_KEY
- API_NINJAS_KEY
- BLACKLIST_MASTER_API_KEY
- CHECKPHISH_API_KEY
- CROWD_SEC_API_KEY
- DMARCLY_API_KEY
- EASYDMCARC_API_KEY
- EMAILREP_API_KEY
- GOOGLE_SAFE_BROWSING_API_KEY
- HETRIXTOOLS_API_KEY
- HIBP_API_KEY
- IBM_XFORCE_API_KEY
- IPQUALITYSCORE_API_KEY
- IPTRACKERONLINE_API_KEY
- MAILBOXLAYER_API_KEY
- MXTOOLBOX_API_KEY
- OTX_API_KEY
- PHISHING_INITIATIVE_API_KEY
- PHISHTANK_API_KEY
- RBLTRACKER_API_KEY
- RESEND_API_KEY
- SECURITYTRAILS_API_KEY
- SHADOWSERVER_API_KEY
- SHODAN_API_KEY
- TRUSTIFI_API_KEY
- URLSCAN_API_KEY
- VERIFALIA_PASSWORD
- VERIFALIA_USERNAME
- VERIFY_EMAIL_API_KEY
- VIRUSTOTAL_API_KEY
- WHOISXML_API_KEY

Names are extracted from source and need provider-specific review. Store credentials in backend secrets. Source includes the spelling EASYDMCARC_API_KEY and naming differences such as OTX_API_KEY versus ALIENVAULT_OTX_API_KEY in the older baseline. Normalize these during adapter migration.
