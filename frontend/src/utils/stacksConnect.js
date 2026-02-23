/**
 * Stacks.js Integration Examples
 * 
 * This file demonstrates usage of @stacks/connect and @stacks/transactions
 * for wallet connection and smart contract interactions.
 */

import { connect } from '@stacks/connect'
import { StacksMainnet, StacksTestnet } from '@stacks/network'
import {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  someCV,
  noneCV,
  trueCV,
  falseCV
} from '@stacks/transactions'

// Network configuration
const getNetwork = (isMainnet = true) => {
  return isMainnet ? new StacksMainnet() : new StacksTestnet()
}

// App details for wallet connection
export const getAppDetails = (origin) => ({
  name: 'StacksYield Pro',
  icon: `${origin}/logo.svg`
})

/**
 * Connect to a Stacks wallet using @stacks/connect
 * @param {string} origin - The app origin
 * @param {boolean} isMainnet - Whether to use mainnet
 * @returns {Promise<Object>} - Authentication response
 */
export const connectWallet = async (origin, isMainnet = true) => {
  const network = getNetwork(isMainnet)
  const appDetails = getAppDetails(origin)
  
  const authOptions = {
    appDetails,
    network,
    onFinish: (data) => {
      // Store the auth response (contains wallet public key)
      localStorage.setItem('stx_auth', JSON.stringify(data))
      return data
    },
    onCancel: () => {
      throw new Error('User cancelled wallet connection')
    }
  }
  
  return connect(authOptions)
}

/**
 * Disconnect wallet (clear session)
 */
export const disconnectWallet = () => {
  localStorage.removeItem('stx_auth')
  localStorage.removeItem('stx_address')
}

/**
 * Make a deposit call to the StacksYield Pro contract
 * Using @stacks/transactions
 * 
 * @param {string} privateKey - Sender's private key
 * @param {number} amount - Amount in microSTX
 * @param {number} strategyId - 1=Conservative, 2=Balanced, 3=Aggressive
 * @param {string} contractAddress - Contract address
 * @param {string} contractName - Contract name
 * @param {boolean} isMainnet - Mainnet or testnet
 * @returns {Promise<string>} - Transaction ID
 */
export const deposit = async ({
  privateKey,
  amount,
  strategyId,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'deposit',
    functionArgs: [
      uintCV(amount),    // amount in microSTX
      uintCV(strategyId) // vault strategy
    ],
    senderKey: privateKey,
    network,
    postConditions: []
  })
  
  const result = await broadcastTransaction(tx, network)
  return result.txid
}

/**
 * Withdraw from vault
 * Using @stacks/transactions
 */
export const withdraw = async ({
  privateKey,
  amount,
  strategyId,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'withdraw',
    functionArgs: [
      uintCV(amount),
      uintCV(strategyId)
    ],
    senderKey: privateKey,
    network
  })
  
  return broadcastTransaction(tx, network)
}

/**
 * Register user with optional referral
 */
export const registerUser = async ({
  privateKey,
  referralCode = null,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const functionArgs = referralCode 
    ? [stringAsciiCV(referralCode)]
    : [noneCV()]
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'register-user',
    functionArgs,
    senderKey: privateKey,
    network
  })
  
  return broadcastTransaction(tx, network)
}

/**
 * Emergency withdraw (with penalty)
 */
export const emergencyWithdraw = async ({
  privateKey,
  strategyId,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'emergency-withdraw',
    functionArgs: [uintCV(strategyId)],
    senderKey: privateKey,
    network
  })
  
  return broadcastTransaction(tx, network)
}

/**
 * Create referral code
 */
export const createReferralCode = async ({
  privateKey,
  code,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'create-referral-code',
    functionArgs: [stringAsciiCV(code)],
    senderKey: privateKey,
    network
  })
  
  return broadcastTransaction(tx, network)
}

/**
 * Compound pending rewards
 */
export const compoundRewards = async ({
  privateKey,
  strategyId,
  contractAddress,
  contractName,
  isMainnet = true
}) => {
  const network = getNetwork(isMainnet)
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName: 'compound',
    functionArgs: [uintCV(strategyId)],
    senderKey: privateKey,
    network
  })
  
  return broadcastTransaction(tx, network)
}
