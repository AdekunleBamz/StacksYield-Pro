import React, { useState } from 'react'
import { FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { useWallet } from '../context/WalletContext'

const Header = () => {
  const { userData, userAddress, isConnecting, connectWallet, disconnectWallet } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const truncateAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {userData ? (
              <div className="flex items-center space-x-3">
                <div className="glass-card px-4 py-2 rounded-xl">
                  <p className="text-sm text-gray-400">Connected</p>
                  <p className="text-sm font-mono font-medium text-white">
                    {truncateAddress(userAddress)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"
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
              
              {userData ? (
                <div className="pt-4 border-t border-stacks-gray">
                  <p className="text-sm text-gray-400 mb-2">Connected</p>
                  <p className="text-sm font-mono font-medium text-white mb-4">
                    {truncateAddress(userAddress)}
                  </p>
                  <button
                    onClick={disconnectWallet}
                    className="btn-secondary w-full px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="btn-primary w-full px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
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
