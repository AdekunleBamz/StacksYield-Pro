/**
 * Custom hook for reading from Stacks smart contracts
 * Uses @stacks/transactions for contract calls
 */
import { useState, useEffect, useMemo } from 'react'
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const useContractRead = (contractAddress, contractName, functionName, functionArgs = [], network = 'mainnet') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizedNetwork = String(network || 'mainnet').trim().toLowerCase()
  const networkObj = useMemo(
    () => (normalizedNetwork === 'mainnet' ? new StacksMainnet() : new StacksTestnet()),
    [normalizedNetwork]
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await callReadOnlyFunction({
          contractAddress,
          contractName,
          functionName,
          functionArgs,
          network: networkObj
        })
        setData(cvToJSON(result))
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (contractAddress && functionName) {
      fetchData()
    }
  }, [contractAddress, contractName, functionName, JSON.stringify(functionArgs), networkObj])

  return { data, loading, error, refetch: () => {
    setLoading(true)
    callReadOnlyFunction({ contractAddress, contractName, functionName, functionArgs, network: networkObj })
      .then(result => { setData(cvToJSON(result)); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }}
}

export default useContractRead
