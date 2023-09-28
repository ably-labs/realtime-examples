import { SpaceContextProvider } from "./components/SpacesContext";
import MemberLocation from "./components/MemberLocation";

import "./styles/styles.css";

const App = () => (
  <SpaceContextProvider example="member-location">
    <MemberLocation />
  </SpaceContextProvider>
);

export default App;
