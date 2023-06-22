import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { ProjectInfo } from '../../Layout'
import LiveCursors from './LiveCursors'

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Live Cursors',
      repoNameAndPath: 'realtime-examples/tree/main/src/components/LiveCursors',
      topic: 'live-cursors',
    })
  }, [])

  return <LiveCursors />
}

export default Project
