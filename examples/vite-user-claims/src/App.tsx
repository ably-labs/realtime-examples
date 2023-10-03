import React, { useEffect, useState } from "react";
import { Realtime } from "ably";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { getSpaceNameFromUrl, CreateJWT } from "./utils/helpers";

import UserClaims from "./components/UserClaims";

const App = () => {
  const [channelName, setChannelName] = useState("");
  const [clientId, setClientId] = useState("");

  const ably = React.useMemo(() => {
    if (!clientId) return;

    const authCallback = (
      e: { nonce: string },
      cb: (arg0: any, arg1: string) => void,
    ) => {
      CreateJWT(
        clientId,
        import.meta.env.VITE_ABLY_KEY,
        e.nonce === "true" ? "moderator" : "user",
      ).then((key) => {
        cb(null as any, key);
      });
    };

    const ably = new Realtime.Promise({
      clientId,
      authCallback,
    });
    return ably;
  }, [clientId]);

  useEffect(() => {
    setChannelName(getSpaceNameFromUrl());
    setClientId(nanoid());
  }, []);

  if (!channelName || !clientId || !ably) return null;

  return (
    <AblyProvider client={ably}>
      <UserClaims clientId={clientId} channelName={channelName} />
    </AblyProvider>
  );
};

export default App;
