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

/**
 * ! We can possibly get these to infinitely loop by taking the last digit off the index.
 * ! i.e. 117 -> 7, 53 -> 3, etc.
 */
const colours = [
  'from-orange-400 to-orange-500',
  'from-pink-400 to-pink-500',
  'from-green-400 to-green-500',
  'from-violet-400 to-violet-500',
  'from-rose-400 to-rose-500',
  'from-lime-400 to-lime-500',
  'from-yellow-400 to-yellow-500',
]

const AvatarStack = () => {
  // TODO Explain why the user shouldn't care about this
  const { channelName } = useOutletContext<{ channelName: string }>()

  const [presenceUsers] = usePresence(channelName)
  const [yourUser, ...otherUsers] = presenceUsers

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
        {otherUsers.map((user, index) => {
          const usersName = fakeNames[index]
          return (
            <div
              className="group absolute right-0 flex flex-col items-center group"
              key={user.clientId}
              style={{ right: index * 40, zIndex: otherUsers.length - index }}
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
      </div>
    </div>
  )
}
export default AvatarStack
