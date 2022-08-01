import { useChannel } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import defaultMessages, { Message } from './utils/messageData'
import { RefreshIcon, EmojiHappyIcon } from '@heroicons/react/solid'

const emojis = ['😀', '❤️', '👋', '😹', '😡', '👏']
let msgReactions: string[] = []

const MessageReactions = () => {
  let { channelName } = useOutletContext<{ channelName: string }>()
  channelName = `reactions:${channelName}`
  const [chatMessage, setChatMessage] = useState<Message>({})
  const [showEmojiList, setShowEmojiList] = useState(false)
  const [channel, ably] = useChannel(channelName, 'send', (msg) => {
    // reset reactions when new message is received
    msgReactions = []
    setChatMessage({
      author: msg.data.author,
      content: msg.data.content,
      timeserial: msg.extras.timeserial,
    })
  })

  const sendMessage = () => {
    // Picks a message at random
    const message =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
    channel.publish('send', message)
  }

  const sendReaction = (emoji: string, timeserial: any) => {
    channel.publish('reaction', {
      body: emoji,
      extras: {
        reference: { type: 'com.ably.reaction', timeserial: timeserial },
      },
    })
    setShowEmojiList(false)
  }

  useEffect(() => {
    // Subscribe to message reactions
    channel.subscribe(
      {
        name: 'reaction',
        refTimeserial: chatMessage.timeserial,
      },
      (reaction) => {
        // Update current chat with its reactions
        if (!msgReactions.includes(reaction.data.body)) {
          msgReactions.push(reaction.data.body)
        }
        setChatMessage((chatMessage) => ({
          ...chatMessage,
          reactions: msgReactions,
        }))
      }
    )

    // Keep last published message and reactions
    channel.history((err, result) => {
      // Get index of last sent message from history
      const lastPublishedMessageIndex: any = result?.items.findIndex(
        (message) => {
          return message.name == 'send'
        }
      )

      if (lastPublishedMessageIndex >= 0) {
        const lastPublishedMessage = result?.items[lastPublishedMessageIndex]
        // Get reactions of the last sent message
        if (lastPublishedMessageIndex > 0) {
          for (let i = lastPublishedMessageIndex - 1; i >= 0; i--) {
            if (!msgReactions.includes(result?.items[i].data.body)) {
              msgReactions.push(result?.items[i].data.body)
            }
          }
        }
        // Update chat message
        setChatMessage({
          author: lastPublishedMessage?.data.author,
          content: lastPublishedMessage?.data.content,
          timeserial: lastPublishedMessage?.extras.timeserial,
          reactions: msgReactions,
        })
      } else {
        // Load random message when no sent message history
        sendMessage()
      }
    })
  }, [])

  return (
    <div>
      <h1>Message reactions</h1>
      <p>
        Hello to you and welcome to Ably. You can react to any of these
        messages.
      </p>
      <p>Go ahead, give it a try! You can always checkout the source code </p>
      {chatMessage.author ? (
        <div className="p-6 max-w-fit mx-auto bg-slate-50 rounded-xl shadow-lg flex items-center space-x-4 m-6">
          <img className="bg-gradient-to-r from-cyan-500 to-blue-500 h-12 w-12 rounded-full mb-2"></img>
          <div>
            <p className="text-sm font-small text-black">
              {chatMessage.author}
            </p>
            <p className="text-slate-500"> {chatMessage.content} </p>
            <div className="flex flex-row">
              {chatMessage.reactions?.length ? (
                <ul className="bg-gray-200 rounded-full w-fit flex flex-row p-2 space-x-2">
                  {chatMessage.reactions?.map((reaction) => (
                    <li key={reaction} className="text-lg">
                      {reaction}
                    </li>
                  ))}
                </ul>
              ) : null}
              <EmojiHappyIcon
                className="inline-block ml-2 h-5 w-5 text-slate-500"
                onClick={() => setShowEmojiList(!showEmojiList)}
              />
            </div>
            {showEmojiList ? (
              <ul className="bg-black rounded-full w-fit flex flex-row p-2 space-x-2">
                {emojis.map((emoji) => (
                  <li
                    key={emoji}
                    className="text-lg"
                    onClick={() => sendReaction(emoji, chatMessage.timeserial)}
                  >
                    {emoji}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full"
        onClick={sendMessage}
      >
        <RefreshIcon className="inline-block ml-2 h-5 w-5 text-slate-500" />
        New message
      </button>
    </div>
  )
}

export default MessageReactions
