import React, { useState } from 'react'
import { FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { HiSparkles, HiCurrencyDollar, HiGlobeAlt, HiClipboardDocument, HiCheck, HiChevronRight } from 'react-icons/hi2'
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
        <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#1A1A1C] border-l border-white/10 p-6 flex flex-col shadow-2xl transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-white/5 text-gray-400 active:scale-95 transition-all"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {[
                { label: 'Vaults', href: '#vaults' },
                { label: 'How It Works', href: '#how-it-works' },
              ].map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all active:bg-stacks-purple/20 active:translate-x-1"
                >
                  <span className="font-bold">{link.label}</span>
                  <HiChevronRight className="w-5 h-5 opacity-30" />
                </a>
              ))}
              <a 
                href="https://docs.stacks.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2 font-bold">
                  Docs <FiExternalLink className="w-4 h-4" />
                </div>
                <HiChevronRight className="w-5 h-5 opacity-30" />
              </a>

              <div className="my-4 h-px bg-white/5" />

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <NetworkSwitcher currentNetwork={networkType} onSwitch={switchNetwork} />
              </div>

              {isConnected ? (
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">Balance</p>
                      <p className="text-sm font-bold text-stacks-orange">
                        {balanceLoading ? '...' : `${formatBalance(stxBalance)} STX`}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyAddress()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-stacks-purple/10 transition-all group"
                  >
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 group-active:text-stacks-purple transition-colors">
                      {copiedAddress ? 'Address Copied' : 'Connected Wallet'}
                    </p>
                    <p className="text-sm font-mono font-bold text-white mb-2 break-all">
                      {truncateAddress(address)}
                    </p>
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="w-full p-4 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full p-4 rounded-xl bg-stacks-purple text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-stacks-purple/20"
                  >
                    {isConnecting ? (
                      <>
                        <div className="spinner w-5 h-5" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <HiSparkles className="w-5 h-5" />
                        Connect Wallet
                      </>
                    )}
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
