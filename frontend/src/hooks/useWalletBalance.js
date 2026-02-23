import { useState, useEffect } from 'react'
import { getBalance } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const useWalletBalance = (address, network = 'mainnet') => {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const networkObj = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet()

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
  }, [address, network])

  return { balance, loading, error }
}

export default useWalletBalance
