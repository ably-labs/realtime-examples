import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import ComponentLocking from "./components/ComponentLocking";

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name="component-locking">
      <ComponentLocking />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
