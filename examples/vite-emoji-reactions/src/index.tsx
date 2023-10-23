import ReactDOM from "react-dom/client";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from "ably";

import App from "./App";
import { getSpaceNameFromUrl } from "./utils/helpers";

import "./styles/global.css";

const clientId = nanoid();
const channelName = getSpaceNameFromUrl();
const client = new Realtime.Promise({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Mismatch between react-router-dom and latest react
  // See https://github.com/remix-run/remix/issues/7514
  // @ts-ignore
  <AblyProvider client={client}>
    <App channelName={channelName} clientId={clientId} />
  </AblyProvider>,
);
