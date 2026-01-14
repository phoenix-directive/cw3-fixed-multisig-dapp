import { ReactNode } from 'react'
import { useSigningClient } from 'contexts/cosmwasm'
import Loader from './Loader'

function WalletLoader({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  const {
    walletAddress,
    loading: clientLoading,
    error,
    connectWallet,
  } = useSigningClient()

  if (loading || clientLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )
  }

  if (walletAddress === '') {
    return (
      <div className="max-w-full flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-foreground">
          Welcome to {import.meta.env.VITE_SITE_TITLE || 'CW3 Multisig'}!
        </h1>

        <p className="mt-3 text-2xl text-muted-foreground">
          Get started by installing{' '}
          <a
            className="pl-1 text-primary hover:underline"
            href="https://keplr.app/"
          >
            Keplr wallet
          </a>
        </p>

        <div className="flex flex-wrap items-center justify-around md:max-w-4xl mt-6 sm:w-full">
          <button
            className="p-6 mt-6 text-left border-2 border-border bg-card hover:border-primary w-96 rounded-xl hover:shadow-lg transition-all group"
            onClick={connectWallet}
          >
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
              Connect your wallet &rarr;
            </h3>
            <p className="mt-4 text-xl text-muted-foreground">
              Create and manage your multsig by connecting your Keplr wallet.
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>
  }

  return <>{children}</>
}

export default WalletLoader
