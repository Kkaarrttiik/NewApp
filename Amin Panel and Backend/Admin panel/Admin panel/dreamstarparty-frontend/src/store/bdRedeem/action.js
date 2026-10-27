import axios from "axios";
import { Toast } from "../../util/Toast";

import { apiInstanceFetch } from "../../util/api";
import {
  ACCEPT_BD_REDEEM,
  CLEAR_BD_REDEEM,
  DECLINE_BD_REDEEM,
  GET_BD_REDEEM,
} from "./types";

export const getBdRedeem = (type, start, limit, search) => (dispatch) => {
  apiInstanceFetch
    .get(
      `bdRedeem/getBdRedeem?type=${type}&start=${start}&limit=${limit}&search=${search ? search : ""}`,
    )
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_BD_REDEEM, payload: res });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const acceptBdRedeem = (id, bdId, type) => (dispatch) => {
  axios
    .patch(`bdRedeem/update`, { bdRedeemId: id, bdId: bdId, type: type })
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ACCEPT_BD_REDEEM, payload: id });
        Toast("success", "Accept Success!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const declineBdRedeem = (id, bdId, type, reason) => (dispatch) => {
  axios
    .patch(`bdRedeem/update`, {
      bdRedeemId: id,
      bdId: bdId,
      type: type,
      reason: reason,
    })
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DECLINE_BD_REDEEM, payload: id });
        Toast("success", "Decline Success!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const clearBdRedeem = () => (dispatch) => {
  dispatch({ type: CLEAR_BD_REDEEM });
};
