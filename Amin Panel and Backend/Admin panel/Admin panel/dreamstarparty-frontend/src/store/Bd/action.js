import axios from "axios";
import { Toast } from "../../util/Toast";
import {
  CLOSE_BD_DIALOG,
  GET_BD,
  VIP_SWITCH_BD
} from "./type";

import { apiInstanceFetch } from "../../util/api";

export const getBd = (obj) => (dispatch) => {
  apiInstanceFetch
    .get(`bd/index?start=${obj?.start || 1}&limit=${obj?.limit || 10}`)
    .then((res) => {
      dispatch({
        type: GET_BD,
        payload: { bdData: res.data, total: res.total },
      });
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const insertBd = (data) => (dispatch) => {
  axios
    .post("bd/store", data)
    .then((res) => {
      console.log(res);
      if (res.data.status) {
        dispatch(getBd());
        Toast("success", "Insert Region Successfully");
        dispatch({ type: CLOSE_BD_DIALOG });
      } else {
        Toast("error", res.data.message);
        dispatch({ type: CLOSE_BD_DIALOG });
        return;
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const updateBd = (id, data) => (dispatch) => {
  axios
    .patch(`bd/update?bdId=${id}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch(getBd());
        dispatch({ type: CLOSE_BD_DIALOG });
      }
    })
    .catch((error) => {
      Toast("error", error.message);
    });
};

export const handleVIPSwitchBd = (id) => (dispatch) => {
  axios
    .patch(`bd/activeOrNot?bdId=${id}`)
    .then((res) => {
      console.log(res.data);
      if (res.data.status) {
        Toast("success", res.data.message);

        dispatch({
          type: VIP_SWITCH_BD,
          payload: id,
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

// export const deleteRegion = (id) => (dispatch) => {
//   axios
//     .delete(`region/destroy?regionId=${id}`)
//     .then((res) => {
//       if (res.data.status) {
//         dispatch({ type: DELETE_REGION, payload: id });
//       }
//     })
//     .catch((error) => {
//       Toast("error", error.message);
//     });
// };
