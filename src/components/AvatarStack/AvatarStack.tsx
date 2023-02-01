import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { Types } from 'ably'
import relativeTime from 'dayjs/plugin/relativeTime'
import { usePresence, useChannel } from '@ably-labs/react-hooks'

import { fakeNames } from './utils/fakeData'

import { REMOVE_USER_AFTER_MILLIS } from './utils/constants'
import Avatars, { YouAvatar } from './Avatars'
import Surplus from './Surplus'

dayjs.extend(relativeTime)

const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]

const AvatarStack = ({
  channelName,
  clientId,
}: {
  channelName: string
  clientId: string
}) => {
  const [pastUsers, setPastUsers] = useState<Types.PresenceMessage[]>([])

  // 💡 Connect current user to Ably Presence with a random fake name
  const [presenceUsers] = usePresence(channelName, {
    name: fakeName(),
  })

  // 💡 This is used to access Ably's `channel.presence.history`
  const [channel] = useChannel(channelName, () => {})

  // 💡 Effect to set past users from the Ably presence history
  useEffect(() => {
    if (presenceUsers.length >= 1) {
      channel.presence.history((err, result) => {
        const pastUsers = result?.items.filter(
          (resultItem) => resultItem.action === 'leave'
        )

        setPastUsers(pastUsers || [])
      })
    }
  }, [presenceUsers])

  // 💡 Effect to remove users who have left more than 2 minutes ago using the Ably presence history
  useEffect(() => {
    if (pastUsers.length > 0) {
      setTimeout(() => {
        channel.presence.history((err, result) => {
          const leftUsers = result?.items.filter(
            (user) =>
              user.action === 'leave' &&
              Math.floor((Date.now() - user.timestamp) / 1000) >
                REMOVE_USER_AFTER_MILLIS
          )

          setPastUsers(leftUsers || [])
        })
      }, REMOVE_USER_AFTER_MILLIS + 5000)
    }
  }, [pastUsers.length])

  const otherUsers = [
    ...presenceUsers.filter(
      (presenceUser) => presenceUser.clientId !== clientId
    ),
    ...pastUsers,
  ].filter((val, index, arr) => arr.indexOf(val) === index)

  return (
    <div className="w-screen flex justify-between px-6 md:max-w-lg md:-mt-32">
      {/** 💡 "You" avatar 💡 */}
      <YouAvatar />

      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        <Avatars otherUsers={otherUsers} />

        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus otherUsers={otherUsers} />
      </div>
    </div>
  )
}
export default AvatarStack
