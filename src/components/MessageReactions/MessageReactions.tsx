import { AblyMessageCallback, useChannel } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import defaultMessages, { EmojiUsage, Message } from './utils/messageData'
import { RefreshIcon, EmojiHappyIcon } from '@heroicons/react/solid'
import { Types } from 'ably'

const emojis = ['😀', '❤️', '👋', '😹', '😡', '👏']
let msgReactions: string[] = []

let emojiUsageData: EmojiUsage[] = []

const MessageReactions = () => {
  let { channelName, clientId } = useOutletContext<{
    channelName: string
    clientId: string
  }>()
  channelName = `reactions:${channelName}`
  const [chatMessage, setChatMessage] = useState<Message>({})
  const [showEmojiList, setShowEmojiList] = useState(false)
  const [count, setCount] = useState(0)
  const [channel, ably] = useChannel(channelName, 'send', (msg) => {
    console.log(msg, '\n====== msg', clientId)
    // reset reactions when new message is received
    msgReactions = []
    emojiUsageData = []
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

  const sendMessageReaction = (emoji: string, timeserial: any) => {
    channel.publish('reaction', {
      body: emoji,
      extras: {
        reference: { type: 'com.ably.reaction', timeserial },
      },
    })
    setShowEmojiList(false)
  }

  const getMessageReactions = () => {
    channel.subscribe(
      {
        name: 'reaction',
        refTimeserial: chatMessage.timeserial,
      },
      (reaction) => {
        console.log(reaction, '\n====== reaction')
        // Update current chat with its reactions

        // FindClient reaction
        const usedEmoji = reaction.data.body
        const emojiClientId = reaction.clientId

        const userReactions = emojiUsageData.find((emj) => {
          return emj.emoji === usedEmoji
        })

        if (userReactions) {
          if (!userReactions.usedBy.includes(emojiClientId)) {
            userReactions.usedBy.push(emojiClientId)
          }
        } else {
          console.log('now adding')
          const toh: EmojiUsage = { usedBy: [emojiClientId], emoji: usedEmoji }

          emojiUsageData.push(toh)
        }

        setChatMessage((chatMessage) => ({
          ...chatMessage,
          reactions: emojiUsageData,
        }))
      }
    )
  }

  const updateMessageFromHistory = (
    messageIndex: number,
    history: Types.PaginatedResult<Types.Message>
  ) => {
    const lastPublishedMessage = history?.items[messageIndex]
    // Get reactions of the published message
    if (messageIndex > 0) {
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (!msgReactions.includes(history?.items[i].data.body)) {
          msgReactions.push(history?.items[i].data.body)
        }
      }
    }
    // Update chat message
    setChatMessage({
      author: lastPublishedMessage?.data.author,
      content: lastPublishedMessage?.data.content,
      timeserial: lastPublishedMessage?.extras.timeserial,
      // reactions: msgReactions,
    })
  }

  useEffect(() => {
    // Subscribe to message reactions
    getMessageReactions()
    // Keep last published message and reactions
    channel.history((err, result) => {
      // Get index of last sent message from history
      const lastPublishedMessageIndex: any = result?.items.findIndex(
        (message) => message.name == 'send'
      )

      if (lastPublishedMessageIndex >= 0) {
        // updateMessageFromHistory(lastPublishedMessageIndex, result!)
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
                <ul className="flex flex-row">
                  {chatMessage.reactions?.map((reaction) => (
                    <li
                      key={reaction.emoji}
                      className="text-lg bg-gray-200 rounded-full w-fit p-2 m-1 space-x-2"
                    >
                      {reaction.emoji} {reaction.usedBy.length}
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
                    onClick={() =>
                      sendMessageReaction(emoji, chatMessage.timeserial)
                    }
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
