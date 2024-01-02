import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "../src/styles/feather.css";
import "../src/styles/main.css";
import "../src/styles/style.css";
import "../src/styles/chat.css";
import "../src/styles/tutor-schedule.css";
import "../src/styles/guppy-icon.css";
import App from "./App";

// import store from "./redux/ store";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers/rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { ToastContainer } from "react-toastify";
import { WebSocketProvider } from "./webSocketContext";
const { PUBLIC_URL } = process.env;

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <WebSocketProvider>
    <Provider store={store}>
      <BrowserRouter basename={PUBLIC_URL}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </WebSocketProvider>
  // </React.StrictMode>
);
