import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import { configureAbly } from '@ably-labs/react-hooks'
import InfoCard from './InfoCard'

const clientId = nanoid()
const example: string = window.location.pathname
let API_KEY: string | undefined

switch (example) {
  case '/avatar-stack':
    API_KEY = import.meta.env.VITE_ABLY_KEY_AVATAR_STACK
    break

  case '/emoji-reactions':
    API_KEY = import.meta.env.VITE_ABLY_KEY_EMOJI_REACTIONS
    break

  default:
    API_KEY = import.meta.env.VITE_ABLY_KEY
}

configureAbly({ key: API_KEY || import.meta.env.VITE_ABLY_KEY, clientId })

export type ProjectInfo = {
  name: string
  repoNameAndPath: string
  topic: string
}

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Realtime Examples',
    repoNameAndPath: 'realtime-examples',
    topic: 'realtime-examples',
  })

  const channelId =
    searchParams.get('id') || randomWords({ exactly: 3, join: '-' })

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: channelId }, { replace: true })
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
