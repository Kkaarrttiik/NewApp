import axios from "axios";
import { Toast } from "../../util/Toast";
import { apiInstanceFetch } from "../../util/api";
import {
  BLOCK_UNBLOCK_SWITCH,
  INSTANT_BLOCK_UNBLOCK_SWITCH,
  EDIT_COIN,
  GET_HISTORY,
  GET_USER,
} from "./types";

export const getUser =
  (start, limit, searchValue, sDate, eDate, diamond, rcoin, uniqueId, gender, country, level, isBlock, userType) => (dispatch) => {
    let url = `user/getUsers?start=${start}&limit=${limit}&search=${searchValue}&startDate=${sDate}&endDate=${eDate}`;
    if (diamond) url += `&diamond=${diamond}`;
    if (rcoin) url += `&rcoin=${rcoin}`;
    if (uniqueId) url += `&uniqueId=${uniqueId}`;
    if (gender && gender !== "ALL") url += `&gender=${gender}`;
    if (country && country !== "ALL") url += `&country=${country}`;
    if (level && level !== "ALL") url += `&level=${level}`;
    if (isBlock && isBlock !== "ALL") url += `&isBlock=${isBlock}`;
    if (userType === "activeUser") url += `&isOnline=true`;
    if (userType === "isVIP") url += `&isVIP=true`;

    apiInstanceFetch
      .get(url)
      .then((res) => {
        if (res.status) {
          let male, female;
          if (res.maleFemale) {
            res.maleFemale.map((data) => {
              if (data._id === "female") return (female = data.gender);
              if (data._id === "male") return (male = data.gender);
            });
          }
          dispatch({
            type: GET_USER,
            payload: {
              user: res.user,
              activeUser: res.activeUser,
              total: res.total,
              male: male,
              female: female,
            },
          });
        } else {
          Toast("error", res.message);
        }
      })
      .catch((error) => Toast("error", error.message));
  };

export const handleBlockUnblockSwitch = (userId) => (dispatch) => {
  axios
    .patch(`user/blockUnblock/${userId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: BLOCK_UNBLOCK_SWITCH, payload: res.data.user });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const handleInstantBlockUnblockSwitch = (userId, action) => (dispatch) => {
  axios
    .post("user/instantBlockUser", { userId, action })
    .then((res) => {
      if (res.data.status) {
        dispatch({ 
          type: INSTANT_BLOCK_UNBLOCK_SWITCH, 
          payload: {
            _id: userId,
            isInstantBlock: action === "block"
          } 
        });
        Toast("success", res.data.message || "Update Successful!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const userHistory = (data) => (dispatch) => {
  axios
    .post(`history`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_HISTORY, payload: res.data });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editCoin = (data) => (dispatch) => {
  axios
    .post(`/user/addLessCoin`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_COIN,
          payload: { data: res.data.user, id: data.userId },
        });
        Toast("success", "Update Successful!!");
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
