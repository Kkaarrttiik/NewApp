import axios from "axios";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CLOSE_REGION_DIALOG,
  DELETE_REGION,
  EDIT_REGION,
  GET_REGION,
  INSERT_REGION,
  VIP_SWITCH_REGION,
} from "./type";

export const getRegion =
  ({ start, limit }) =>
  (dispatch) => {
    apiInstanceFetch
      .get(`region/index?start=${start}&limit=${limit}&search=`)
      .then((res) => {
        dispatch({
          type: GET_REGION,
          payload: { name: res.data, total: res.total },
        });
      })
      .catch((error) => {
        Toast("error", error.message);
      });
  };

export const insertRegion = (data) => (dispatch) => {
  axios
    .post(`region/store`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: INSERT_REGION, payload: res.data.data });
        Toast("success", "Insert Region Successfully");
        dispatch({ type: CLOSE_REGION_DIALOG });
      } else {
        Toast("error", res.data.message);
        dispatch({ type: CLOSE_REGION_DIALOG });
        return;
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const updateRegion = (data, id) => (dispatch) => {
  axios
    .patch(`region/update`, { ...data, regionId: id })
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: EDIT_REGION,
          payload: { data: res.data.data, id: id },
        });
        Toast("success", "Update Region Successfully");
        dispatch({ type: CLOSE_REGION_DIALOG });
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const deleteRegion = (id) => (dispatch) => {
  axios
    .delete(`region/destroy?regionId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_REGION, payload: id });
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const handleVIPSwitchRegion = (id) => (dispatch) => {
  axios
    .patch(`region/activeOrNot?regionId=${id}`)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        if (res.data.data.isActive) {
          Toast("success", "Broadcast game status Active!");
        } else {
          Toast("success", "Broadcast game status Deactive!");
        }
        dispatch({
          type: VIP_SWITCH_REGION,
          payload: res.data.data,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};
