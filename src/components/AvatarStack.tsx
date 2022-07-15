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

const AvatarStack = () => {
  // TODO Explain why the user shouldn't care about this
  const { channelName } = useOutletContext<{ channelName: string }>()

  const [presenceUsers] = usePresence(channelName)

  return (
    <div className="flex">
      {presenceUsers.map((user, index) => {
        const usersName = fakeNames[index]
        return (
          <div
            className="group relative flex flex-col items-center group"
            key={user.clientId}
          >
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 
              h-12 w-12 rounded-full mb-2"
            ></div>
            <div className="relative invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
              {usersName}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default AvatarStack
