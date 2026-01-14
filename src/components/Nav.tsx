import { useSigningClient } from 'contexts/cosmwasm'
import { Link } from 'react-router-dom'
import ThemeToggle from 'components/ThemeToggle'
import NavContractLabel from 'components/NavContractLabel'

function Nav() {
  const { walletAddress, connectWallet, disconnect } = useSigningClient()
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
    }
  }

  const PUBLIC_SITE_ICON_URL = import.meta.env.VITE_SITE_ICON_URL || ''
  const PUBLIC_SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'CW3 Multisig'

  return (
    <div className="border-b border-border w-screen px-4 md:px-8 bg-card">
      <nav className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-3 gap-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            {PUBLIC_SITE_ICON_URL.length > 0 ? (
              <img
                src={PUBLIC_SITE_ICON_URL}
                height={28}
                width={28}
                alt={`${PUBLIC_SITE_TITLE} Logo`}
              />
            ) : (
              <span className="text-xl">⚛️</span>
            )}
          </Link>
          <Link
            to="/"
            className="hover:text-primary transition-colors font-semibold text-lg md:text-xl"
          >
            {PUBLIC_SITE_TITLE}
          </Link>
        </div>
        <NavContractLabel />
        <ThemeToggle />
        <div className="flex flex-grow md:flex-grow-0 max-w-full">
          <button
            className={`px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium text-sm w-full max-w-full truncate ${
              walletAddress.length > 0 ? 'lowercase' : ''
            }`}
            onClick={handleConnect}
          >
            {walletAddress || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
