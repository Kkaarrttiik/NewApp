import axios from "axios";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CLOSE_BROADCASTGAME_DIALOG,
  CREATE_NEW_BROADCASTGAME,
  DELETE_BROADCASTGAME,
  EDIT_BROADCASTGAME,
  GET_BROADCASTGAME,
  VIP_SWITCH_BROADCASTGAME
} from "./types";

// GET all
export const getBroadcastGame = () => (dispatch) => {
  apiInstanceFetch
    .get(`brodcastbanner/retrieveBanners?bannerType=2`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: GET_BROADCASTGAME, payload: res.data });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// VIP toggle / switch (PUT)
export const handleVIPSwitchBroadcastGame = (broadcastGameId) => (dispatch) => {
  axios
    .patch(`brodcastbanner/updateBannerStatus?bannerId=${broadcastGameId}`)
    .then((res) => {
      if (res.data.status) {
        if(res.data.data.isActive){
          Toast("success", "Broadcast game status Active!");
        }else{
          Toast("success", "Broadcast game status Deactive!");
        }
        dispatch({
          type: VIP_SWITCH_BROADCASTGAME,
          payload: res.data.data,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// CREATE (POST)
export const createNewBroadcastGame = (data) => (dispatch) => {
  axios
    .post(`brodcastbanner/uploadBanner`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Broadcast game created successfully!");
        dispatch({ type: CLOSE_BROADCASTGAME_DIALOG });
        dispatch({
          type: CREATE_NEW_BROADCASTGAME,
          payload: res.data.data,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// EDIT (PATCH)
export const editBroadcastGame = (broadcastGameId, data) => (dispatch) => {

  axios
    .patch(`brodcastbanner/updateBanner`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Broadcast game updated successfully!");
        dispatch({ type: CLOSE_BROADCASTGAME_DIALOG });
        dispatch({
          type: EDIT_BROADCASTGAME,
          payload: { data: res.data.data, id: broadcastGameId },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// DELETE
export const deleteBroadcastGame = (broadcastGameId) => (dispatch) => {
  axios
    .delete(`brodcastbanner/discardBanner?bannerId=${broadcastGameId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_BROADCASTGAME, payload: broadcastGameId });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
