# Backend integration inventory

Generated from the 24 imported Edge Function sources after release changes. Environment-variable names identify configuration requirements. Provider request validity, licensing and live responses require separate verification. Hostnames identify calls found in source.

| Function | Commercial secret variables | Outbound hosts in source | Status |
|---|---|---|---|
| analyze-email-header | None found in this handler | Internal or locally computed | Imported, live verification pending |
| analyze-email-links | None found in this handler | Internal or locally computed | Imported, live verification pending |
| analyze-phishing-probability | None found in this handler | Internal or locally computed | Imported, live verification pending |
| check-domain | None found in this handler | https://cloudflare-dns.com, https://whoisjson.com | Imported, live verification pending |
| check-email-legitimacy | EMAIL_VALIDATION_API_KEY | https://cloudflare-dns.com, https://disposable.debounce.io, https://isitarealemail.com | Imported, live verification pending |
| check-ip-reputation | None found in this handler | https://cloudflare-dns.com, https://ipwhois.app | Imported, live verification pending |
| check-ip-reputation-v3 | None found in this handler | http://ip-api.com, https://freeipapi.com, https://ipapi.co | Imported, live verification pending |
| check-link-reputation | None found in this handler | https://api.ssllabs.com, https://rdap.org | Imported, live verification pending |
| comprehensive-email-analysis | None found in this handler | Internal or locally computed | Imported, live verification pending |
| compress-logs | None found in this handler | Internal or locally computed | Imported, live verification pending |
| database-comprehensive-analysis | None found in this handler | Internal or locally computed | Unavailable pending verified data source |
| database-email-validation | None found in this handler | Internal or locally computed | Imported, live verification pending |
| database-threat-intelligence | None found in this handler | Internal or locally computed | Unavailable pending verified data source |
| detect-temp-email | None found in this handler | https://disposable.debounce.io | Imported, live verification pending |
| domain-analysis-comprehensive | None found in this handler | https://api.hackertarget.com, https://who-dat.as93.net | Imported, live verification pending |
| email-analysis-comprehensive | None found in this handler | https://api.hackertarget.com, https://emailrep.io, https://verifyemail.vercel.app | Imported, live verification pending |
| get-api-usage | None found in this handler | Internal or locally computed | Imported, live verification pending |
| get-domain-age | None found in this handler | https://rdap.net, https://rdap.org | Imported, live verification pending |
| ip-analysis-comprehensive | ABUSEIPDB_API_KEY, IPQUALITYSCORE_API_KEY | http://ip-api.com, https://api.abuseipdb.com, https://dns.google, https://ipqualityscore.com | Imported, live verification pending |
| link-analysis-comprehensive | GOOGLE_SAFE_BROWSING_API_KEY, PHISHTANK_API_KEY, URLSCAN_API_KEY | https://checkurl.phishtank.com, https://safebrowsing.googleapis.com, https://urlscan.io | Imported, live verification pending |
| scan-blacklist | ABUSEIPDB_API_KEY | https://api.abuseipdb.com, https://cloudflare-dns.com | Imported, live verification pending |
| threat-intelligence-comprehensive | ALIENVAULT_OTX_API_KEY, CROWDSEC_API_KEY, VIRUSTOTAL_API_KEY | https://cti.api.crowdsec.net, https://otx.alienvault.com, https://www.virustotal.com | Imported, live verification pending |
| track-user-analytics | None found in this handler | Internal or locally computed | Imported, live verification pending |
| update-user-profile | None found in this handler | Internal or locally computed | Imported, live verification pending |
