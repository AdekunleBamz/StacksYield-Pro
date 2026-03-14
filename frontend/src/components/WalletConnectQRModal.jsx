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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={disconnectWallet} aria-hidden="true" />
      <div
        className="relative w-full max-w-sm glass-card rounded-3xl p-8 border border-white/10 shadow-2xl animate-fade-in-up"
        style={{ animationTimingFunction: 'var(--ease-spring)', animationDuration: '600ms' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="walletconnect-title"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-stacks-purple/20 flex items-center justify-center animate-pulse-glow">
            <HiGlobeAlt className="w-7 h-7 text-stacks-purple" />
          </div>
          <div>
            <h3 id="walletconnect-title" className="text-xl font-black tracking-tight text-white leading-none">Connect Wallet</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">WalletConnect Protocol</p>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8 p-4 bg-white rounded-3xl shadow-inner shadow-black/5">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="WalletConnect QR Scan" 
              className="w-full h-auto transition-transform duration-700 hover:scale-105" 
            />
          ) : (
            <div className="w-[280px] h-[280px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-stacks-purple/20 border-t-stacks-purple rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <p className="text-xs text-center text-gray-500 font-bold leading-relaxed px-2">
            Scan this code using the <span className="text-white">WalletConnect</span> scanner in your Xverse or Leather mobile app.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onCopy} 
              className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all active:scale-95"
            >
              {copyState ? copyState : 'Copy URI'}
            </button>
            <button
              onClick={onCopyLink}
              disabled={!wcLink}
              className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all disabled:opacity-30 active:scale-95"
            >
              {copyLinkState ? copyLinkState : 'Copy Link'}
            </button>
          </div>

          <button 
            onClick={disconnectWallet} 
            className="w-full bg-stacks-purple py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-stacks-purple/20 active:scale-[0.98] transition-all"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletConnectQRModal
