import Spaces, { SpaceMember } from '@ably-labs/spaces'
import { configureAbly } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import Avatars, { SelfAvatar } from './Avatars'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Surplus from './Surplus'
import { fakeNames } from './utils/fakeData'

dayjs.extend(relativeTime)
const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]

let ABLY_API_KEY =
  import.meta.env.VITE_ABLY_KEY_AVATAR_STACK || import.meta.env.VITE_ABLY_KEY

const initializeSpace = async (clientId: string, setMembers: any) => {
  const client = configureAbly({ key: ABLY_API_KEY, clientId })
  const spaces = new Spaces(client)

  const space = await spaces.get('avatar-stack')

  space.on('membersUpdate', (members: SpaceMember[]) => {
    const self = space.getSelf()
    const others = members.filter(
      (member) => member.connectionId !== self?.connectionId
    )
    setMembers(others)
  })

  space.enter({ name: fakeName() })
}

const AvatarStack = ({ clientId }: { clientId: string }) => {
  const [members, setMembers] = useState([])
  useEffect(() => {
    initializeSpace(clientId, setMembers)
  }, [clientId])

  return (
    <div className="w-screen flex justify-between px-6 md:max-w-lg md:-mt-32">
      {/** 💡 "You" avatar 💡 */}
      <SelfAvatar />

      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        <Avatars otherUsers={members} />

        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus otherUsers={members} />
      </div>
    </div>
  )
}
export default AvatarStack
