import { ReactNode, useEffect } from 'react'
import Nav from './Nav'

const PUBLIC_SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'CW3 Multisig'

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.title = PUBLIC_SITE_TITLE
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <Nav />
      <main className="flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center">
        {children}
      </main>
    </div>
  )
}
