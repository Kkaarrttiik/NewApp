import axios from "axios";
import { Toast } from "../../util/Toast";
import { apiInstanceFetch } from "../../util/api";

import {
  CREATE_BD_PAYMENT_METHOD,
  DELETE_BD_PAYMENT_METHOD,
  GET_BD_PAYMENT_METHOD,
  TOGGLE_BD_PAYMENT_METHOD,
  UPDATE_BD_PAYMENT_METHOD,
} from "./types";

export const getBdPaymentMethod = (start, limit) => (dispatch) => {
  apiInstanceFetch
    .get(`bdPaymentMethod/getBDPaymentMethods?start=${start}&limit=${limit}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_BD_PAYMENT_METHOD, payload: res });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const createBdPaymentMethod = (data) => (dispatch) => {
  axios
    .post(`bdPaymentMethod/addBDPaymentMethod`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: CREATE_BD_PAYMENT_METHOD, payload: res.data.data });
        Toast("success", "Payment method added successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const updateBdPaymentMethod = (data) => (dispatch) => {
  axios
    .patch(`bdPaymentMethod/updateBDPaymentMethod`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: UPDATE_BD_PAYMENT_METHOD, payload: res.data.data });
        Toast("success", "Payment method updated successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const deleteBdPaymentMethod = (id) => (dispatch) => {
  axios
    .delete(`bdPaymentMethod/deleteBDPaymentMethod?methodId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_BD_PAYMENT_METHOD, payload: id });
        Toast("success", "Payment method deleted successfully!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const toggleBdPaymentMethod = (id) => (dispatch) => {
  axios
    .patch(`bdPaymentMethod/toggleBDPaymentMethodStatus?methodId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: TOGGLE_BD_PAYMENT_METHOD,
          payload: res.data.data._id,
        });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};
