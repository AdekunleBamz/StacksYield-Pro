import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { StacksMainnet } from '@stacks/network'
import {
  wcConnect,
  wcDisconnect,
  wcOnDisplayUri,
  wcGetAddresses,
  getStacksAddressFromSession,
} from '../utils/walletconnect'

// Contract configuration
export const CONTRACT_ADDRESS = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N'
export const CONTRACT_NAME = 'stacksyield-pro-v2'
// Use Hiro API (browser-compatible with proper CORS and SSL)
export const STACKS_CORE_API = 'https://api.mainnet.hiro.so'
export const network = new StacksMainnet()
network.coreApiUrl = STACKS_CORE_API

// Stacks API endpoint for balance queries (same endpoint)
const STACKS_API = 'https://api.mainnet.hiro.so'

// Create the context
const WalletContext = createContext(null)

export const WalletProvider = ({ children }) => {
  const [wcSession, setWcSession] = useState(null)
  const [address, setAddress] = useState(null)
  const [publicKey, setPublicKey] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [stxBalance, setStxBalance] = useState(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [wcUri, setWcUri] = useState(null)

  const withTimeout = useCallback((promise, ms, message) => {
    let timeoutId
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(message || 'Timed out')), ms)
    })
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId))
  }, [])

  // Fetch STX balance from Stacks API
  const fetchBalance = useCallback(async () => {
    if (!address) {
      setStxBalance(null)
      return
    }

    try {
      setBalanceLoading(true)
      const response = await fetch(`${STACKS_API}/extended/v1/address/${address}/balances`)
      const data = await response.json()
      
      if (data.stx) {
        // Convert from micro-STX to STX
        const balanceInSTX = parseInt(data.stx.balance) / 1000000
        setStxBalance(balanceInSTX)
      }
    } catch (error) {
      console.error('Error fetching STX balance:', error)
      setStxBalance(null)
    } finally {
      setBalanceLoading(false)
    }
  }, [address])

  // Initialize (NO auto-connect)
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Fetch balance when address changes
  useEffect(() => {
    if (address) {
      fetchBalance()
      // Refresh balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [address, fetchBalance])

  // Connect wallet using WalletConnect (Reown)
  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    let unsubscribe = () => {}
    try {
      unsubscribe = await wcOnDisplayUri((uri) => setWcUri(uri))
      const { session } = await wcConnect()
      setWcSession(session)

      // Close the pairing UI as soon as the session is established.
      // Address discovery can take a moment, but users shouldn't keep seeing the raw `wc:` URI.
      setWcUri(null)

      // Per WalletConnect Stacks spec: request addresses via JSON-RPC
      let stxAddress = null
      let stxPublicKey = null
      try {
        const addresses = await withTimeout(wcGetAddresses(), 15000, 'stx_getAddresses timed out')
        const stx = addresses?.find?.((a) => a?.symbol === 'STX') || addresses?.[0]
        stxAddress = stx?.address || null
        stxPublicKey = stx?.publicKey || null
      } catch (e) {
        // Some wallets may not respond to stx_getAddresses quickly (or at all).
        // Fall back to the session account so the UI can still show as connected.
        console.warn('WalletConnect stx_getAddresses failed:', e)
        stxAddress = getStacksAddressFromSession(session)
      }

      setAddress(stxAddress)
      setPublicKey(stxPublicKey)
      return session
    } catch (error) {
      console.error('WalletConnect connect error:', error)
      return null
    } finally {
      unsubscribe()
      setIsConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await wcDisconnect()
    } catch (error) {
      console.error('WalletConnect disconnect error:', error)
    } finally {
      setWcSession(null)
      setAddress(null)
      setPublicKey(null)
      setStxBalance(null)
      setWcUri(null)
    }
  }, [])

  // Check if connected
  const isConnected = !!address

  // Context value
  const value = {
    // State
    wcSession,
    isConnected,
    isConnecting,
    isInitialized,
    
    // Balance
    stxBalance,
    balanceLoading,
    refetchBalance: fetchBalance,

    // WalletConnect pairing
    wcUri,
  // wcSession is already included above
    
    // Derived values
    address,
    publicKey,
    
    // Actions
    connectWallet,
    disconnectWallet,
    
    // Network & Contract info
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
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
