import { useChannel } from '@ably-labs/react-hooks'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import defaultMessages, { EmojiUsage, Message } from './utils/messageData'
import { RefreshIcon, EmojiHappyIcon } from '@heroicons/react/solid'
import { Types } from 'ably'

const EmojiReactions = () => {
  let { channelName, clientId } = useOutletContext<{
    channelName: string
    clientId: string
  }>()

  channelName = `reactions:${channelName}`
  const emojis = ['😀', '❤️', '👋', '😹', '😡', '👏']
  let usedEmojiCollection: EmojiUsage[] = []

  const ADD_REACTION_EVENT = 'add-reaction'
  const REMOVE_REACTION_EVENT = 'remove-reaction'
  const SEND_EVENT = 'send'

  const [addEmoji, setAddEmoji] = useState(true)

  const [chatMessage, setChatMessage] = useState<Message>({})
  const [showEmojiList, setShowEmojiList] = useState(false)

  const [channel, ably] = useChannel(channelName, (msg) => {
    switch (msg.name) {
      case SEND_EVENT:
        // reset reactions when new message is received
        usedEmojiCollection = []
        setChatMessage({
          author: msg.data.author,
          content: msg.data.content,
          timeserial: msg.id,
        })
        break
      case REMOVE_REACTION_EVENT:
        // remove emoji reaction
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

  const sendMessage = () => {
    // Picks a message at random
    const message =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
    channel.publish(SEND_EVENT, message)
  }

  const sendMessageReaction = (
    emoji: string,
    timeserial: any,
    reactionEvent: string
  ) => {
    // setPublishAction(reactionEvent)
    channel.publish(reactionEvent, {
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
        name: ADD_REACTION_EVENT,
        refTimeserial: chatMessage.timeserial,
      },
      (reaction) => {
        // Update current chat with its reactions
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

  const handleEmojiCount = (emoji: string, timeserial: any) => {
    const emojiEvent = addEmoji ? ADD_REACTION_EVENT : REMOVE_REACTION_EVENT
    setAddEmoji(!addEmoji)
    sendMessageReaction(emoji, timeserial, emojiEvent)
  }

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
    })
  }

  useEffect(() => {
    // Subscribe to message reactions
    getMessageReactions()
    // Keep last published message and reactions
    channel.history((err, result) => {
      // Get index of last sent message from history
      const lastPublishedMessageIndex: any = result?.items.findIndex(
        (message) => message.name == SEND_EVENT
      )

      if (lastPublishedMessageIndex >= 0) {
        updateMessageFromHistory(lastPublishedMessageIndex, result!)
      } else {
        // Load random message when no sent message history
        sendMessage()
      }
    })
  }, [])

  return (
    <div className="p-6">
      <h1>Emoji Reactions</h1>
      <p>
        Hello to you and welcome to Ably. You can react to any of these
        messages.
      </p>
      <p>Go ahead, give it a try! You can always checkout the source code </p>
      {chatMessage.author ? (
        <div className="p-6 max-w-fit mx-auto bg-slate-50 rounded-xl shadow-lg flex items-center space-x-4 m-6">
          <img className="bg-gradient-to-r from-cyan-500 to-blue-500 h-12 w-12 rounded-full mb-2 shrink-0"></img>
          <div>
            <p className="text-sm font-small text-black">
              {chatMessage.author}
            </p>
            <p className="text-slate-500"> {chatMessage.content} </p>
            <div className="flex flex-row flex-wrap">
              {chatMessage.reactions?.length ? (
                <ul className="flex flex-row flex-wrap">
                  {chatMessage.reactions?.map((reaction) =>
                    reaction.usedBy.length ? (
                      <li
                        key={reaction.emoji}
                        className={`text-sm rounded-full w-fit p-2 m-1 space-x-2 ${
                          reaction.usedBy.includes(clientId)
                            ? 'bg-blue-200'
                            : 'bg-gray-200'
                        }`}
                        onClick={() =>
                          handleEmojiCount(
                            reaction.emoji,
                            chatMessage.timeserial
                          )
                        }
                      >
                        <EmojiDisplay emoji={reaction.emoji} />
                        <span>{reaction.usedBy.length}</span>
                      </li>
                    ) : null
                  )}
                </ul>
              ) : null}
              <div className="self-center">
                <EmojiHappyIcon
                  className="inline-block ml-2 h-5 w-5 text-slate-500"
                  onClick={() => setShowEmojiList(!showEmojiList)}
                />
                {showEmojiList ? (
                  <ul className="bg-black rounded-full w-fit flex flex-row p-2 space-x-2 absolute">
                    {emojis.map((emoji) => (
                      <li
                        key={emoji}
                        className="text-lg"
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

const EmojiDisplay = ({ emoji }: { emoji: string }) => {
  const codePoint = emoji.codePointAt(0)?.toString(16)
  return (
    <img
      alt={emoji}
      className="h-5 w-5 pointer-events-none inline-block cursor-pointer"
      src={`https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`}
    />
  )
}

export default EmojiReactions
