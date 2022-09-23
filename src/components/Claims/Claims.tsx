import { configureAbly, useChannel } from '@ably-labs/react-hooks'
import { useEffect, useReducer, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Types } from 'ably'
import type { ProjectInfo } from '../../Layout'
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/solid'
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
          m.id === action.extras.ref.timeserial ? { ...m, deleted: true } : m
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

  configureAbly({
    authCallback: (e, cb) => {
      console.log(`Re-authing as ${e.clientId}`)
      CreateJWT(
        clientId,
        import.meta.env.VITE_ABLY_KEY,
        e.clientId === 'true' ? 'moderator' : 'user'
      ).then((key) => {
        cb(null as any, key)
      })
    },
    clientId,
    key: undefined,
  })

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
    console.log('publish')
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
      setModerator(!moderator)
      setLoading(false)
    })
  }

  return (
    <div
      className={`bg-white rounded-lg ${
        moderator ? 'shadow-orange-400' : ''
      } transition shadow-md flex text-sm flex-col w-1/2`}
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
          className="bg-slate-800 text-slate-100 rounded-full p-2 px-3"
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
  const background = moderator ? 'bg-orange-100' : 'bg-blue-100'
  const text = moderator ? 'text-orange-500' : 'text-blue-500'
  const Icon = moderator ? ShieldCheckIcon : UserCircleIcon
  return (
    <div className="flex pt-3 px-3 py-5 items-center relative">
      <div
        className={`rounded-full ${background} w-10 h-10 flex justify-center mr-2 transition`}
      >
        <Icon className={`w-6 ${text} transition`} />
      </div>
      <div className="flex-grow">
        <div>
          You have the <b>{moderator ? 'moderator' : 'participant'}</b> role
        </div>
        <div className="text-slate-500">
          {moderator
            ? 'You can delete your own and others messages'
            : 'You can delete your own messages'}
        </div>
      </div>
      <button
        className="bg-slate-200 text-slate-800 rounded-full p-2 px-3 font-bold"
        onClick={onToggle}
        disabled={loading}
      >
        Switch to {moderator ? 'participant' : 'moderator'}
      </button>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#eeeeeeaa]">
          <div>Loading...</div>
        </div>
      )}
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
      <div
        className={`text-red-400 cursor-pointer ${
          local ? 'text-right mr-1' : 'ml-1'
        } ${
          (!moderator && !local) || message.deleted ? 'opacity-0' : ''
        } transition`}
        onClick={deleteMessage(message.id)}
      >
        Delete
      </div>
    </div>
  )
}

async function CreateJWT(
  clientId: string,
  apiKey: string,
  claim: string
): Promise<string> {
  const [appId, signingKey] = apiKey.split(':', 2)
  const enc = new TextEncoder()
  return new SignJWT({
    'x-ably-capability': `{"*":["*"]}`,
    'x-ably-clientId': clientId,
    'ably.channel.*': claim,
  })
    .setProtectedHeader({ kid: appId, alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(enc.encode(signingKey))
}

export default Claims
