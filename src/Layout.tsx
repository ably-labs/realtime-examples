import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import { configureAbly } from '@ably-labs/react-hooks'
import InfoCard from './InfoCard'
import { viewRepoAtGithub, viewAllExamples, openNewWindow } from './gtm'

const clientId = nanoid()

import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: 'GTM-TZ37KKW',
  dataLayer: {
    page: 'InfoCard Component',
  },
}

TagManager.initialize(tagManagerArgs)

configureAbly({ key: import.meta.env.VITE_ABLY_KEY, clientId })

export type ProjectInfo = {
  name: string
  repoNameAndPath: string
  topic: string
}

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Atomic Example',
    repoNameAndPath: 'atomic-examples',
    topic: 'atomic-examples',
  })

  const channelId =
    searchParams.get('id') || randomWords({ exactly: 3, join: '-' })

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: channelId }, { replace: true })
    }
  }, [channelId])

  return (
    <main className="h-screen flex pt-6 md:pt-0 md:items-center justify-center font-sans bg-slate-100">
      <Outlet context={{ channelName: channelId, clientId, setProjectInfo }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard
          projectInfo={projectInfo}
          openNewTabTrackerEvent={() => openNewWindow(projectInfo.name)}
          githubRepoLinkTrackerEvent={() => viewRepoAtGithub(projectInfo.name)}
          allExamplesLinkTrackerEvent={() => viewAllExamples(projectInfo.name)}
        />
      </div>
    </main>
  )
}

export default Layout
