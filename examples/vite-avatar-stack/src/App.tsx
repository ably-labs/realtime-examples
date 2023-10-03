import { SpaceContextProvider } from "./components/SpacesContext";
import AvatarStack from "./components/AvatarStack";

const App = () => (
  <SpaceContextProvider example="avatar-stack">
    <AvatarStack />
  </SpaceContextProvider>
);

export default App;
