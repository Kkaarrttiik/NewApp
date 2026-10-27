import "./setup/daterangepicker-init";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//store
import { Provider } from "react-redux";
import store from "./store/provider";

//axios
import axios from "axios";
import { baseURL, key } from "./util/Config";

// type
import {
  CLOSE_SPINNER_PROGRESS,
  OPEN_SPINNER_PROGRESS,
} from "./store/spinner/types";
import Spinner from "./pages/Spinner";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["key"] = key;

axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: OPEN_SPINNER_PROGRESS });
    // Real Admin
    return req;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
      // store.dispatch({ type: SET_NETWORK_ERROR });
    }
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return Promise.reject(err);
  }
);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Spinner />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
