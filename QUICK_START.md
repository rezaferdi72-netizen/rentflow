# PropertyOS — 5-minute GitHub/Vercel setup

1. Unzip `PropertyOS_GitHub_Vercel_Source.zip`.
2. In GitHub, choose **New repository**, name it `propertyos`, keep it **Private**, and upload the **contents** of the `propertyos-web` folder. Include `vercel.json`, `package.json`, the JavaScript files, the `scripts` folder, and the app icon. Do not upload the ZIP as a single file.
3. In Vercel, choose **Add New → Project**, import the GitHub repository, use **Framework Preset: Other**. The configuration in `vercel.json` provides the build command `npm run build` and output folder `dist`.
4. Click **Deploy**. Open the generated `*.vercel.app` address in your browser.
5. Create your own business name and vault password (10+ characters). Set business details, then enter accounts, properties, units, tenants and leases.
6. Choose **Rent & Invoices → Generate all rent bills**, then use **Payments & Receipts → Record payment** to issue payment receipts.
7. Visit **Backup & Restore** to download encrypted backups regularly.

## Essential privacy distinction

Your Vercel URL hosts the APP, **not your database**. All records live encrypted in the particular browser/device. To transfer to another device, download a backup and restore it there. There is **no automatic multi-device synchronization or shared user database**. A hosted database/backend would be required to add that, and it is intentionally not included in this no-subscription version.

## Test before real business use

Run `npm test` and `npm run build`, enter sample transactions in a browser, verify printed invoices/receipts and account balances, test backup-restore on a second browser, and obtain professional accounting/security review if used for material business records.

More details: `README.md`.
