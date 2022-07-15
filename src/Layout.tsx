import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import InfoCard from './InfoCard'

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    const channelName = searchParams.get('id')
    if (!channelName) {
      setSearchParams({
        id: nanoid(),
      })
    }
  }, [])

  return (
    <main className="h-screen flex items-center justify-center font-sans">
      <Outlet context={{ channelName: searchParams.get('id') }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard />
      </div>
    </main>
  )
}

export default Layout
