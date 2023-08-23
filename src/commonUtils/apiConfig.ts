import { nanoid } from "nanoid";
import { Types } from "ably";
import { SignJWT } from "jose";

const clientId = nanoid();
let API_CONFIG: Types.ClientOptions = { clientId };

export default function createApiConfig(example: string) {
  switch (example) {
    case "/live-cursors":
      API_CONFIG.key =
        import.meta.env.VITE_ABLY_KEY_LIVE_CURSORS ||
        import.meta.env.VITE_ABLY_KEY;
      break;

    case "/component-locking":
      API_CONFIG.key =
        import.meta.env.VITE_ABLY_KEY_COMPONENT_LOCKING ||
        import.meta.env.VITE_ABLY_KEY;
      break;

    case "/member-location":
      API_CONFIG.key =
        import.meta.env.VITE_ABLY_KEY_MEMBER_LOCATION ||
        import.meta.env.VITE_ABLY_KEY;
      break;

    case "/avatar-stack":
      API_CONFIG.key =
        import.meta.env.VITE_ABLY_KEY_AVATAR_STACK ||
        import.meta.env.VITE_ABLY_KEY;
      break;

    case "/emoji-reactions":
      API_CONFIG.key =
        import.meta.env.VITE_ABLY_KEY_EMOJI_REACTIONS ||
        import.meta.env.VITE_ABLY_KEY;
      break;

    case "/user_claims":
      API_CONFIG.authCallback = (e, cb) => {
        CreateJWT(
          clientId,
          import.meta.env.VITE_ABLY_KEY_USER_CLAIMS ||
            import.meta.env.VITE_ABLY_KEY,
          e.nonce === "true" ? "moderator" : "user",
        ).then((key) => {
          cb(null as any, key);
        });
      };
      break;

    default:
      API_CONFIG.key = import.meta.env.VITE_ABLY_KEY;
  }
  return API_CONFIG;
}

function CreateJWT(
  clientId: string,
  apiKey: string,
  claim: string,
): Promise<string> {
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
}
