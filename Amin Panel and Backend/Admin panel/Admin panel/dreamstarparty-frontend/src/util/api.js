import { store } from "../store/provider";
import {
  CLOSE_SPINNER_PROGRESS,
  OPEN_SPINNER_PROGRESS,
} from "../store/spinner/types";
import { baseURL, key } from "./Config";

export const openSpinner = () => {
  return store.dispatch({ type: OPEN_SPINNER_PROGRESS });
};

export const closeSpinner = () => {
  return store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
};
const getHeaders = () => {
  const token = sessionStorage.getItem("TOKEN");
  const headers = {
    "Content-Type": "application/json",
    key: `${key}`,
  };
  
  // Only add Authorization header if token exists
  if (token) {
    headers.Authorization = token;
  }
  
  return headers;
};

export const apiInstanceFetch = {
  baseURL: `${baseURL}`, // Set your default base URL here

  get: (url) => {
    openSpinner();
    return fetch(`${apiInstanceFetch?.baseURL}${url}`, {
      method: "GET",
      headers: getHeaders(),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  post: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  patch: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  put: (url, data) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },

  delete: (url) => {
    openSpinner();
    return fetch(`${apiInstanceFetch.baseURL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    })
      .then(handleErrors)
      .finally(() => closeSpinner());
  },
};

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response?.status}`);
  }
  return response.json();
}
