import { useState } from 'react'
import { Types } from 'ably'
import { UserCircleIcon } from '@heroicons/react/outline'

import { colours } from './utils/fakeData'
import { MAX_USERS_BEFORE_LIST } from './utils/constants'

import UserInfo from './UserInfo'

const YouAvatar = () => (
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
)

const Avatars = ({ otherUsers }: { otherUsers: Types.PresenceMessage[] }) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null)

  return (
    <>
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
    </>
  )
}

export { YouAvatar }
export default Avatars
