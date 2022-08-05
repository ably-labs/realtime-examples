import { useState, useEffect, useRef, FunctionComponent } from 'react'
import dayjs from 'dayjs'
import type { Types } from 'ably'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useOutletContext } from 'react-router-dom'
import { usePresence, useChannel } from '@ably-labs/react-hooks'

import type { ProjectInfo } from '../../Layout'
import { fakeNames, colours } from './utils/fakeData'
import { UserCircleIcon } from '@heroicons/react/solid'

dayjs.extend(relativeTime)

const UserInfo: FunctionComponent<{ user: Types.PresenceMessage }> = ({
  user,
}) => {
  return (
    <>
      <p className="font-semibold">{user.data.name}</p>
      <div className="flex items-center justify-start">
        <div
          className={`${
            user.action === 'leave' ? 'bg-slate-500' : 'bg-green-500'
          } w-2 h-2 rounded-full mr-2`}
        />
        <p className="font-medium text-sm">
          {user.action === 'leave' ? dayjs().to(user.timestamp) : 'Online now'}
        </p>
      </div>
    </>
  )
}
const AvatarStack = () => {
  const [pastUsers, setPastUsers] = useState<Types.PresenceMessage[]>([])
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null)
  const { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  const listRef = useRef<HTMLDivElement>(null)
  const plusButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setProjectInfo({
      name: 'Avatar Stack',
      repoNameAndPath: 'atomic-examples/tree/main/src/components/AvatarStack',
    })
  }, [])

  // Click outside handler
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !listRef.current ||
        listRef.current.contains(event.target as Node) ||
        !plusButtonRef.current ||
        plusButtonRef.current.contains(event.target as Node)
      ) {
        return
      }

      setShowList(false)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [listRef, plusButtonRef])

  const [showList, setShowList] = useState(false)

  const [presenceUsers] = usePresence(channelName, {
    name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
  })

  const [channel] = useChannel(channelName, () => {})

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

  useEffect(() => {
    if (pastUsers.length > 0) {
      setTimeout(() => {
        channel.presence.history((err, result) => {
          const leftUsers = result?.items.filter(
            (user) =>
              user.action === 'leave' &&
              Math.floor((Date.now() - user.timestamp) / 1000) > 120_000
          )

          setPastUsers(leftUsers || [])
        })
      }, 125_000)
    }
  }, [pastUsers.length])

  const MAX_USERS_BEFORE_LIST = 5

  const otherUsers = [
    ...presenceUsers.filter(
      (presenceUser) => presenceUser.clientId !== clientId
    ),
    ...pastUsers,
  ]

  return (
    <div className="w-screen flex justify-between px-6 md:max-w-lg md:-mt-32">
      <div className="group relative flex flex-col items-center group">
        <UserCircleIcon className="absolute mt-2 h-8 w-8 opacity-80 stroke-white fill-transparent" />
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 
                h-12 w-12 rounded-full mb-2"
        ></div>
        <div className="absolute top-14 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
          You
        </div>
      </div>
      <div className="relative">
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
                <UserCircleIcon className="absolute mt-2 h-8 w-8 opacity-80 stroke-white fill-transparent" />
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
        {otherUsers.length > MAX_USERS_BEFORE_LIST ? (
          <div className="absolute right-0 z-50">
            <div
              className="flex justify-center items-center absolute right-0 text-white bg-gradient-to-r from-gray-500 to-slate-500 
                    h-12 w-12 rounded-full mb-2 select-none shadow-[0_0_0_4px_rgba(255,255,255,1)]"
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
