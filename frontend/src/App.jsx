import React, { useState } from 'react'
import { WalletProvider, useWallet } from './context/WalletContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import VaultList from './components/VaultList'
import UserDashboard from './components/UserDashboard'
import ReferralSection from './components/ReferralSection'
import Footer from './components/Footer'

// Main App Content (uses wallet context)
function AppContent() {
  const { userData } = useWallet()
  const isConnected = !!userData
  const [activeTab, setActiveTab] = useState('vaults')

  return (
    <div className="min-h-screen bg-stacks-dark relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-hero-pattern opacity-50 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-stacks-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-stacks-orange/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero />
          
          <Stats />
          
          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="flex space-x-4 border-b border-stacks-gray">
              <button
                onClick={() => setActiveTab('vaults')}
                className={`px-6 py-3 font-medium transition-all ${
                  activeTab === 'vaults' 
                    ? 'tab-active text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Vaults
              </button>
              {isConnected && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === 'dashboard' 
                        ? 'tab-active text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === 'referrals' 
                        ? 'tab-active text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Referrals
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'vaults' && <VaultList />}
            
            {activeTab === 'dashboard' && isConnected && <UserDashboard />}
            
            {activeTab === 'referrals' && isConnected && <ReferralSection />}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

// App wrapper with providers
function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App
