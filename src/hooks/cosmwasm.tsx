import { useState, useEffect } from 'react'
import { connectKeplr } from 'services/keplr'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'

export interface ISigningCosmWasmClientContext {
  walletAddress: string
  signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: Error | null
  connectWallet: any
  disconnect: Function
}

const PUBLIC_RPC_ENDPOINT = import.meta.env.VITE_CHAIN_RPC_ENDPOINT
const PUBLIC_CHAIN_ID = import.meta.env.VITE_CHAIN_ID

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [walletAddress, setWalletAddress] = useState('')
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Auto-reconnect on mount if wallet was previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected')
    if (wasConnected === 'true') {
      connectWallet()
    }
  }, [])

  const connectWallet = async () => {
    setLoading(true)

    try {
      // Validate environment variables
      if (!PUBLIC_RPC_ENDPOINT) {
        throw new Error('VITE_CHAIN_RPC_ENDPOINT is not configured')
      }
      if (!PUBLIC_CHAIN_ID) {
        throw new Error('VITE_CHAIN_ID is not configured')
      }

      await connectKeplr()

      // enable website to access kepler
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window as any).keplr.getOfflineSigner(
        PUBLIC_CHAIN_ID
      )

      // make client
      const client = await SigningCosmWasmClient.connectWithSigner(
        PUBLIC_RPC_ENDPOINT,
        offlineSigner,

        {
          gasPrice: GasPrice.fromString('0.015uluna'),
        }
      )
      setSigningClient(client)

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      setWalletAddress(address)
      
      // Remember wallet connection
      localStorage.setItem('walletConnected', 'true')

      setLoading(false)
    } catch (error) {
      console.error('Wallet connection error:', error)
      setError(error as Error)
      setLoading(false)
      // Clear connection flag on error
      localStorage.removeItem('walletConnected')
    }
  }

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect()
    }
    setWalletAddress('')
    setSigningClient(null)
    setLoading(false)
    // Clear wallet connection from localStorage
    localStorage.removeItem('walletConnected')
  }

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
  }
}
