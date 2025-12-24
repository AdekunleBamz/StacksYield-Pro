# WalletConnect (Reown AppKit) + Stacks (JSON-RPC) Integration Guide

This guide shows the exact integration pattern used in this repo to connect Stacks wallets through WalletConnect (via Reown AppKit), discover addresses via `stx_getAddresses`, and sign/broadcast transactions via `stx_signTransaction`.

It’s written to be copy/paste-friendly for new apps.

## What you build (architecture)

- Your app builds Stacks transactions (contract calls, post-conditions, fees, etc).
- WalletConnect is only the transport + modal UI.
- The wallet signs (and optionally broadcasts) via Stacks JSON-RPC methods:
  - `stx_getAddresses`
  - `stx_signTransaction`

## Prerequisites

- Node.js 18+
- A WalletConnect Cloud / Reown project
- A mobile Stacks wallet that supports WalletConnect scanning (e.g. Xverse mobile, Leather mobile)

Important:
- WalletConnect QR codes are meant to be scanned **from inside a wallet app**.
- If you scan with your phone camera, the phone may say “no app can open this” (because it’s a `wc:` URI, not an `https://` link). We handle this in the UI later in this guide.

## 1) Create a WalletConnect Cloud project

1. Create a project in WalletConnect Cloud / Reown.
2. Copy the **Project ID**.
3. Add your app origins to **Allowed Origins / Allowlist**:
   - `http://localhost:5173`
   - `https://your-vercel-domain.vercel.app`

Notes:
- Use the origin only (no path).
- If your QR is blank, allowlist + projectId validity are the first things to re-check.

In this repo, we added:
- `http://localhost:5173`
- `https://stacks-yield-pro.vercel.app`

## 2) Environment variables (Vite)

Create `frontend/.env`:

```dotenv
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
# Optional, enables extra logs
VITE_DEBUG=true
```

This repo reads the value from `import.meta.env.VITE_WALLETCONNECT_PROJECT_ID`.

If you deploy on Vercel:
- Add the same env var in Vercel Project → Settings → Environment Variables.
- Redeploy after changing env vars.

## 3) Install dependencies

From `frontend/`:

```bash
npm i @reown/appkit-universal-connector @walletconnect/universal-provider
```

(Your dependency tree may already include `@walletconnect/*` through Reown.)

## 4) Initialize Reown UniversalConnector (Stacks namespace)

Key points:
- Metadata **must** be valid.
- Provide a non-empty `icons` array with a resolvable URL.
- Request Stacks namespaces and chains.

Example (see `frontend/src/utils/walletconnect.js` in this repo):

- Use `caipNetworkId: 'stacks:1'` for mainnet.
- Pass Stacks RPC methods you need.

### Metadata: do not skip icons

WalletConnect can silently fail pairing if metadata is malformed.

Must-haves:
- `metadata.url` is a valid URL
- `metadata.icons` is a **non-empty** array
- each icon URL is resolvable (returns 200)

This repo uses an absolute icon URL:
- `new URL('/logo.svg', window.location.origin).toString()`

## 5) REQUIRED namespaces (critical for non-blank QR)

Blank QR almost always means WalletConnect never generated a pairing URI.

For Stacks, many wallets won’t pair unless you request a **required** namespace (not only `optionalNamespaces`).

This repo enforces required namespaces on connect:

- `chains: ['stacks:1']`
- `methods: ['stx_getAddresses', 'stx_signTransaction']`

If you only send optional namespaces, the modal may open but no pairing URI is created → QR appears blank.

### Why this matters in Reown UniversalConnector

Reown’s `UniversalConnector` internally maps `networks` → `optionalNamespaces`.
For Stacks wallets, **optional-only** negotiation is a common reason for “modal opens, QR blank”.

Fix applied in this repo:
- Pass `requiredNamespaces` to `connector.connect(...)` (see `wcConnect()` in `frontend/src/utils/walletconnect.js`).

## 6) Capture the pairing URI (QR)

Subscribe to the underlying provider event **before** calling `connect()`:

- `display_uri`

In this repo, the URI is stored in state and also shown via an in-app fallback QR modal.

### QR UX gotcha: phone camera apps

If the user scans the QR using the phone camera, it may show the raw `wc:...` text and say:
- “There’s no app installed that can open this.”

That’s normal, because `wc:` isn’t an `https:` URL.

Fix applied in this repo:
- The fallback modal also shows a camera-friendly link:
   - `https://walletconnect.com/wc?uri=${encodeURIComponent(wcUri)}`
- Users can tap that link on mobile to hand off to an installed wallet.

See: `frontend/src/components/WalletConnectQRModal.jsx`.

### Why you might see a `wc:` string printed

The `wc:` string is the **pairing URI** (it contains relay info + a symmetric key).
It’s expected to exist while pairing.
If you show it in UI, some users will think it’s an “error”.

Fix applied in this repo:
- Close the QR modal immediately after the wallet approves (session created) so users don’t keep seeing the raw `wc:` URI.
   - See `connectWallet()` in `frontend/src/context/WalletContext.jsx`.

## 7) Connect and fetch addresses

After connect succeeds, always request addresses via JSON-RPC:

- `stx_getAddresses`

Do not rely on parsing `session.namespaces.*.accounts` for the STX address; treat that as session metadata, not your source of truth.

You’ll typically pick the entry with `symbol === 'STX'` (or fallback to the first address).

### Real-world issue: `stx_getAddresses` may hang

Some wallets are slow to respond to `stx_getAddresses`, or may not support it consistently.
If your UI waits on it indefinitely, you’ll get “Connecting…” forever.

Fix applied in this repo:
- Add a timeout around `stx_getAddresses` (15s)
- If it fails/times out, fall back to parsing `session.namespaces.stacks.accounts[0]`
- Always clear the connecting state

See: `frontend/src/context/WalletContext.jsx`.

## 8) Build tx in-app → `stx_signTransaction`

Preferred flow:

1. Build an *unsigned* Stacks transaction in the app (contract call, post-conditions, anchor mode, etc).
2. Serialize it to hex.
3. Ask the wallet to sign (and optionally broadcast) with `stx_signTransaction`.

In this repo, contract interactions live in `frontend/src/components/VaultList.jsx`.

### Public key caveat

Some wallets return `publicKey` as part of `stx_getAddresses`, but not all do.

If your tx builder requires a public key and the wallet didn’t provide it, you have two options:

- Ask for additional RPC support (wallet-dependent)
- Use a fallback method (e.g. `stx_callContract`) where the wallet builds the tx

This repo implements the fallback to keep UX working across wallets.

### Network consistency note

WalletConnect pairing is chain-scoped (CAIP):
- Mainnet is `stacks:1`

Make sure your dApp’s displayed network (and any explorer links) match the chain you request.
In this repo, WalletConnect requests are scoped to `stacks:1`.

## 9) Troubleshooting: QR is blank

Rule:
- Blank QR = WalletConnect never created a pairing URI
- It’s not a Stacks tx problem; it’s pairing/initialization.

Checklist:

1. **Project ID** is present at runtime
   - Log it (or log a prefix) and ensure it’s not `undefined`.
   - Watch out for whitespace.

2. **Metadata** is valid
   - `url` is a valid URL
   - `icons` is a non-empty array
   - icon URL resolves (200) from the browser

3. **Required namespaces exist**
   - Ensure `requiredNamespaces.stacks` includes chains + methods.

4. **No premature connect**
   - Initialize connector once.
   - Call connect from a user click.
   - Subscribe to `display_uri` before connect.

5. **Network blocks**
   - Ad blockers / Brave shields / corporate firewalls can block WC relay.
   - Check DevTools Network → WS for WalletConnect relay connections.

## 10) Troubleshooting: wallet approves but app stays “Connecting…”

Symptoms:
- You approve in the mobile wallet
- QR disappears
- Site still says “Connecting…” for a long time

Cause:
- App is waiting for `stx_getAddresses` and it never returns.

Fix:
- Put a timeout around `stx_getAddresses`
- Fall back to the session account address so the UI can show as connected
- Let the user retry if needed

Implemented in this repo: `frontend/src/context/WalletContext.jsx`.

## Reference implementation (this repo)

- Connector + RPC wrappers: `frontend/src/utils/walletconnect.js`
- Wallet state management: `frontend/src/context/WalletContext.jsx`
- Contract calls (build tx + sign/broadcast): `frontend/src/components/VaultList.jsx`
- QR fallback UX + camera link: `frontend/src/components/WalletConnectQRModal.jsx`

## Deploy notes (Vercel)

- Deploy root: `frontend/`
- Set env var `VITE_WALLETCONNECT_PROJECT_ID` in Vercel project settings
- Ensure the Vercel origin is allowlisted in WalletConnect Cloud

Recommended quick checks after deploy:
- Open DevTools console and verify no “Missing VITE_WALLETCONNECT_PROJECT_ID” error
- Click Connect → confirm you receive a `display_uri` event
- Approve in wallet → app should stop “Connecting…” within ~15 seconds
