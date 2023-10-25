import { useMemo } from "react";
import { useAbly } from "ably/react";
import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import LiveCursors from "./components/LiveCursors";

const App = () => {
  const { client } = useAbly();
  const spaces = useMemo(() => new Spaces(client), [client]);

  return (
    <SpacesProvider client={spaces}>
      <SpaceProvider name="live-cursors">
        <LiveCursors />
      </SpaceProvider>
    </SpacesProvider>
  );
};

export default App;
