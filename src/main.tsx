import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from "ably";

import Layout from "./components/Layout";
import Home from "./routes/Home";
import LiveCursors from "./routes/LiveCursors";
import AvatarStack from "./routes/AvatarStack";
import EmojiReactions from "./routes/EmojiReactions";
import UserClaims from "./routes/UserClaims";
import MemberLocation from "./routes/MemberLocation";
import ComponentLocking from "./routes/ComponentLocking";

import "./styles/tailwind.css";
import "./styles/container.css";

const client = new Realtime.Promise({
  clientId: nanoid(),
  key: import.meta.env.VITE_ABLY_KEY,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Mismatch between react-router-dom and latest react
  // See https://github.com/remix-run/remix/issues/7514
  // @ts-ignore
  <AblyProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/live-cursors" element={<LiveCursors />} />
          <Route path="/component-locking" element={<ComponentLocking />} />
          <Route path="/member-location" element={<MemberLocation />} />
          <Route path="/avatar-stack" element={<AvatarStack />} />
          <Route path="/emoji-reactions" element={<EmojiReactions />} />
          <Route path="/user-claims" element={<UserClaims />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AblyProvider>,
);
