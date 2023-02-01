import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { Types } from 'ably'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useOutletContext } from 'react-router-dom'
import { usePresence, useChannel } from '@ably-labs/react-hooks'

import type { ProjectInfo } from '../../Layout'
import { fakeNames, colours } from './utils/fakeData'
import { UserCircleIcon } from '@heroicons/react/outline'

import UserInfo from './UserInfo'
import useClickOutsideList from './useClickOutsideList'

dayjs.extend(relativeTime)

const REMOVE_USER_AFTER_MILLIS = 120_000
const MAX_USERS_BEFORE_LIST = 5

const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]

const AvatarStack = () => {
  const { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Avatar Stack',
      repoNameAndPath: 'realtime-examples/tree/main/src/components/AvatarStack',
      topic: 'avatar-stack',
    })
  }, [])

  const [pastUsers, setPastUsers] = useState<Types.PresenceMessage[]>([])
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null)
  const [showList, setShowList] = useState(false)
  const { listRef, plusButtonRef } = useClickOutsideList(() =>
    setShowList(false)
  )

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
      {/** 💡 "You" avatar💡 */}
      <div className="group relative flex flex-col items-center group">
        <UserCircleIcon className="absolute mt-2 h-8 w-8 opacity-80 text-white pointer-events-none" />
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500
                h-12 w-12 rounded-full mb-2"
        ></div>
        <div className="absolute top-14 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
          You
        </div>
      </div>
      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        {otherUsers
          .slice(0, MAX_USERS_BEFORE_LIST)
          .reverse()
          .map((user, index) => {
            const HORIZONTAL_SPACING_OFFSET = 40
            const rightOffset =
              otherUsers.length > MAX_USERS_BEFORE_LIST
                ? (index + 1) * HORIZONTAL_SPACING_OFFSET
                : index * HORIZONTAL_SPACING_OFFSET
            return (
              <div
                className="absolute right-0 flex flex-col items-center"
                key={user.clientId}
                style={{
                  right: rightOffset,
                  zIndex: otherUsers.length - index,
                }}
              >
                <UserCircleIcon className="absolute mt-2 h-8 w-8 opacity-80 stroke-white fill-transparent pointer-events-none" />
                <div
                  className={`bg-gradient-to-l ${colours[index]} h-12 w-12 rounded-full mb-2 shadow-[0_0_0_4px_rgba(255,255,255,1)]`}
                  onMouseOver={() => setHoveredClientId(user.clientId)}
                  onMouseLeave={() => setHoveredClientId(null)}
                ></div>
                {user.action === 'leave' ? (
                  <div className="absolute top-0 h-12 w-12 rounded-full mb-2 bg-white opacity-80 pointer-events-none" />
                ) : null}
                {hoveredClientId === user.clientId ? (
                  <div className="absolute top-14 min-w-[175px] px-4 py-2 bg-black rounded-lg text-white">
                    <UserInfo user={user} />
                  </div>
                ) : null}
              </div>
            )
          })}

        {/** 💡 Dropdown list of surplus users 💡 */}
        {otherUsers.length > MAX_USERS_BEFORE_LIST ? (
          <div className="absolute right-0">
            <div
              className="flex justify-center items-center absolute right-0 text-white text-sm bg-gradient-to-r from-gray-500 to-slate-500
                    h-12 w-12 rounded-full mb-2 select-none shadow-[0_0_0_4px_rgba(255,255,255,1)]"
              style={{
                zIndex: otherUsers.length + 50,
              }}
              ref={plusButtonRef}
              onClick={() => {
                setShowList(!showList)
              }}
            >
              +{otherUsers.slice(MAX_USERS_BEFORE_LIST).length}
            </div>
            {showList ? (
              <div
                className="min-w-[225px] max-h-[250px] overflow-y-auto p-2 relative top-14 bg-slate-800 rounded-lg text-white"
                ref={listRef}
              >
                {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user) => (
                  <div
                    className="hover:bg-slate-700 hover:rounded-lg px-7 py-2"
                    key={user.clientId}
                  >
                    <UserInfo user={user} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default AvatarStack
