import "./index.css";
import React from "react";
import App from "./routes";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);