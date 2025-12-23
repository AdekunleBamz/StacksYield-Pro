import React, { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useWallet } from '../context/WalletContext'

const WalletConnectQRModal = () => {
  const { wcUri, isConnecting, isConnected, disconnectWallet } = useWallet()
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copyState, setCopyState] = useState('')

  const isOpen = useMemo(() => !!wcUri && isConnecting && !isConnected, [wcUri, isConnecting, isConnected])

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={disconnectWallet} />
      <div className="relative w-full max-w-sm glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Connect wallet</h3>
        <p className="text-sm text-gray-400 mb-4">Scan with Xverse (mobile) or another WalletConnect-enabled Stacks wallet.</p>

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

        <div className="flex gap-2">
          <button onClick={onCopy} className="flex-1 btn-secondary px-4 py-2 rounded-xl text-sm">
            {copyState ? copyState : 'Copy URI'}
          </button>
          <button onClick={disconnectWallet} className="flex-1 btn-primary px-4 py-2 rounded-xl text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletConnectQRModal
