// ✅ globals.js runs first — jQuery and moment on window before anything else
import "./globals.js";

import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";

// Redux Store
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/provider";

// Axios Configuration
import axios from "axios";
import { baseURL, key } from "./util/Config";

// Spinner Action Types
import {
  CLOSE_SPINNER_PROGRESS,
  OPEN_SPINNER_PROGRESS,
} from "./store/spinner/types";

const token = sessionStorage.getItem("TOKEN");

// Axios Defaults
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["Authorization"] = token;
axios.defaults.headers.common["key"] = key;

// Axios Interceptors
axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: OPEN_SPINNER_PROGRESS });
    return req;
  },
  (error) => {
    console.error("Request Error:", error);
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
      console.error("Network Error:", err);
    }
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return Promise.reject(err);
  },
);

// Render App
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
