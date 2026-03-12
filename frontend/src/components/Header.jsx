import React, { useState } from 'react'
import { FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { HiSparkles, HiCurrencyDollar, HiGlobeAlt, HiClipboardDocument, HiCheck } from 'react-icons/hi2'
import { useWallet } from '../context/WalletContext'
import NetworkSwitcher from './NetworkSwitcher'

const Header = () => {
  const { isConnected, address, stxBalance, balanceLoading, isConnecting, connectWallet, disconnectWallet, networkType, switchNetwork } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const truncateAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return '...'
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleConnect = async () => {
    await connectWallet()
    setMobileMenuOpen(false)
  }

  const handleDisconnect = async () => {
    await disconnectWallet()
    setMobileMenuOpen(false)
  }

  const handleCopyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 1500)
    } catch {
      setCopiedAddress(false)
    }
  }

  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">
                <span className="gradient-text">StacksYield</span>
                <span className="text-white"> Pro</span>
              </h1>
              <p className="text-xs text-gray-500">Powered by WalletKit</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#vaults" className="text-gray-300 hover:text-white transition-colors">
              Vaults
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              Docs <FiExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Wallet Connection & Network */}
          <div className="hidden md:flex items-center space-x-6">
            <NetworkSwitcher currentNetwork={networkType} onSwitch={switchNetwork} />
            
            <div className="h-8 w-px bg-white/5" />

            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* STX Balance */}
                <div className="glass-card px-3 py-2 rounded-xl flex items-center space-x-2">
                  <HiCurrencyDollar className="w-4 h-4 text-stacks-orange" />
                  <div>
                    <p className="text-xs text-gray-400">Balance</p>
                    <p className="text-sm font-medium text-white">
                      {balanceLoading ? '...' : `${formatBalance(stxBalance)} STX`}
                    </p>
                  </div>
                </div>
                {/* Address with Copy Shortcut */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="glass-card px-4 py-2 rounded-xl text-left hover:bg-stacks-purple/10 transition-all duration-300 group flex items-center gap-3 border border-white/5 active:scale-95 tooltip"
                  data-tooltip={copiedAddress ? 'Copied!' : 'Click to copy address'}
                  aria-label={address ? `Copy wallet address: ${address}` : 'Copy wallet address'}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    copiedAddress ? 'bg-green-500/20' : 'bg-stacks-purple/20'
                  }`}>
                    {copiedAddress ? (
                      <HiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <HiClipboardDocument className="w-4 h-4 text-stacks-purple group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">
                      {copiedAddress ? 'Address Copied' : 'Wallet Address'}
                    </p>
                    <p className="text-sm font-mono font-bold text-white leading-none">
                      {truncateAddress(address)}
                    </p>
                  </div>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium"
                  aria-label="Disconnect wallet"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                aria-label="Connect your Stacks wallet"
                className="btn-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-stacks-purple/50"
              >
                {isConnecting ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Connect Wallet
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg glass"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stacks-gray">
            <nav className="flex flex-col space-y-4">
              <a href="#vaults" className="text-gray-300 hover:text-white transition-colors">
                Vaults
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Docs <FiExternalLink className="w-3 h-3" />
              </a>

              <div className="pt-4 border-t border-stacks-gray">
                <NetworkSwitcher currentNetwork={networkType} onSwitch={switchNetwork} />
              </div>

              {isConnected ? (
                <div className="pt-4 border-t border-stacks-gray">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-sm font-medium text-stacks-orange">
                      {balanceLoading ? '...' : `${formatBalance(stxBalance)} STX`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Connected</p>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="w-full text-left text-sm font-mono font-medium text-white mb-2"
                    title={address ? 'Copy address' : 'Wallet not connected'}
                    aria-label={address ? `Copy wallet address: ${address}` : 'Copy wallet address'}
                  >
                    {truncateAddress(address)}
                  </button>
                  {copiedAddress && (
                    <p className="text-xs text-stacks-purple mb-4">Copied</p>
                  )}
                  <button
                    onClick={handleDisconnect}
                    className="btn-secondary w-full px-4 py-2 rounded-xl text-sm font-medium"
                    aria-label="Disconnect wallet"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  aria-label="Connect your Stacks wallet"
                  className="btn-primary w-full px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-stacks-purple/50"
                >
                  {isConnecting ? (
                    <>
                      <div className="spinner w-4 h-4" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <HiSparkles className="w-4 h-4" />
                      Connect Wallet
                    </>
                  )}
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
