import { Types } from 'ably'

export default class JWTUtil {
  // Switches the JWT token between the moderator/non-moderator tokens and handles reconnecting
  static async switchToken(
    ably: Types.RealtimePromise,
    clientId: string,
    channelName: string,
    moderator: boolean
  ) {
    return new Promise<void>(async (resolve) => {
      await ably.auth.authorize({ clientId, nonce: '' + moderator })
      ably.close()
      ably.connect()
      ably.connection.once('connected', () => {
        // Workaround because switching the connection seems to break subscriptions
        const dummyListener = () => {}
        ably.channels.get(channelName).subscribe(dummyListener)
        ably.channels.get(channelName).unsubscribe(dummyListener)
        resolve()
      })
    })
  }
}
