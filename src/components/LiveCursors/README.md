## Overview

![Live cursors Start screen](./Ably_Live_Cursors.png)

This folder contains the code for the Live cursors - a demo of how you can leverage [Ably Spaces](https://github.com/ably-labs/spaces) to show names of other members in a space along with their current cursor location.

Try out the [live demo](https://examples.ably.dev/live-cursors) of the Live cursors.

## Running locally

- Fork or clone the [Examples Repo](https://github.com/ably-labs/realtime-examples).
- Sign up for an account on [Ably](https://ably.com/sign-up?utm_source=ably-labs&utm_medium=github&utm_campaign=live-cursors) and get an API KEY.
- Rename `.env.example` to `.env` and fill in your API KEY in the `VITE_ABLY_KEY` environment variable.
  - You could also use the `VITE_ABLY_KEY_LIVE_CURSORS` environment variable if you wanted to use different keys for different examples.
- Run `yarn` or `npm install` to install dependencies.
- Run `yarn dev` or `npm run dev` and go to http://localhost:5173/live-cursors

## Runtime Requirements

- [Node.js](https://nodejs.org/en/)
- Ably API Key
- [Yarn](https://yarnpkg.com/) (optional)

## Resources

- Learn more about how to build your own [Live cursors](https://ably.com/examples/live-cursors?utm_source=ably-labs&utm_medium=github&utm_campaign=live-cursors).
- To see what else is possible with Ably check out our other [realtime examples](https://ably.com/examples?utm_source=ably-labs&utm_medium=github&utm_campaign=avatar-stack).

_Requirements (if any)_

## Support, feedback and troubleshooting

- [Create a GitHub Issue](https://github.com/ably-labs/realtime-examples/issues)
- [Ably Spaces On GitHub](https://github.com/ably-labs/spaces)
- [Join our Discord server](https://discord.gg/q89gDHZcBK)
- [Follow us on Twitter](https://twitter.com/ablyrealtime)
- [Use our SDKs](https://github.com/ably/)
- [Visit our website](https://ably.com?utm_source=ably-labs&utm_medium=github&utm_campaign=live-cursors)

---

[![Ably logo](https://static.ably.dev/badge-black.svg?serverless-websockets-quest)](https://ably.com?utm_source=ably-labs&utm_medium=github&utm_campaign=live-cursors)
