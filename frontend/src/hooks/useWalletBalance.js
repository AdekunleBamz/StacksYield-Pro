import { useState, useEffect, useMemo } from 'react'
import { getBalance } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const useWalletBalance = (address, network = 'mainnet') => {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizedNetwork = String(network || 'mainnet').trim().toLowerCase()
  const networkObj = useMemo(
    () => (normalizedNetwork === 'mainnet' ? new StacksMainnet() : new StacksTestnet()),
    [normalizedNetwork]
  )

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return
      try {
        setLoading(true)
        const bal = await getBalance(address, networkObj)
        setBalance(bal)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [address, networkObj])

  return { balance, loading, error }
}

export default useWalletBalance
