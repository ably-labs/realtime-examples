import { useState } from 'react'
import Spaces, { Space } from '@ably-labs/spaces'
import { assertConfiguration } from '@ably-labs/react-hooks'
import { useEffect } from 'react'

const useSpaces = (name: string, userName: string) => {
  const [space, setSpace] = useState<Space | undefined>(undefined)

  useEffect(() => {
    const init = async () => {
      /** 💡 Use react-hooks to get a handle on the client created in Layout.tsx 💡 */
      const client = assertConfiguration()

      /** 💡 Instantiate the Collaborative Spaces SDK: https://github.com/ably-labs/spaces 💡 */
      const spaces = new Spaces(client)
      const space = await spaces.get(name)

      setSpace(space)
    }

    if (!space) {
      init()
    }

    space?.enter({ name: userName })

    return () => {
      space?.leave()
    }
  }, [space])

  return space
}

export default useSpaces
