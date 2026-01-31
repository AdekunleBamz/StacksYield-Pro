import React, { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useWallet } from '../context/WalletContext'

const WalletConnectQRModal = () => {
  const { wcUri, isConnecting, isConnected, disconnectWallet } = useWallet()
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copyState, setCopyState] = useState('')
  const [copyLinkState, setCopyLinkState] = useState('')

  const isOpen = useMemo(() => !!wcUri && isConnecting && !isConnected, [wcUri, isConnecting, isConnected])

  // Camera apps often can't open `wc:` URIs directly; this link opens a WC landing page
  // that can deep-link into an installed wallet.
  const wcLink = useMemo(() => {
    if (!wcUri) return null
    return `https://walletconnect.com/wc?uri=${encodeURIComponent(wcUri)}`
  }, [wcUri])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!wcUri) {
        setQrDataUrl(null)
        return
      }
      try {
        const url = await QRCode.toDataURL(wcUri, { margin: 1, width: 280 })
        if (!cancelled) setQrDataUrl(url)
      } catch {
        if (!cancelled) setQrDataUrl(null)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [wcUri])

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        disconnectWallet()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, disconnectWallet])

  if (!isOpen) return null

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(wcUri)
      setCopyState('Copied')
      setTimeout(() => setCopyState(''), 1500)
    } catch {
      setCopyState('Copy failed')
      setTimeout(() => setCopyState(''), 1500)
    }
  }

  const onCopyLink = async () => {
    if (!wcLink) return
    try {
      await navigator.clipboard.writeText(wcLink)
      setCopyLinkState('Copied')
      setTimeout(() => setCopyLinkState(''), 1500)
    } catch {
      setCopyLinkState('Copy failed')
      setTimeout(() => setCopyLinkState(''), 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={disconnectWallet} aria-hidden="true" />
      <div
        className="relative w-full max-w-sm glass-card rounded-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="walletconnect-title"
        aria-describedby="walletconnect-description"
      >
        <h3 id="walletconnect-title" className="text-lg font-semibold mb-2 text-white">Connect wallet</h3>
        <p id="walletconnect-description" className="text-sm text-gray-400 mb-4">
          Scan with Xverse/Leather (mobile) using the wallet&apos;s WalletConnect scanner.
          Phone camera apps often can&apos;t open <span className="font-mono">wc:</span> QR codes.
        </p>

        <div className="flex items-center justify-center mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="WalletConnect QR" className="rounded-xl bg-white p-2" />
          ) : (
            <div className="w-[280px] h-[280px] rounded-xl bg-white/10 flex items-center justify-center">
              <div className="spinner w-6 h-6" />
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 break-all bg-stacks-gray/40 rounded-xl p-3 mb-4">
          {wcUri}
        </div>

        {wcLink && (
          <a
            href={wcLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-stacks-orange break-all underline mb-4"
          >
            Open on phone: {wcLink}
          </a>
        )}

        <div className="flex gap-2">
          <button onClick={onCopy} className="flex-1 btn-secondary px-4 py-2 rounded-xl text-sm">
            {copyState ? copyState : 'Copy URI'}
          </button>
          <button
            onClick={onCopyLink}
            disabled={!wcLink}
            className="flex-1 btn-secondary px-4 py-2 rounded-xl text-sm"
          >
            {copyLinkState ? copyLinkState : 'Copy Link'}
          </button>
        </div>

        <div className="flex gap-2 mt-2">
          <button onClick={disconnectWallet} className="flex-1 btn-primary px-4 py-2 rounded-xl text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletConnectQRModal
