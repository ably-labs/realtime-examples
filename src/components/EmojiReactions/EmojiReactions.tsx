import { useChannel } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import defaultMessages, { EmojiUsage, Message } from './utils/messageData'
import { RefreshIcon, EmojiHappyIcon } from '@heroicons/react/solid'
import { Types } from 'ably'
import type { ProjectInfo } from '../../Layout'

const EmojiReactions = () => {
  let { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  // Include your channel namespace created in Ably for message interactions. In this case, we use "reactions"
  channelName = `reactions:${channelName}`
  const emojis = ['😀', '❤️', '👋', '😹', '😡', '👏']
  let usedEmojiCollection: EmojiUsage[] = []

  const ADD_REACTION_EVENT = 'add-reaction'
  const REMOVE_REACTION_EVENT = 'remove-reaction'
  const SEND_EVENT = 'send'

  const [addEmoji, setAddEmoji] = useState(true)

  const [chatMessage, setChatMessage] = useState<Message>({})
  const [showEmojiList, setShowEmojiList] = useState(false)

  // Access and subscribe to your channel using "useChannel" from "ably-react-hooks"
  const [channel, ably] = useChannel(channelName, (msg) => {
    switch (msg.name) {
      case SEND_EVENT:
        // Reset emoji reactions when a new message is received
        usedEmojiCollection = []
        setChatMessage({
          author: msg.data.author,
          content: msg.data.content,
          timeserial: msg.id,
          timeStamp: new Date(msg.timestamp),
        })
        break
      case REMOVE_REACTION_EVENT:
        // Remove emoji reaction from chat message
        const msgReactions = updateEmojiCollection(
          msg.data.body,
          msg.clientId,
          msg.name
        )
        setChatMessage((chatMessage) => ({
          ...chatMessage,
          reactions: msgReactions,
        }))
        break
    }
  })

  // Publish new chat message to channel
  const sendMessage = () => {
    // Selects a random message to publish
    const message =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)]

    // Publish message to channel
    channel.publish(SEND_EVENT, message)
  }

  // Publish emoji reaction for a message using the chat message timeserial
  const sendMessageReaction = (
    emoji: string,
    timeserial: any,
    reactionEvent: string
  ) => {
    channel.publish(reactionEvent, {
      body: emoji,
      extras: {
        reference: { type: 'com.ably.reaction', timeserial },
      },
    })
    setShowEmojiList(false)
  }

  // Subscribe to emoji reactions for a message using the message timeserial
  const getMessageReactions = () => {
    channel.subscribe(
      {
        name: ADD_REACTION_EVENT,
        refTimeserial: chatMessage.timeserial,
      },
      (reaction) => {
        // Update current chat message with its reaction(s)
        const msgReactions = updateEmojiCollection(
          reaction.data.body,
          reaction.clientId,
          reaction.name
        )
        setChatMessage((chatMessage) => ({
          ...chatMessage,
          reactions: msgReactions,
        }))
      }
    )
  }

  // Increase or decrease emoji count on click on existing emoji
  const handleEmojiCount = (emoji: string, timeserial: any) => {
    const emojiEvent = addEmoji ? ADD_REACTION_EVENT : REMOVE_REACTION_EVENT
    setAddEmoji(!addEmoji)
    sendMessageReaction(emoji, timeserial, emojiEvent)
  }

  // Keep track of used emojis
  const updateEmojiCollection = (
    emoji: string,
    clientId: string,
    reactionEvent: string
  ) => {
    const userReactions = usedEmojiCollection.find((emj) => emj.emoji === emoji)

    switch (reactionEvent) {
      case ADD_REACTION_EVENT:
        if (userReactions) {
          if (!userReactions.usedBy.includes(clientId)) {
            userReactions.usedBy.push(clientId)
          }
        } else {
          const emojiUse: EmojiUsage = { usedBy: [clientId], emoji: emoji }
          usedEmojiCollection.push(emojiUse)
        }
        break
      case REMOVE_REACTION_EVENT:
        if (userReactions && userReactions.usedBy.includes(clientId)) {
          userReactions.usedBy.splice(userReactions.usedBy.indexOf(clientId), 1)
          usedEmojiCollection[usedEmojiCollection.indexOf(userReactions)] =
            userReactions
        }
        break
    }
    return usedEmojiCollection
  }

  // Update current chat message and its reactions leveraging Ably channel history
  const updateMessageFromHistory = (
    messageIndex: number,
    history: Types.PaginatedResult<Types.Message>
  ) => {
    const lastPublishedMessage = history?.items[messageIndex]

    // Get reactions of the published message
    if (messageIndex > 0) {
      for (let i = messageIndex - 1; i >= 0; i--) {
        const emoji = history?.items[i].data.body
        const client = history?.items[i].clientId
        const event = history?.items[i].name

        if (usedEmojiCollection.length > 0) {
          for (const usage of usedEmojiCollection) {
            updateEmojiCollection(emoji, client, event)
          }
        } else {
          const emojiUse: EmojiUsage = { usedBy: [client], emoji: emoji }
          usedEmojiCollection.push(emojiUse)
        }
      }
    }

    // Update chat message
    setChatMessage({
      author: lastPublishedMessage?.data.author,
      content: lastPublishedMessage?.data.content,
      timeserial: lastPublishedMessage?.id,
      reactions: usedEmojiCollection,
      timeStamp: new Date(lastPublishedMessage.timestamp),
    })
  }

  // Format chat message timestamp to readable format
  const formatChatMessageTime = (timestamp: Date) => {
    const hour = timestamp.getHours()
    const minutes = `${
      timestamp.getMinutes() < 10 ? '0' : ''
    }${timestamp.getMinutes()}`
    return `${hour}:${minutes}`
  }

  useEffect(() => {
    setProjectInfo({
      name: 'Emoji Reactions',
      repoNameAndPath:
        'realtime-examples/tree/main/src/components/MessageReactions',
      topic: 'emoji-reactions',
    })
  }, [])

  useEffect(() => {
    // Subscribe to message reactions
    getMessageReactions()

    // Keep last published message and reactions using Ably channel history
    channel.history((err, result) => {
      // Get index of last sent message from history
      const lastPublishedMessageIndex: any = result?.items.findIndex(
        (message) => message.name == SEND_EVENT
      )

      if (lastPublishedMessageIndex >= 0) {
        updateMessageFromHistory(lastPublishedMessageIndex, result!)
      } else {
        // Load new random message when channel has no history
        sendMessage()
      }
    })
  }, [])

  return (
    <div className="p-6 w-[480px] mx-auto">
      <div className="rounded-lg bg-slate-50 p-4 mb-6">
        <p className="text-slate-500 text-center">
          Open this page in a few windows and add a reaction to the message to
          see it update everywhere
        </p>
      </div>

      {/* Display default chat message */}
      {chatMessage.author ? (
        <div className="p-5 bg-white rounded-lg border drop-shadow-lg mb-8">
          <div className="flex flex-row mb-6">
            <img className="inline bg-gradient-to-r from-pink-500 to-rose-800 h-12 w-12 rounded-full mb-2 shrink-0 mr-3"></img>
            <div>
              <p className="text-sm mb-2 text-slate-800">
                {chatMessage.author}
                <span className="text-xs ml-4 text-slate-500">
                  {formatChatMessageTime(chatMessage.timeStamp)}
                </span>
              </p>
              <p className="text-slate-600"> {chatMessage.content} </p>
            </div>
          </div>

          {/* Display chat message emoji reactions and count */}
          <div className="ml-12 flex">
            {chatMessage.reactions?.length ? (
              <ul className="flex flex-row flex-wrap">
                {chatMessage.reactions?.map((reaction) =>
                  reaction.usedBy.length ? (
                    <li
                      key={reaction.emoji}
                      className={`text-xs rounded-full p-2 ml-3 space-x-2 hover:bg-gray-400 cursor-pointer ${
                        reaction.usedBy.includes(clientId)
                          ? 'bg-blue-200'
                          : 'bg-gray-200'
                      }`}
                      onClick={() =>
                        handleEmojiCount(reaction.emoji, chatMessage.timeserial)
                      }
                    >
                      <EmojiDisplay emoji={reaction.emoji} />
                      <span>{reaction.usedBy.length}</span>
                    </li>
                  ) : null
                )}
              </ul>
            ) : null}

            {/* Allow user to select and add an emoji reaction */}
            <div className="self-center">
              <div className="bg-gray-200 rounded-full p-1 ml-3 cursor-pointer hover:bg-gray-400">
                <EmojiHappyIcon
                  className="h-7 w-7 text-slate-500"
                  onClick={() => setShowEmojiList(!showEmojiList)}
                />
              </div>
              {showEmojiList ? (
                <ul className="bg-black rounded-full w-fit flex flex-row p-2 space-x-2 absolute">
                  {emojis.map((emoji) => (
                    <li
                      key={emoji}
                      className="text-lg px-1 cursor-pointer transition delay-5 ease-in-out hover:-translate-y-1 motion-reduce:transition-none"
                      onClick={() =>
                        sendMessageReaction(
                          emoji,
                          chatMessage.timeserial,
                          ADD_REACTION_EVENT
                        )
                      }
                    >
                      <EmojiDisplay emoji={emoji} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Load new chat message */}
      <div className="flex items-center justify-center">
        <button
          className="bg-slate-200 hover:bg-gray-400 text-black py-2 px-4 rounded-full"
          onClick={sendMessage}
        >
          <RefreshIcon className="inline-block mr-1 h-4 w-4 text-slate-500" />
          <span className="text-slate-800">New message</span>
        </button>
      </div>
    </div>
  )
}

// Use twemoji for consistency in emoji display across platforms
const EmojiDisplay = ({ emoji }: { emoji: string }) => {
  const codePoint = emoji.codePointAt(0)?.toString(16)
  return (
    <img
      alt={emoji}
      className="h-5 w-5 pointer-events-none inline-block"
      src={`https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`}
    />
  )
}

export default EmojiReactions
