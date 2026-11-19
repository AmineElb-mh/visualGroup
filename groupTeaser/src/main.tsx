import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FeedProvider } from "./feed";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FeedProvider>
      <App />
    </FeedProvider>
  </React.StrictMode>,
);
