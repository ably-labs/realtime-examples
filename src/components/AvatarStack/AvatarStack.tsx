import Spaces, { SpaceMember } from '@ably-labs/spaces'
import { configureAbly } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import Avatars, { SelfAvatar } from './Avatars'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Surplus from './Surplus'
import { fakeNames } from './utils/fakeData'

dayjs.extend(relativeTime)

/** 💡 Select a fake name to assign randomly to a new user that enters the space💡 */
const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]

/** 💡 Set the Ably API key 💡 */
let ABLY_API_KEY =
  import.meta.env.VITE_ABLY_KEY_AVATAR_STACK || import.meta.env.VITE_ABLY_KEY

const initializeSpace = async (clientId: string, setMembers: any) => {
  /** Pass the API key to the Ably client */
  const client = configureAbly({ key: ABLY_API_KEY, clientId })

  /** 💡 Instantiate the Collaborative Spaces SDK: https://github.com/ably-labs/spaces 💡 */
  const spaces = new Spaces(client)

  /** 💡 Create a new space 💡 */
  const space = await spaces.get('avatar-stack')

  /** 💡 Register a listener to subscribe to events of when users (including yourself) enter or leave the space 💡 */
  space.on('membersUpdate', (members: SpaceMember[]) => {
    const self = space.getSelf()
    const others = members.filter(
      (member) => member.connectionId !== self?.connectionId
    )
    setMembers(others)
  })

  /** 💡 Enter a space & assign a fake name. This is stored under `profileData` object. 💡 */
  space.enter({ name: fakeName() })
}

const AvatarStack = ({ clientId }: { clientId: string }) => {
  const [members, setMembers] = useState([])
  useEffect(() => {
    initializeSpace(clientId, setMembers)
  }, [clientId])

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
