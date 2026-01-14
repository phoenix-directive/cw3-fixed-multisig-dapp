import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WalletLoader from 'components/WalletLoader'
import { getRecentMultisigs, type RecentMultisig } from 'util/recentMultisigs'
import { shortenAddress } from 'util/conversion'

const Home = () => {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [recents, setRecents] = useState<RecentMultisig[]>([])

  useEffect(() => {
    setRecents(getRecentMultisigs())
  }, [])

  return (
    <WalletLoader>
      <div className="flex flex-col w-full">
        {/* Recent Multisigs */}
        {recents.length > 0 && (
          <>
            <div className="grid place-items-center mb-6">
              <h1 className="text-4xl font-bold mb-6 text-foreground flex items-center gap-2">
                Recent
              </h1>
              <div className="w-full max-w-xl xl:max-w-2xl space-y-2">
                {recents.map((recent) => (
                  <button
                    key={recent.address}
                    onClick={() => navigate(`/${recent.address}`)}
                    className="w-full p-4 bg-card border border-border hover:border-primary rounded-lg transition-all text-left group hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {recent.name ? (
                          <>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {recent.name}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {shortenAddress(recent.address)}
                            </div>
                          </>
                        ) : (
                          <div className="font-mono text-foreground group-hover:text-primary transition-colors">
                            {shortenAddress(recent.address)}
                          </div>
                        )}
                      </div>
                      <div className="text-primary group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
          </>
        )}

        <div className="grid place-items-center mb-6">
          <h1 className="text-4xl font-bold mb-6 text-foreground">Existing</h1>
          <div className="flex w-full max-w-xl xl:max-w-2xl">
            <div className="relative rounded-lg w-full">
              <input
                id="multisig-address"
                className="w-full pr-24 py-3 px-4 rounded-lg text-center font-mono text-base bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Multisig contract address..."
                value={address}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    navigate(`/${event.currentTarget.value}`)
                  }
                }}
                onChange={(event) => setAddress(event.target.value)}
              />
              <button
                className="absolute top-0 right-0 bottom-0 px-6 py-3 rounded-r-lg bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors"
                onClick={() => {
                  const inputEl = document.getElementById(
                    'multisig-address'
                  ) as HTMLInputElement
                  navigate(`/${inputEl.value}`)
                }}
              >
                GO
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <div className="grid place-items-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground">New</h1>
          <div className="w-full max-w-xl xl:max-w-2xl">
            <button
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 text-lg rounded-lg w-full border border-primary hover:shadow-md transition-all"
              onClick={() => navigate('/create')}
            >
              + CREATE NEW MULTISIG
            </button>
          </div>
        </div>
      </div>
    </WalletLoader>
  )
}

export default Home
