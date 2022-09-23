import { configureAbly, useChannel } from '@ably-labs/react-hooks'
import { useEffect, useReducer, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Types } from 'ably'
import type { ProjectInfo } from '../../Layout'
import {
  RefreshIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import randomWords from 'random-words'
import { SignJWT } from 'jose'

type Message = {
  author: string
  content: string
  timestamp: Date
  id: string
  deleted?: boolean
}

type MessageSendEvent = { type: 'send'; message: Message; id: string }
type MessageClearEvent = { type: 'clear' }
type MessageDeleteEvent = { type: 'delete'; [key: string]: any }

type MessageDispatch = MessageSendEvent | MessageClearEvent | MessageDeleteEvent

const Claims = () => {
  const messageReducer = (
    state: Message[],
    action: MessageDispatch
  ): Message[] => {
    console.log((action as any).extras)
    switch (action.type) {
      case 'send':
        action.message.id = action.id
        return state.concat(action.message)
      case 'delete':
        return state.map((m) =>
          !(m.author !== author && action.extras?.userClaim === 'user') &&
          m.id === action.extras.ref.timeserial
            ? { ...m, deleted: true }
            : m
        )
      case 'clear':
        return []
      default:
        return state
    }
  }

  const [author] = useState(randomWords({ exactly: 2, join: '' }))
  const [draft, setDraft] = useState('')
  const [moderator, setModerator] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, dispatchMessage] = useReducer(messageReducer, [])

  let { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  useEffect(() => {
    setProjectInfo({
      name: 'User Claims',
      repoNameAndPath: 'realtime-examples/tree/main/src/components/UserClaims',
      topic: 'user-claims',
    })
  }, [])

  const handleMessage = (msg: Types.Message) => {
    dispatchMessage({ type: msg.name, id: msg.id, ...msg.data })
  }

  // Access and subscribe to your channel using "useChannel" from "ably-react-hooks"
  let [channel, ably] = useChannel(channelName, handleMessage)

  useEffect(() => {
    channel.history((err, result) => {
      if (err || !result) return
      if (result.items.length === 0) {
        channel.publish('send', {
          message: {
            author: 'Name of person',
            content:
              'This is a fake message from someone else, as a placeholder',
            timestamp: new Date(),
          },
        })
      } else {
        for (let i = result.items.length - 1; i >= 0; i--) {
          handleMessage(result.items[i])
        }
      }
    })
  }, [])

  const sendMessage = () => {
    if (draft.length === 0) return
    channel.publish('send', {
      message: { author, content: draft, timestamp: new Date() },
    })
    setDraft('')
  }

  const deleteMessage = (mid: string) => {
    return () => {
      channel.publish('delete', {
        user: author,
        extras: {
          ref: { type: 'com.ably.delete', timeserial: mid },
        },
      })
    }
  }

  const switchMode = async () => {
    setLoading(true)
    await ably.auth.authorize({ clientId: '' + moderator })
    ably.close()
    ably.connect()
    ably.connection.once('connected', () => {
      // Workaround because switching the connection seems to break subscriptions
      const dummyListener = () => {}
      ably.channels.get(channelName).subscribe(dummyListener)
      ably.channels.get(channelName).unsubscribe(dummyListener)
      setModerator(!moderator)
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-6 w-[480px] mx-auto">
        <div className="rounded-lg bg-slate-100 p-4 mb-6">
          <p className="text-slate-500 text-center">
            Send messages from one or more windows. Toggle between roles to
            delete messages sent by you or by anyone in the chat.
          </p>
        </div>
      </div>
      <div
        className={`bg-white w-[100%] rounded-lg ${
          moderator ? 'shadow-[0_0_0_8px_rgb(255,237,212)]' : 'shadow-md'
        } transition flex text-sm flex-col w-1/2`}
      >
        <div className="flex-grow border-solid h-80 overflow-auto flex flex-col justify-end px-5">
          {messages.map((m) => (
            <Message
              message={m}
              local={m.author === author}
              deleteMessage={deleteMessage}
              moderator={moderator}
              key={m.id}
            />
          ))}
        </div>
        <div className="pb-3 px-5 border-b flex justify-between">
          <input
            type="text"
            disabled={loading}
            className="bg-slate-100 rounded-full p-2 px-3 flex-grow mr-2"
            placeholder="Type something..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-slate-800 text-white rounded-full p-2 px-3 hover:bg-slate-700 focus:bg-slate-700 border border-transparent disabled:bg-slate-200 focus:border-[rgba(14,165,233,0.3)]"
            disabled={loading}
          >
            Send
          </button>
        </div>
        <PrivilegeBar
          moderator={moderator}
          loading={loading}
          onToggle={switchMode}
        />
      </div>
    </div>
  )
}

function PrivilegeBar({
  moderator,
  loading,
  onToggle,
}: {
  moderator: boolean
  loading: boolean
  onToggle: () => void
}) {
  let iconColour = 'text-slate-500'
  let iconBackground = 'bg-slate-100'
  let Icon = RefreshIcon
  let titleText = <>Switching roles</>
  let subtitleText = <>Loading...</>
  if (!loading) {
    if (moderator) {
      titleText = (
        <>
          You have the <b>moderator</b> role
        </>
      )
      subtitleText = <>You can delete everyone's messages</>
      Icon = ShieldCheckIcon
      iconColour = 'text-orange-500'
      iconBackground = 'bg-orange-100'
    } else {
      titleText = (
        <>
          You have the <b>moderator</b> role
        </>
      )
      subtitleText = <>You can delete everyone's messages</>
      Icon = UserCircleIcon
      iconColour = 'text-blue-500'
      iconBackground = 'bg-blue-100'
    }
  }
  return (
    <div className="flex pt-3 px-3 py-5 items-center relative">
      <div
        className={`rounded-full ${iconBackground} w-10 h-10 flex justify-center mr-2 transition`}
      >
        <Icon className={`w-6 ${iconColour} transition`} />
      </div>
      <div className="flex-grow">
        <div>{titleText}</div>
        <div className="text-slate-500">{subtitleText}</div>
      </div>
      <button
        className="bg-slate-100 text-slate-800 rounded-full p-2 px-3 font-bold hover:bg-slate-50 disabled:bg-slate-200 disabled:text-slate-400 border border-transparent focus:border-[rgba(14,165,233,0.3)]"
        onClick={onToggle}
        disabled={loading}
      >
        Switch to {moderator ? 'participant' : 'moderator'}
      </button>
    </div>
  )
}

function Message({
  message,
  local,
  moderator,
  deleteMessage,
}: {
  message: Message
  local: boolean
  moderator: boolean
  deleteMessage: (mid: string) => () => void
}) {
  return (
    <div
      className={`mb-5 items-baseline ${
        local ? 'flex-row-reverse self-end' : 'flex-row'
      }`}
    >
      <div className="bg-slate-200 p-1 px-2 rounded-lg">
        <p className={`text-${local ? 'blue' : 'slate'}-400 font-bold`}>
          {message.author} {local ? '(you)' : ''}
        </p>
        <p
          className={`text-base text-slate-600 ${
            message.deleted ? 'italic' : ''
          }`}
        >
          {message.deleted ? 'This message has been deleted.' : message.content}
        </p>
      </div>
      <button
        className={`text-red-600 bg-red-100 rounded-bl-lg rounded-br-lg my-1 p-1 px-2 cursor-pointer disabled:cursor-default ${
          local
            ? 'text-right ml-[50%] rounded-tr-sm rounded-tl-lg'
            : 'ml-1 rounded-tr-lg rounded-tl-sm'
        } ${
          (!moderator && !local) || message.deleted ? 'opacity-0' : ''
        } transition`}
        disabled={!moderator && !local}
        onClick={deleteMessage(message.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default Claims
