## ✈️ Overview

This repository contains all of the code necessary to run and test the Ably examples locally.

Click on any of the links below to find out more specific information on each example:

- [Avatar Stack](/src/components/AvatarStack/README.md)
- [Emoji Reactions](/src/components/EmojiReactions/README.md)
- [User Claims](/src/components/Claims/README.md)

All of the examples are built with the following technology:

- React.js
- Tailwind
- HeroIcons

To see what else is possible with Ably, check out our other [realtime examples](https://ably.com/examples?utm_source=ably-labs&utm_medium=github&utm_campaign=realtime-examples).

## 🏃 Runtime Requirements

- [Node.js](https://nodejs.org/en/)
- Ably API Key
- [Yarn](https://yarnpkg.com/) (optional)

## ⚙️ Running locally

- Fork or clone the [Examples Repo](https://github.com/ably-labs/realtime-examples).
- Sign up for an account on [Ably](https://ably.com/sign-up?utm_source=ably-labs&utm_medium=github&utm_campaign=realtime-examples) and get an API KEY.
- Rename `.env.example` to `.env` and fill in your API key in the `VITE_ABLY_KEY` environment variable.
  (You can use the same key for all examples or you can create different keys for each app.)
  - `VITE_ABLY_KEY_AVATAR_STACK` for the Avatar Stack
  - `VITE_ABLY_KEY_EMOJI_REACTIONS` for the Emoji Reactions
  - `VITE_ABLY_KEY_USER_CLAIMS` for User Claims
- Run `yarn` or `npm install` to install dependencies.
- Run `yarn dev` or `npm run dev` and go to http://localhost:5173/

## 🤔 Support, feedback and troubleshooting

- [Create a GitHub Issue](https://github.com/ably-labs/realtime-examples/issues)
- [Join our Discord server](https://discord.gg/q89gDHZcBK)
- [Follow us on Twitter](https://twitter.com/ablyrealtime)
- [Use our SDKs](https://github.com/ably/)
- [Visit our website](https://ably.com?utm_source=ably-labs&utm_medium=github&utm_campaign=realtime-examples)

---

[![Ably logo](https://static.ably.dev/badge-black.svg?serverless-websockets-quest)](https://ably.com?utm_source=ably-labs&utm_medium=github&utm_campaign=realtime-examples)
