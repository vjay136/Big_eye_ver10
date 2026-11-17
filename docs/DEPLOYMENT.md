# Deploy Big Eye

## Publish the repository

The intended repository is [vjay136/Big_eye_ver10](https://github.com/vjay136/Big_eye_ver10).

The source checkout belongs in the single local Big_Eye directory. Keep original archives in sources/ and generated release files in releases/. Both directories are excluded from Git. Release packages can be uploaded as GitHub release assets.

For future changes, create a feature branch, run tests and builds, open a pull request, and merge the verified result. Increase release.json and application versions through scripts/set-version.mjs before a release.

## Deploy the web app to Vercel

1. Import the GitHub repository into Vercel.
2. Select your intended Vercel team.
3. Set Root Directory to apps/web.
4. Select Vite as the framework.
5. Use pnpm install --frozen-lockfile as the install command.
6. Use pnpm run build as the build command.
7. Set the output directory to dist.
8. Use Node.js 22 or 24.
9. Deploy a preview and exercise Local Triage and Email Intelligence.
10. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for the intended backend. Redeploy because Vite embeds these values during the build.
11. Set the deployed origin in Supabase Auth Site URL and redirect allowlist. Configure Google OAuth if you want Google sign-in.
12. Test sign-up, confirmation, sign-in, each backend tool, persisted scans and sign-out.

The checked-in apps/web/vercel.json configures the Vite output and SPA fallback.

The Vercel CLI is authorized for silent-soldier-vjay. Project big-eye is linked to apps/web and deployed at https://big-eye-silk.vercel.app. The connector belongs to a different account, so project operations use the CLI. See deployment-status.json for the verified deployment.

Vercel creates deployments from connected Git repositories and supports project root, build and environment settings. [Vercel Git deployments](https://vercel.com/docs/git)

## Restore Supabase

The supplied project reference is nlqqbxnifyyvibxboufb. CLI access through its owning account was established on 18 November 2026. The deployed public client is configured and the hosted backend readiness request passes.

1. Make the intended project accessible through your Supabase connection.
2. Compare live schema and migration history against supabase/tables and supabase/migrations.
3. Address the cache and administrative-role findings in ANALYSIS.md.
4. Set commercial API credentials as function secrets through the Supabase dashboard or CLI.
5. Deploy reviewed Edge Functions individually and retain their authentication checks.
6. Verify each function with an authenticated test user, invalid input, provider timeout and a second user attempting unauthorized access.
7. Inspect scan and usage records to confirm frontend/backend synchronization.
8. Record provider availability and quota information before enabling a feature for customers.

The local triage module and extension require no Supabase credentials. Optional DNS lookups use the public Google resolver.

Supabase documents server verification of authenticated function requests and row-level database access. [Function authentication](https://supabase.com/docs/guides/functions/auth), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Load the Chrome extension locally

1. Run node scripts/build-extension.mjs from the project root.
2. Open chrome://extensions in Chrome.
3. Enable Developer mode.
4. Choose Load unpacked.
5. Select releases/1.0.0/extension.
6. Pin Big Eye and open its popup.
7. Paste a message or URL and choose Analyze.
8. Expand Connect web app and save your deployed HTTPS web URL.
9. Choose Open Big Eye web app to launch the hosted application.

The extension uses Manifest V3. The storage permission saves the web app URL. Analysis runs in the popup and message text remains in its temporary memory. It requests no mailbox or website content permissions.

## Publish in the Chrome Web Store

1. Register a Chrome Web Store developer account and complete its account requirements.
2. Enable two-step verification on the publishing Google account.
3. Test the unpacked extension and prepare the ZIP with python scripts/package-release.py.
4. In the developer dashboard, create a new item and upload releases/1.0.0/big-eye-extension-1.0.0.zip. The manifest is at the ZIP root.
5. Provide the description, category, language, support contact, icons and screenshots requested by the current dashboard.
6. Publish an accessible privacy-policy URL that describes the deployed release. For this extension, describe local pasted-text processing and storage of the optional web URL. Describe the web application's separate data handling on its own page.
7. Complete the Privacy practices and permission justifications. Explain that storage retains the user-configured web app URL.
8. Set distribution visibility and submit for review.
9. Monitor dashboard feedback and address any review requests.
10. After approval and publication, test installation from the store URL.

Store review is an external approval step. The local ZIP is prepared for submission. Account registration, listing assets, privacy-policy hosting and store publication require the publisher account and its final content.

Google requires a ZIP with the manifest at its root and larger manifest versions for subsequent uploads. [Prepare an extension](https://developer.chrome.com/docs/webstore/prepare/)

The first item must be created in the developer dashboard. The Chrome Web Store API supports subsequent update automation, and publishers need two-step verification. [Chrome Web Store API](https://developer.chrome.com/docs/webstore/using-api/)

## Publish an update

1. Increase application version and release number with scripts/set-version.mjs.
2. Update CHANGELOG.md and the release notes.
3. Run all tests and build both entry points.
4. Commit and tag the source.
5. Run python scripts/package-release.py.
6. Attach the ZIPs and SHA256SUMS.txt to the GitHub release.
7. Upload the new extension ZIP to the existing Chrome Web Store item.
8. Use a Vercel preview to validate web behavior before promoting the web release.

## Roll back

Restore an earlier verified Git tag for web source and redeploy it. Preserve database compatibility across application releases. The Chrome Web Store dashboard offers rollback behavior for eligible releases. Otherwise distribute a corrected package with a higher manifest version.
