/**
 * Custom hook for reading from Stacks smart contracts
 * Uses @stacks/transactions for contract calls
 */
import { useState, useEffect } from 'react'
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const useContractRead = (contractAddress, contractName, functionName, functionArgs = [], network = 'mainnet') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const networkObj = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet()

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
  }, [contractAddress, contractName, functionName, JSON.stringify(functionArgs), network])

  return { data, loading, error, refetch: () => {
    setLoading(true)
    callReadOnlyFunction({ contractAddress, contractName, functionName, functionArgs, network: networkObj })
      .then(result => { setData(cvToJSON(result)); setError(null) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }}
}

export default useContractRead
