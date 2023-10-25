import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import LiveCursors from "./components/LiveCursors";

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name="live-cursors">
      <LiveCursors />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
