import { useChannel } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import defaultMessages, { Message } from './utils/messages'

const MessageReactions = () => {
  let { channelName } = useOutletContext<{ channelName: string }>()
  channelName = `reactions:${channelName}`

  const [chatMessage, setChatMessage] = useState<Message>({})
  const [channel, ably] = useChannel(channelName, 'send', (msg) => {})

  const sendMessage = () => {
    // Picks a message at random
    const message =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
    channel.publish('send', message)
  }

  useEffect(() => {
    sendMessage()
  }, [])

  return (
    <div>
      <h1>Message reactions</h1>
      <p>
        {' '}
        Hello to you and welcome to Ably. You can react to any of these
        messages.
      </p>
      <p>Go ahead, give it a try! You can always checkout the source code </p>

      <button
        className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full"
        onClick={sendMessage}
      >
        {' '}
        New message{' '}
      </button>
    </div>
  )
}

export default MessageReactions
