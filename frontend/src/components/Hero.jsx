import React from 'react'
import { HiArrowRight, HiShieldCheck, HiCurrencyDollar, HiChartBar } from 'react-icons/hi2'
import { useWallet } from '../context/WalletContext'

const Hero = () => {
  const { isConnected, connectWallet } = useWallet()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" aria-label="Welcome to StacksYield Pro">
      {/* Animated floating shapes */}
      <div className="floating-shape top-20 left-10 w-20 h-20 bg-stacks-purple rounded-full" style={{ animationDelay: '0s' }} />
      <div className="floating-shape top-40 right-20 w-16 h-16 bg-stacks-orange rounded-lg rotate-45" style={{ animationDelay: '2s' }} />
      <div className="floating-shape bottom-20 left-1/4 w-12 h-12 bg-stacks-purple rounded-full" style={{ animationDelay: '4s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
            <div className="pulse-dot" />
            <span className="text-sm text-gray-300">Live on Stacks Mainnet</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display leading-tight mb-6">
            <span className="text-white">Maximize Your</span>
            <br />
            <span className="gradient-text">STX Yields</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Auto-compounding vaults with multiple strategies. 
            Conservative, Balanced, or Aggressive - choose your risk level and let your STX work for you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="btn-primary px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 w-full sm:w-auto"
              >
                Start Earning Now
                <HiArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <a
                href="#vaults"
                className="btn-primary px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                View Vaults
                <HiArrowRight className="w-5 h-5" />
              </a>
            )}
            <a
              href="#how-it-works"
              className="btn-secondary px-8 py-4 rounded-2xl font-semibold text-lg w-full sm:w-auto text-center"
            >
              How It Works
            </a>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-vault-conservative/20 flex items-center justify-center mb-4 mx-auto">
                <HiShieldCheck className="w-6 h-6 text-vault-conservative" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Audited</h3>
              <p className="text-gray-400 text-sm">
                Smart contracts built with Clarity for maximum security and transparency
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-vault-balanced/20 flex items-center justify-center mb-4 mx-auto">
                <HiCurrencyDollar className="w-6 h-6 text-vault-balanced" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Auto-Compound</h3>
              <p className="text-gray-400 text-sm">
                Your rewards automatically compound to maximize your returns over time
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-vault-aggressive/20 flex items-center justify-center mb-4 mx-auto">
                <HiChartBar className="w-6 h-6 text-vault-aggressive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Strategies</h3>
              <p className="text-gray-400 text-sm">
                Choose from Conservative (5%), Balanced (12%), or Aggressive (25%) APY
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
