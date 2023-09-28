import { Types } from "ably";
import { generate } from "random-words";
import { SignJWT } from "jose";

export class JWTUtil {
  // Switches the JWT token between the moderator/non-moderator tokens and handles reconnecting
  static async switchToken(
    ably: Types.RealtimePromise,
    clientId: string,
    channelName: string,
    moderator: boolean,
  ) {
    return new Promise<void>(async (resolve) => {
      await ably.auth.authorize({ clientId, nonce: "" + moderator });
      ably.close();
      ably.connect();
      ably.connection.once("connected", () => {
        // Workaround because switching the connection seems to break subscriptions
        const dummyListener = () => {};
        ably.channels.get(channelName).subscribe(dummyListener);
        ably.channels.get(channelName).unsubscribe(dummyListener);
        resolve();
      });
    });
  }
}

export const getSpaceNameFromUrl = () => {
  const url = new URL(window.location.href);
  const spaceNameInParams = url.searchParams.get("space");

  if (spaceNameInParams) {
    return spaceNameInParams;
  } else {
    const generatedName = generate({ exactly: 3, join: "-" });
    url.searchParams.set("space", generatedName);
    window.history.replaceState({}, "", `?${url.searchParams.toString()}`);
    return generatedName;
  }
};

export const CreateJWT = (
  clientId: string,
  apiKey: string,
  claim: string,
): Promise<string> => {
  const [appId, signingKey] = apiKey.split(":", 2);
  const enc = new TextEncoder();
  return new SignJWT({
    "x-ably-capability": `{"*":["*"]}`,
    "x-ably-clientId": clientId,
    "ably.channel.*": claim,
  })
    .setProtectedHeader({ kid: appId, alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(enc.encode(signingKey));
};
