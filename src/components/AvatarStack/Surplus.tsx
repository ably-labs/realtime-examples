import { useState } from 'react'
import { Types } from 'ably'

import useClickOutsideList from './useClickOutsideList'
import { MAX_USERS_BEFORE_LIST } from './utils/constants'
import UserInfo from './UserInfo'

const Surplus = ({ otherUsers }: { otherUsers: Types.PresenceMessage[] }) => {
  const [showList, setShowList] = useState(false)
  const { listRef, plusButtonRef } = useClickOutsideList(() =>
    setShowList(false)
  )

  return otherUsers.length > MAX_USERS_BEFORE_LIST ? (
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
  ) : null
}

export default Surplus
