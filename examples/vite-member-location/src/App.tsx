import type Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import MemberLocation from "./components/MemberLocation";

import "./styles/styles.css";

const App = ({ spaces }: { spaces: Spaces }) => (
  <SpacesProvider client={spaces}>
    <SpaceProvider name="member-location">
      <MemberLocation />
    </SpaceProvider>
  </SpacesProvider>
);

export default App;
