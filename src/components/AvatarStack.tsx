import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usePresence } from '@ably-labs/react-hooks'

import { fakeNames } from './fakeData'

const colours = [
  'from-orange-400 to-orange-500',
  'from-pink-400 to-pink-500',
  'from-green-400 to-green-500',
  'from-violet-400 to-violet-500',
  'from-rose-400 to-rose-500',
  'from-lime-400 to-lime-500',
]

const AvatarStack = () => {
  const { channelName, clientId } = useOutletContext<{
    channelName: string
    clientId: string
  }>()

  const listRef = useRef<HTMLDivElement>(null)
  const plusButtonRef = useRef<HTMLDivElement>(null)

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

  const [yourUser, ...currentUsers] = presenceUsers

  const MAX_USERS_BEFORE_LIST = 5

  const otherUsers = presenceUsers.filter(
    (presenceUser) => presenceUser.clientId !== clientId
  )

  return (
    <div className="w-screen flex justify-between px-6 md:max-w-lg md:-mt-32">
      <div className="group relative flex flex-col items-center group">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 
                h-12 w-12 rounded-full mb-2"
        ></div>
        <div className="absolute top-14 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
          You
        </div>
      </div>
      <div className="relative">
        {otherUsers.slice(0, MAX_USERS_BEFORE_LIST).map((user, index) => {
          const HORIZONTAL_SPACING_OFFSET = 40
          const rightOffset =
            otherUsers.length > MAX_USERS_BEFORE_LIST
              ? (index + 1) * HORIZONTAL_SPACING_OFFSET
              : index * HORIZONTAL_SPACING_OFFSET
          return (
            <div
              className="group absolute right-0 flex flex-col items-center group"
              key={user.clientId}
              style={{
                right: rightOffset,
                zIndex: otherUsers.length - index,
              }}
            >
              <div
                className={`bg-gradient-to-l ${colours[index]} 
                h-12 w-12 rounded-full mb-2 shadow-[0_0_0_4px_rgba(255,255,255,1)]`}
              ></div>
              <div className="absolute top-14 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
                {user.data.name}
              </div>
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
                    <p className="font-semibold">{user.data.name}</p>
                    <div className="flex items-center justify-start">
                      <div className="bg-green-500 w-2 h-2 rounded-full mr-2" />
                      <p className="font-medium text-sm">Online now</p>
                    </div>
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
