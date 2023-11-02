import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import LiveCursors from "./components/LiveCursors";
import { getSpaceNameFromUrl } from "./utils/helpers";

const spaceName = getSpaceNameFromUrl();

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name={spaceName}>
      <LiveCursors />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
