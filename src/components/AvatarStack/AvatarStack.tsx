import { useEffect, useMemo, useState } from 'react'
import Avatars, { SelfAvatar } from './Avatars'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Surplus from './Surplus'
import { mockNames } from '../commonUtils/mockNames'
import useSpaces from '../commonUtils/useSpaces'
import { SpaceMember } from '@ably-labs/spaces'

dayjs.extend(relativeTime)

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)]

const AvatarStack = () => {
  const [members, setMembers] = useState<SpaceMember[]>([])
  const name = useMemo(mockName, [])

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces('avatar-stack', { name })

  useEffect(() => {
    if (!space) return

    /** 💡 Listen to space members entering and leaving 💡 */
    space.on('membersUpdate', (members: SpaceMember[]) => {
      const self = space.getSelf()
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
    <div className="w-screen flex justify-between px-6 md:max-w-lg md:-mt-32">
      {/** 💡 Avatar for yourself 💡 */}
      <SelfAvatar />

      <div className="relative">
        {/** 💡 Stack of first 5 user avatars.💡 */}
        <Avatars otherUsers={members} />

        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus otherUsers={members} />
      </div>
    </div>
  )
}
export default AvatarStack
