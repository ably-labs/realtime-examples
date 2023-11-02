import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import ComponentLocking from "./components/ComponentLocking";
import { getSpaceNameFromUrl } from "./utils/helpers";

const spaceName = getSpaceNameFromUrl();

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name={spaceName}>
      <ComponentLocking />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
