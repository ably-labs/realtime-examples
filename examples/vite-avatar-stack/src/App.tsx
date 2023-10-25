import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import AvatarStack from "./components/AvatarStack";

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name="avatar-stack">
      <AvatarStack />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
