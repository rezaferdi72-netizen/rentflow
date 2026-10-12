# PropertyOS — Private Property, Rent & Investment Management

**A complete, usable offline-first business management web app that you can publish from your own GitHub repository to Vercel.** Your records are encrypted in your browser; there is no mandatory subscription or hosted database. Designed for Bangladeshi business operations (BDT ৳, local dates, A4 business paperwork).

> **Architecture distinction:** Publishing the application code to Vercel does **not** store your business database online. Each browser/device has its own encrypted local vault. You can transfer a vault by exporting and restoring encrypted backups. This version does **not** automatically synchronize your PC and phone. There is no server-side multi-user login, sharing, cloud backup, or automated billing job. These require a separately designed hosted/sync service.

## Available modules

| Area | Working functionality |
|---|---|
| Dashboard | Live rent collections, overdue totals, monthly operating net, occupancy, charts, quick actions |
| Properties & units | Separate property and rental-unit records, current occupancy, archival without historical deletion |
| Tenants & leases | Contact records, tenancy dates, rent and deposit terms, overlapping-active-lease checks |
| Monthly billing | Generate invoices for each eligible lease/month once, or create an invoice manually with another charge |
| Payment collections | Partial rent payments, automatic receipt IDs, account allocation, remaining invoice balance |
| Print | A4 invoices, money receipts, cash/bank statements using browser Print / Save as PDF |
| Deposits | Refundable tenant deposits are tracked as liabilities (not rental revenue) |
| Advances | Receive tenant advances, allocate available credit to later invoices without double-counting cash |
| Expenses | Property and business expenses with categories and cash/bank impact |
| Bank & cash | Multiple accounts, transfers and bank-statement-style transaction views |
| Investments | Capital invested, investment distributions and simple realized return reporting |
| Loans | Record loan proceeds and split principal / interest repayments |
| Maintenance | Issues, statuses, priority and estimated costs |
| Documents | Store small files (up to 3 MB each) encrypted in the vault |
| Reporting | Ledger CSV, arrears aging, property revenue/expenses, deposit liabilities, loan balances, investment indicators |
| Data & audit | Encrypted full backups, restore, CSV export, persistent audit entries, transaction reversals |
| Settings | Business identity for invoices/receipts, password change and vault lock |

**Financial handling:** invoice balance = invoiced amount − cash payments − allocated tenant advances. Security deposits are not profit. Money transferred between bank and cash is neutral in overall financial totals. Reversed transactions remain visible in history but stop affecting balances. Historical financial records are reversed rather than silently deleted. Uploaded files and business data are encrypted by Web Crypto using AES-256-GCM; encryption key comes from your password via PBKDF2-SHA-256.

## Deploy with GitHub and Vercel (no database setup)

1. Extract the ZIP, then create a **new private GitHub repository** named `propertyos`.
2. Upload **all the files from inside this folder** to the repository root (`index.html`, `app.js`, `vault.js`, `style.css`, `vercel.json`, `package.json`, `scripts/`, etc.). Do **not** upload only the ZIP.
3. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub and import your `propertyos` repository.
4. Vercel project settings: **Framework Preset = Other**; **Root Directory = ./ (default)**. The repository includes `vercel.json` with **Build Command = `npm run build`** and **Output Directory = `dist`**. No environment variables, API keys or third-party databases are needed.
5. Click **Deploy**. Open the resulting `*.vercel.app` address. Create a business name and a strong, unique vault password.
6. Enter properties → units → tenants → leases → generate monthly invoices → record payments. Use **Backup & Restore** regularly to protect your records.

**Automatic future updates:** When you push a code change to your connected GitHub repository, Vercel deploys the updated app. Existing IndexedDB data remains on the same browser and origin. Changing your domain/origin or clearing site storage will **not** automatically migrate the vault: make an encrypted backup and restore it on the new origin.

GitHub deployment reference: https://vercel.com/docs/git/vercel-for-github

## Run the app locally (Mac / Windows / Linux)

Requires Node.js 18+ only (no `npm install` needed):

```sh
npm run dev
```

Open `http://localhost:4173`. Browser IndexedDB works on localhost (secure browser context). For a release-quality static output:

```sh
npm test
npm run build
```

`dist/` is the finished static website. You can host it with Vercel, Netlify, a local HTTPS server, or another static web host. Do not simply double-click `index.html`: module imports and encrypted browser storage need an HTTP(S) origin.

## Install for offline use

1. Open the Vercel HTTPS address in Chrome, Edge or Safari.
2. On supported browsers, choose **Install app** or **Add to Home Screen** from the browser menu.
3. Visit the app online at least once so its service worker can cache the website shell. Offline use should then work on that same device (depending on browser support and storage retention).
4. Back up your vault before browser resets, device changes, or clearing website data.

## Understanding security and ownership

- You own the source code, the deployed website configuration, and your encrypted data backups.
- The app currently makes **no business-data network requests**. Vercel serves only static code and assets, not your financial records.
- The vault is encrypted at rest inside browser IndexedDB. Unlocking decrypts it in memory for that session. **Lock the vault when stepping away** and use a password-protected device.
- If you forget your password, there is no server-side reset or recovery. Encrypted backups need the backup's password.
- Do not store backups or plaintext CSV exports in public GitHub repositories. The code can be public; private records should never be.
- Separate devices need separate vaults unless you export/import a backup. Avoid editing two copies independently: restore *replaces* the destination's local vault and does not merge changes.
- It has no server-side authorization, multi-user account system, automated offsite disaster recovery, bank API integration, tax filing, or sync conflict resolution. Such features need a second-stage backend.
- Browser storage is not a substitute for scheduled backups, independent accounting review, or production security assessment. Use a current browser and HTTPS for the published version.

## Recommended day-to-day workflow

**Initial setup:** create vault → enter business information → add accounts → add properties/units → tenants → leases → optionally record deposits. 

**Every month:** Rent & Invoices → select month → **Generate all rent bills**. Bills are idempotent: it does not create a second normal invoice for the same lease and billing month.

**Collection:** Payments & Receipts → Record Payment → select invoice and bank/cash account → print receipt. Partial payment reduces outstanding. For advance rent, create a tenant advance first, then allocate it to an invoice when appropriate.

**Expenses and financing:** log costs as expenses, principal invested as investments, income as returns, loans as proceeds, and repayments split into principal and interest. Between accounts use the Transfers module (not income or expenses).

**Year-end:** review Reports; export relevant tables to CSV/Excel and print account statements; create and independently retain a complete encrypted backup.

## Known limits of this first release

- Single-device encrypted vault per browser origin; manual backup movement between devices.
- A small-document store, not suitable for gigabytes of archival files or enormous portfolios; IndexedDB quotas vary by browser.
- Automatic invoices are generated *when you click the button*, not by a server in the background.
- Invoice amounts and lease edits should be reviewed by the business owner; this tool is not a replacement for a professional accounting or statutory tax system.
- Printed documents can be saved as PDF using the browser's print dialog, rather than a built-in cloud PDF generator.
- This source package has JavaScript syntax checks, a successful static build, and automated financial-calculation checks. A full production security review and all-browser end-to-end acceptance tests have **not** been performed.

## Files

- `index.html` — static application shell
- `app.js` — UI, modules, forms, transaction rules, reports
- `vault.js` — encrypted IndexedDB storage and backup cryptography
- `print.js` — A4 invoice/receipt/statement documents
- `style.css` — responsive premium interface
- `sw.js` + `manifest.webmanifest` — PWA offline-shell support
- `vercel.json` — static deployment, security headers and build output
- `scripts/build.mjs` — dependency-free static release build
- `scripts/serve.mjs` — dependency-free local server
- `scripts/check-financials.mjs` — accounting integrity tests

**Built for owner-controlled hosting.** If you later want real-time web access to *the same records* from multiple devices, it is possible to add a backend and authenticated sync layer, but that would change the current no-hosted-database constraint.
