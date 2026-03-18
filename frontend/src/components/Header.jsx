import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { HiSparkles, HiCurrencyDollar, HiGlobeAlt, HiClipboardDocument, HiCheck, HiChevronRight, HiBars3BottomRight, HiXMark } from 'react-icons/hi2'
import { useWallet } from '../context/WalletContext'
import { NetworkSwitcher } from './NetworkSwitcher'
import { Button } from './Button'

export const Header = () => {
  const { isConnected, address, stxBalance, balanceLoading, isConnecting, connectWallet, disconnectWallet, networkType, switchNetwork } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

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
    await handleDisconnect() // Wait, this should call disconnectWallet
    setMobileMenuOpen(false)
  }
  
  const actualDisconnect = async () => {
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'glass py-2 shadow-2xl' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 group cursor-default">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-stacks-purple/20 logo-shimmer group-hover:scale-110 transition-transform duration-500">
              <HiSparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black font-display tracking-tight leading-none">
                <span className="gradient-text">StacksYield</span>
                <span className="text-white"> Pro</span>
              </h1>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mt-1">Yield Optimizer</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {['Vaults', 'Dashboard', 'Referrals'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-gray-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
              >
                {item}
              </a>
            ))}
            <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer"
              className="text-gray-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-1 hover:scale-105 active:scale-95">
              Docs <FiExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Wallet Connection & Network */}
          <div className="hidden md:flex items-center space-x-6">
            <NetworkSwitcher />
            
            <div className="h-8 w-px bg-white/5" />

            {isConnected ? (
              <div className="flex items-center space-x-3">
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
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">
                      {copiedAddress ? 'Copied' : 'Connected'}
                    </p>
                    <p className="text-sm font-mono font-black text-white leading-none">
                      {truncateAddress(address)}
                    </p>
                  </div>
                </button>
                <button
                  onClick={actualDisconnect}
                  className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all active:scale-90"
                  aria-label="Disconnect wallet"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-2.5 rounded-xl text-xs"
                variant="primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            className="md:hidden p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            {mobileMenuOpen ? (
              <HiXMark className="w-6 h-6" />
            ) : (
              <HiBars3BottomRight className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden fixed inset-0 z-50 transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-stacks-dark/95 backdrop-blur-2xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 relative z-10">
            {['Vaults', 'Dashboard', 'Referrals'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl md:text-5xl font-black gradient-text tracking-tighter hover:scale-110 transition-transform active:scale-90 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {item}
              </a>
            ))}
            <div className="pt-8 w-full max-w-xs border-t border-white/5 flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <NetworkSwitcher />
              {isConnected ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-1">Connected Address</p>
                    <p className="text-sm font-mono font-black text-white">{truncateAddress(address)}</p>
                  </div>
                  <button
                    onClick={actualDisconnect}
                    className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs border border-red-500/20 active:scale-95 transition-all"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={handleConnect}
                  className="w-full py-4 text-xs"
                  variant="primary"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
