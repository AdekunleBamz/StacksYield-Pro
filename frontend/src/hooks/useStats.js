import { useState, useEffect } from 'react'
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions'
import { StacksMainnet } from '@stacks/network'

const useStats = (contractAddress, contractName) => {
  const [stats, setStats] = useState({
    totalValueLocked: 0,
    totalUsers: 0,
    totalDeposits: 0,
    apy: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const network = new StacksMainnet()
      
      const [tvl, users, deposits, apy] = await Promise.all([
        callReadOnlyFunction({ contractAddress, contractName, functionName: 'get-tvl', functionArgs: [], network }),
        callReadOnlyFunction({ contractAddress, contractName, functionName: 'get-total-users', functionArgs: [], network }),
        callReadOnlyFunction({ contractAddress, contractName, functionName: 'get-total-deposits', functionArgs: [], network }),
        callReadOnlyFunction({ contractAddress, contractName, functionName: 'get-apy', functionArgs: [], network })
      ])
      
      setStats({
        totalValueLocked: cvToJSON(tvl).value,
        totalUsers: cvToJSON(users).value,
        totalDeposits: cvToJSON(deposits).value,
        apy: cvToJSON(apy).value
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [contractAddress, contractName])

  return { stats, loading, error, refetch: fetchStats }
}

export default useStats
