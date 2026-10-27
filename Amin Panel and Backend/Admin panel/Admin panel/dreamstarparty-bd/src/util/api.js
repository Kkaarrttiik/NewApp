import axios from "axios";
import { store } from "../app/store";
import { setBdInvalid } from "../app/store/bdSlice";
import { baseURL, key } from "./config";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    key,
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Read from Redux first, fallback to localStorage
  const bdId = store.getState().bd.bdId || localStorage.getItem("bdId");
  if (bdId) {
    config.params = {
      ...config.params,
      bdId,
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (!data.status) {
      if (
        data.message === "Invalid BD ID." ||
        data.error === "Unauthorized Access"
      ) {
        store.dispatch(setBdInvalid("invalid"));
        throw new Error("Invalid BD ID");
      }
      if (data.message === "BD ID is required.") {
        store.dispatch(setBdInvalid("missing"));
        throw new Error("BD ID is required");
      }
    }

    return data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export async function apiRequest(endpoint, config = {}) {
  return axiosInstance({
    url: endpoint,
    method: config.method || "GET",
    ...config,
  });
}
