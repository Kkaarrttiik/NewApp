import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage/index.js"; // Default storage for web
import thunk from "redux-thunk";
import rootReducer from "./index"; // Adjust the path to your root reducer
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const storage = createWebStorage("local");

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "admin"], // Specify reducers to persist
};

// Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux DevTools
const composeEnhancer =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

// Create Store
const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(thunk))
);

// Persistor for Redux Persist
const persistor = persistStore(store);

export { persistor, store };
