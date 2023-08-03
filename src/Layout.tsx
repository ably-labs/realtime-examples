import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import { configureAbly } from '@ably-labs/react-hooks'
import InfoCard from './InfoCard'
import { Types } from 'ably'
import { SignJWT } from 'jose'

const clientId = nanoid()
const example: string = window.location.pathname
let API_CONFIG: Types.ClientOptions = { clientId }

switch (example) {
  case '/live-cursors':
    API_CONFIG.key =
      import.meta.env.VITE_ABLY_KEY_LIVE_CURSORS ||
      import.meta.env.VITE_ABLY_KEY
    break

  case '/avatar-stack':
    API_CONFIG.key =
      import.meta.env.VITE_ABLY_KEY_AVATAR_STACK ||
      import.meta.env.VITE_ABLY_KEY
    break

  case '/emoji-reactions':
    API_CONFIG.key =
      import.meta.env.VITE_ABLY_KEY_EMOJI_REACTIONS ||
      import.meta.env.VITE_ABLY_KEY
    break

  case '/user_claims':
    API_CONFIG.authCallback = (e, cb) => {
      CreateJWT(
        clientId,
        import.meta.env.VITE_ABLY_KEY_USER_CLAIMS ||
          import.meta.env.VITE_ABLY_KEY,
        e.nonce === 'true' ? 'moderator' : 'user'
      ).then((key) => {
        cb(null as any, key)
      })
    }
    break

  default:
    API_CONFIG.key = import.meta.env.VITE_ABLY_KEY
}

configureAbly(API_CONFIG)

async function CreateJWT(
  clientId: string,
  apiKey: string,
  claim: string
): Promise<string> {
  const [appId, signingKey] = apiKey.split(':', 2)
  const enc = new TextEncoder()
  return new SignJWT({
    'x-ably-capabilities': `{"*":["*"]}`,
    'x-ably-clientId': clientId,
    'ably.channel.*': claim,
  })
    .setProtectedHeader({ kid: appId, alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(enc.encode(signingKey))
}

export type ProjectInfo = {
  name: string
  repoNameAndPath: string
  topic: string
}

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Realtime Examples',
    repoNameAndPath: 'realtime-examples',
    topic: 'realtime-examples',
  })

  const channelId =
    searchParams.get('id') || randomWords({ exactly: 3, join: '-' })

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: channelId }, { replace: true })
    }
  }, [channelId])

  return (
    <main className="flex pt-6 font-sans bg-slate-900">
      <div className="my-8 ml-6 flex flex-col justify-center items-center">
        <InfoCard projectInfo={projectInfo} />
      </div>
      <div className="bg-orange-500 w-1/2 h-full">
        <Outlet
          context={{ channelName: channelId, clientId, setProjectInfo }}
        />
      </div>
    </main>
  )
}

export default Layout
