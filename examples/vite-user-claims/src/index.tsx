import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/container.css";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Mismatch between react-router-dom and latest react
  // See https://github.com/remix-run/remix/issues/7514
  // @ts-ignore
  <App />
);
