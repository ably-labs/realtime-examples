import { useOutletContext } from 'react-router-dom'
import { usePresence } from '@ably-labs/react-hooks'

const fakeNames = [
  'Anum Reeve',
  'Tiernan Stubbs',
  'Hakim Hernandez',
  'Madihah Maynard',
  'Mac Beard',
  'Gracie-Mae Dunne',
  'Oliver Leigh',
  'Jose Tapia',
  'Lyle Beasley',
  'Arslan Samuels',
]

const colours = [
  'from-orange-400 to-orange-500',
  'from-pink-400 to-pink-500',
  'from-green-400 to-green-500',
  'from-violet-400 to-violet-500',
  'from-rose-400 to-rose-500',
  'from-lime-400 to-lime-500',
]

const AvatarStack = () => {
  // TODO Explain why the user shouldn't care about this
  const { channelName } = useOutletContext<{ channelName: string }>()

  // @ts-ignore
  const [presenceUsers] = usePresence(channelName, {}, (update: any) => {
    if (update.action == 'leave') {
      console.log('Someone left!', update)
    }
    console.log('Presence message', update)
  })

  const [yourUser, ...otherUsers] = presenceUsers

  console.log({ yourUser, otherUsers })

  const MAX_USERS_BEFORE_LIST = 5

  return (
    <div className="w-screen flex justify-between px-6">
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
          const usersName = fakeNames[index]
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
                h-12 w-12 rounded-full mb-2 outline outline-4 outline-white`}
              ></div>
              <div className="absolute top-14 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
                {usersName}
              </div>
            </div>
          )
        })}
        {otherUsers.length > 5 ? (
          <div className="absolute right-0 z-50">
            <div
              className="flex peer justify-center items-center absolute right-0 text-white bg-gradient-to-r from-gray-500 to-slate-500 
                    h-12 w-12 rounded-full mb-2 outline outline-4 outline-white"
            >
              +{otherUsers.slice(5).length}
            </div>
            <div className="peer-hover:inline-block px-7 py-2 relative top-14 bg-slate-800 rounded-lg text-white text-center">
              {users.slice(1).map((user) => (
                <div className="hover:bg-slate-700 hover:rounded-lg px-7 py-2">
                  <p className="font-semibold">{user.clientId}</p>
                  <div className="flex items-center justify-start">
                    <div className="bg-green-500 w-2 h-2 rounded-full mr-2" />
                    <p className="font-medium text-sm">Online now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default AvatarStack
