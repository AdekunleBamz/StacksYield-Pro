import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { StacksMainnet } from '@stacks/network'

// Contract configuration
export const CONTRACT_ADDRESS = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N'
export const CONTRACT_NAME = 'stacksyield-pro'
export const network = new StacksMainnet()

// App configuration for Stacks Connect / WalletKit
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

// Create the context
const WalletContext = createContext(null)

// App details for wallet connection
const appDetails = {
  name: 'StacksYield Pro',
  icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '/logo.png',
}

export const WalletProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if user is already signed in on mount
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData()
      setUserData(data)
    }
    setIsInitialized(true)
  }, [])

  // Get user's STX address (mainnet)
  const getAddress = useCallback(() => {
    if (!userData) return null
    return userData.profile?.stxAddress?.mainnet || null
  }, [userData])

  // Connect wallet using Stacks Connect (WalletKit compatible)
  const connectWallet = useCallback(() => {
    setIsConnecting(true)
    
    showConnect({
      appDetails,
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData()
        setUserData(data)
        setIsConnecting(false)
      },
      onCancel: () => {
        setIsConnecting(false)
      },
      userSession,
    })
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    userSession.signUserOut('/')
    setUserData(null)
  }, [])

  // Check if connected
  const isConnected = !!userData

  // Context value
  const value = {
    // State
    userData,
    isConnected,
    isConnecting,
    isInitialized,
    
    // Derived values
    address: getAddress(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    
    // Network & Contract info
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    
    // User session for contract calls
    userSession,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Helper hook for contract calls
export const useContractConfig = () => {
  const { network, contractAddress, contractName, address } = useWallet()
  return { network, contractAddress, contractName, senderAddress: address }
}

export default WalletContext
