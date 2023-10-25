import { useMemo } from "react";
import { useAbly } from "ably/react";
import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import ComponentLocking from "./components/ComponentLocking";

import "./styles/styles.css";

const App = () => {
  const { client } = useAbly();
  const spaces = useMemo(() => new Spaces(client), [client]);

  return (
    <SpacesProvider client={spaces}>
      <SpaceProvider name="component-locking">
        <ComponentLocking />
      </SpaceProvider>
    </SpacesProvider>
  );
};

export default App;
