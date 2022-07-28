import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { configureAbly } from '@ably-labs/react-hooks'
import InfoCard from './InfoCard'

const clientId = nanoid()

configureAbly({ key: import.meta.env.VITE_ABLY_KEY, clientId })

export type ProjectInfo = {
  name: string
  repoNameAndPath: string
}

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Atomic Example',
    repoNameAndPath: 'atomic-examples',
  })

  const channelId = searchParams.get('id') || nanoid()

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: channelId })
    }
  }, [channelId])

  return (
    <main className="h-screen flex pt-6 md:pt-0 md:items-center justify-center font-sans">
      <Outlet context={{ channelName: channelId, clientId, setProjectInfo }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard projectInfo={projectInfo} />
      </div>
    </main>
  )
}

export default Layout
