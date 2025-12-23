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

## 1) Create a WalletConnect Cloud project

1. Create a project in WalletConnect Cloud / Reown.
2. Copy the **Project ID**.
3. Add your app origins to **Allowed Origins / Allowlist**:
   - `http://localhost:5173`
   - `https://your-vercel-domain.vercel.app`

Notes:
- Use the origin only (no path).
- If your QR is blank, allowlist + projectId validity are the first things to re-check.

## 2) Environment variables (Vite)

Create `frontend/.env`:

```dotenv
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
# Optional, enables extra logs
VITE_DEBUG=true
```

This repo reads the value from `import.meta.env.VITE_WALLETCONNECT_PROJECT_ID`.

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

## 5) REQUIRED namespaces (critical for non-blank QR)

Blank QR almost always means WalletConnect never generated a pairing URI.

For Stacks, many wallets won’t pair unless you request a **required** namespace (not only `optionalNamespaces`).

This repo enforces required namespaces on connect:

- `chains: ['stacks:1']`
- `methods: ['stx_getAddresses', 'stx_signTransaction']`

If you only send optional namespaces, the modal may open but no pairing URI is created → QR appears blank.

## 6) Capture the pairing URI (QR)

Subscribe to the underlying provider event **before** calling `connect()`:

- `display_uri`

In this repo, the URI is stored in state and also shown via an in-app fallback QR modal.

## 7) Connect and fetch addresses

After connect succeeds, always request addresses via JSON-RPC:

- `stx_getAddresses`

Do not rely on parsing `session.namespaces.*.accounts` for the STX address; treat that as session metadata, not your source of truth.

You’ll typically pick the entry with `symbol === 'STX'` (or fallback to the first address).

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

## Reference implementation (this repo)

- Connector + RPC wrappers: `frontend/src/utils/walletconnect.js`
- Wallet state management: `frontend/src/context/WalletContext.jsx`
- Contract calls (build tx + sign/broadcast): `frontend/src/components/VaultList.jsx`

## Deploy notes (Vercel)

- Deploy root: `frontend/`
- Set env var `VITE_WALLETCONNECT_PROJECT_ID` in Vercel project settings
- Ensure the Vercel origin is allowlisted in WalletConnect Cloud
