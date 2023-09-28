import { SpaceContextProvider } from "./components/SpacesContext";
import ComponentLocking from "./components/ComponentLocking";

import "./styles/styles.css";

const App = () => (
  <SpaceContextProvider example="component-locking">
    <ComponentLocking />
  </SpaceContextProvider>
);

export default App;
