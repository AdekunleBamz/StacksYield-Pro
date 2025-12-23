import { useState, useEffect, useCallback } from 'react'
import { 
  callReadOnlyFunction, 
  cvToJSON, 
  uintCV,
  standardPrincipalCV
} from '@stacks/transactions'
import { CONTRACT_ADDRESS, CONTRACT_NAME, network } from '../context/WalletContext'

// Fetch vault data from contract
export const useVault = (vaultId) => {
  const [vault, setVault] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVault = async () => {
      try {
        setLoading(true)
        const result = await callReadOnlyFunction({
          network,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-vault',
          functionArgs: [uintCV(vaultId)],
          senderAddress: CONTRACT_ADDRESS
        })
        
        const jsonResult = cvToJSON(result)
        if (jsonResult.value) {
          setVault({
            id: vaultId,
            name: jsonResult.value.value.name.value,
            strategy: parseInt(jsonResult.value.value.strategy.value),
            totalDeposits: parseInt(jsonResult.value.value['total-deposits'].value) / 1000000,
            totalShares: parseInt(jsonResult.value.value['total-shares'].value),
            apy: parseInt(jsonResult.value.value.apy.value) / 100,
            minDeposit: parseInt(jsonResult.value.value['min-deposit'].value) / 1000000,
            lockPeriod: parseInt(jsonResult.value.value['lock-period'].value),
            isActive: jsonResult.value.value['is-active'].value,
            createdAt: parseInt(jsonResult.value.value['created-at'].value)
          })
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching vault:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (vaultId) {
      fetchVault()
    }
  }, [vaultId])

  return { vault, loading, error }
}

// Fetch all vaults
export const useVaults = () => {
  const [vaults, setVaults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVaults = useCallback(async () => {
    try {
      setLoading(true)
      const vaultData = []
      
      // Fetch vaults 1-3 (default vaults)
      for (let i = 1; i <= 3; i++) {
        try {
          const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-vault',
            functionArgs: [uintCV(i)],
            senderAddress: CONTRACT_ADDRESS
          })
          
          const jsonResult = cvToJSON(result)
          if (jsonResult.value) {
            vaultData.push({
              id: i,
              name: jsonResult.value.value.name.value,
              strategy: parseInt(jsonResult.value.value.strategy.value),
              totalDeposits: parseInt(jsonResult.value.value['total-deposits'].value) / 1000000,
              totalShares: parseInt(jsonResult.value.value['total-shares'].value),
              apy: parseInt(jsonResult.value.value.apy.value) / 100,
              minDeposit: parseInt(jsonResult.value.value['min-deposit'].value) / 1000000,
              lockPeriod: parseInt(jsonResult.value.value['lock-period'].value),
              isActive: jsonResult.value.value['is-active'].value,
              createdAt: parseInt(jsonResult.value.value['created-at'].value)
            })
          }
        } catch (err) {
          console.log(`Vault ${i} not found or not initialized`)
        }
      }
      
      setVaults(vaultData)
      setError(null)
    } catch (err) {
      console.error('Error fetching vaults:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVaults()
  }, [fetchVaults])

  return { vaults, loading, error, refetch: fetchVaults }
}

// Fetch user deposit for a specific vault
export const useUserDeposit = (userAddress, vaultId) => {
  const [deposit, setDeposit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDeposit = async () => {
      if (!userAddress || !vaultId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await callReadOnlyFunction({
          network,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-user-deposit',
          functionArgs: [standardPrincipalCV(userAddress), uintCV(vaultId)],
          senderAddress: CONTRACT_ADDRESS
        })
        
        const jsonResult = cvToJSON(result)
        if (jsonResult.value) {
          setDeposit({
            shares: parseInt(jsonResult.value.value.shares.value),
            depositAmount: parseInt(jsonResult.value.value['deposit-amount'].value) / 1000000,
            depositTime: parseInt(jsonResult.value.value['deposit-time'].value),
            lastCompound: parseInt(jsonResult.value.value['last-compound'].value),
            pendingRewards: parseInt(jsonResult.value.value['pending-rewards'].value) / 1000000
          })
        } else {
          setDeposit(null)
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching user deposit:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDeposit()
  }, [userAddress, vaultId])

  return { deposit, loading, error }
}

// Fetch user stats
export const useUserStats = (userAddress) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!userAddress) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const result = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-user-stats',
        functionArgs: [standardPrincipalCV(userAddress)],
        senderAddress: CONTRACT_ADDRESS
      })
      
      const jsonResult = cvToJSON(result)
      setStats({
        totalDeposited: parseInt(jsonResult.value['total-deposited'].value) / 1000000,
        totalWithdrawn: parseInt(jsonResult.value['total-withdrawn'].value) / 1000000,
        totalRewards: parseInt(jsonResult.value['total-rewards'].value) / 1000000,
        referralEarnings: parseInt(jsonResult.value['referral-earnings'].value) / 1000000,
        referrer: jsonResult.value.referrer.value,
        referralCount: parseInt(jsonResult.value['referral-count'].value),
        isRegistered: jsonResult.value['is-registered'].value
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userAddress])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Fetch protocol stats
export const useProtocolStats = () => {
  const [stats, setStats] = useState({
    tvl: 0,
    users: 0,
    fees: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch TVL
      const tvlResult = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-tvl',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS
      })
      
      // Fetch total users
      const usersResult = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-users',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS
      })
      
      // Fetch total fees
      const feesResult = await callReadOnlyFunction({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-total-fees',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS
      })
      
      setStats({
        tvl: parseInt(cvToJSON(tvlResult).value) / 1000000,
        users: parseInt(cvToJSON(usersResult).value),
        fees: parseInt(cvToJSON(feesResult).value) / 1000000
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching protocol stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Calculate pending rewards
export const usePendingRewards = (userAddress, vaultId) => {
  const [rewards, setRewards] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRewards = async () => {
      if (!userAddress || !vaultId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await callReadOnlyFunction({
          network,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'calculate-pending-rewards',
          functionArgs: [standardPrincipalCV(userAddress), uintCV(vaultId)],
          senderAddress: CONTRACT_ADDRESS
        })
        
        const jsonResult = cvToJSON(result)
        setRewards(parseInt(jsonResult.value) / 1000000)
      } catch (err) {
        console.error('Error fetching pending rewards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [userAddress, vaultId])

  return { rewards, loading }
}

export { CONTRACT_ADDRESS, CONTRACT_NAME, network }
