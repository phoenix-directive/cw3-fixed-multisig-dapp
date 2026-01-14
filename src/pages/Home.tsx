import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WalletLoader from 'components/WalletLoader'

const Home = () => {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')

  return (
    <WalletLoader>
      <div className="flex flex-col w-full">
        <div className="grid place-items-center">
          <h1 className="text-4xl font-bold mb-8 text-foreground">
            Existing...
          </h1>
          <div className="flex w-full max-w-xl xl:max-w-2xl">
            <div className="relative rounded-full shadow-lg w-full">
              <input
                id="multisig-address"
                className="w-full pr-24 py-4 px-6 rounded-full text-center font-mono text-lg bg-card border-2 border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                className="absolute top-0 right-0 bottom-0 px-8 py-5 rounded-r-full bg-primary text-primary-foreground text-xl font-semibold hover:bg-primary/90 transition-colors"
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
        <div className="relative flex items-center py-8 my-8">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold my-8 text-foreground">New...</h1>
          <div className="w-full max-w-xl xl:max-w-2xl">
            <button
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 text-2xl rounded-full w-full shadow-lg hover:shadow-xl transition-all"
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
