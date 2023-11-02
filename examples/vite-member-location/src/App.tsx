import type Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import MemberLocation from "./components/MemberLocation";
import { getSpaceNameFromUrl } from "./utils/helpers";

const spaceName = getSpaceNameFromUrl();

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name={spaceName}>
      <MemberLocation />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
