import { useMemo } from "react";
import { useAbly } from "ably/react";
import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import MemberLocation from "./components/MemberLocation";

import "./styles/styles.css";

const App = () => {
  const { client } = useAbly();
  const spaces = useMemo(() => new Spaces(client), [client]);

  return (
    <SpacesProvider client={spaces}>
      <SpaceProvider name="member-location">
        <MemberLocation />
      </SpaceProvider>
    </SpacesProvider>
  );
};

export default App;
