import { useChannel } from '@ably-labs/react-hooks'
import { useOutletContext } from 'react-router-dom'

const defaultMessages = [
  'Hello to you and welcome to Ably. You can react to any of these messages',
  'Go ahead, give it a try!',
  'You can always checkout the source code',
]

const publishInterval = 10000

const MessageReactions = () => {
  let { channelName } = useOutletContext<{ channelName: string }>()
  channelName = `reactions:${channelName}`
  console.log(channelName)
  const [channel, ably] = useChannel(channelName, (msg) => {})

  let index = 0
  setInterval(() => {
    channel.publish('send', defaultMessages[index++ % defaultMessages.length])
  }, publishInterval)
  return (
    <div>
      <h1>Message reactions</h1>
    </div>
  )
}

export default MessageReactions
