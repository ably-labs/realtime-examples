import { useEffect, useMemo, useState } from 'react'
import { mockNames } from '../commonUtils/mockNames'
import { colours } from './utils/mockData'
import useSpaces from '../commonUtils/useSpaces'
import { MemberCursors, YourCursor } from './Cursors'
import { SpaceMember } from '@ably-labs/spaces'

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)]

const LiveCursors = () => {
  const [members, setMembers] = useState<SpaceMember[]>([])
  const name = useMemo(mockName, [])
  /** 💡 Select a color to assign randomly to a new user that enters the space💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    []
  )
  const [self, setSelf] = useState<SpaceMember | undefined>(undefined)

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces('live-cursors', { name, userColors })

  useEffect(() => {
    if (!space) return
    /** 💡 Listen to space members entering and leaving 💡 */
    space.on('membersUpdate', (members: SpaceMember[]) => {
      const self = space.getSelf()
      setSelf(self)

      const others = members.filter(
        (member) => member.connectionId !== self?.connectionId
      )
      setMembers(others)
    })
    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.off()
    }
  }, [space])

  return (
    <div id="live-cursors" className="w-screen flex">
      <YourCursor user={self} space={space} />
      <MemberCursors
        otherUsers={members}
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  )
}

export default LiveCursors
