import { SpaceContextProvider } from "./components/SpacesContext";
import LiveCursors from "./components/LiveCursors";

const App = () => (
  <SpaceContextProvider example="member-location">
    <LiveCursors />
  </SpaceContextProvider>
);

export default App;
