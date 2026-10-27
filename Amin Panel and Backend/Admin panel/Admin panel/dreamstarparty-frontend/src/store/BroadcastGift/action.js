import axios from "axios";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CLOSE_BROADCASTGIFT_DIALOG,
  CREATE_NEW_BROADCASTGIFT,
  DELETE_BROADCASTGIFT,
  EDIT_BROADCASTGIFT,
  GET_BROADCASTGIFT,
  VIP_SWITCH_BROADCASTGIFT
} from "./types";

// GET all
export const getBroadcastGift = () => (dispatch) => {
  apiInstanceFetch
    .get(`brodcastbanner/retrieveBanners?bannerType=1`)
    .then((res) => {
      if (res.status) {
        // keep same response-shape semantics as banner: res.status / res.banner
        dispatch({ type: GET_BROADCASTGIFT, payload: res.data });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// VIP toggle / switch (PUT)
export const handleVIPSwitchBroadcastGift = (broadcastGiftId) => (dispatch) => {
  axios
    .patch(`brodcastbanner/updateBannerStatus?bannerId=${broadcastGiftId}`)
    .then((res) => {
      if (res.data.status) {
         if(res.data.data.isActive){
          Toast("success", "Broadcast game status Active!");
        }else{
          Toast("success", "Broadcast game status Deactive!");
        }
        dispatch({
          type: VIP_SWITCH_BROADCASTGIFT,
          payload: res.data.data,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// CREATE (POST)
export const createNewBroadcastGift = (data) => (dispatch) => {
  axios
    .post(`brodcastbanner/uploadBanner`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Broadcast gift created successfully!");
        dispatch({ type: CLOSE_BROADCASTGIFT_DIALOG });
        dispatch({
          type: CREATE_NEW_BROADCASTGIFT,
          payload: res.data.data,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// EDIT (PATCH)
export const editBroadcastGift = (broadcastGiftId, data) => (dispatch) => {
  axios
    .patch(`brodcastbanner/updateBanner/`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Broadcast gift updated successfully!");
        dispatch({ type: CLOSE_BROADCASTGIFT_DIALOG });
        dispatch({
          type: EDIT_BROADCASTGIFT,
          payload: { data: res.data.data, id: broadcastGiftId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// DELETE
export const deleteBroadcastGift = (broadcastGiftId) => (dispatch) => {
  axios
    .delete(`brodcastbanner/discardBanner?bannerId=${broadcastGiftId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_BROADCASTGIFT, payload: broadcastGiftId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
