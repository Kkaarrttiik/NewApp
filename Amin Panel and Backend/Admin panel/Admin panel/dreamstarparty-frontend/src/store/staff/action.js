import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CLOSE_STAFF_DIALOG,
  DELETE_STAFF,
  GET_STAFF,
  OPEN_STAFF_DIALOG
} from "./types";

export const getStaff =
  (params = {}) =>
  (dispatch) => {
    const { start = 1, limit = 10 } = params;
    const query = new URLSearchParams({ start, limit }).toString();
    const url = `subAdmin/scanSubAdmins?${query}`;
    apiInstanceFetch
      .get(url)
      .then((res) => {
        if (res.status) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data?.list || [];
          const total = res.total != null ? res.total : res.data?.total;
          dispatch({ type: GET_STAFF, payload: { data: list, total } });
        } else {
          Toast("error", res.message || "Failed to fetch staff");
        }
      })
      .catch((error) =>
        Toast("error", error.message || "Failed to fetch staff"),
      );
  };

export const createStaff = (payload) => (dispatch) => {
  apiInstanceFetch
    .post("subAdmin/enrollSubAdmin", payload)
    .then((res) => {
      if (res.status) {
        // dispatch({ type: CREATE_STAFF, payload: { data: res.subAdmin } });
        Toast("success", "Staff created successfully!");
        dispatch({ type: CLOSE_STAFF_DIALOG });
        dispatch(getStaff({ start: 1, limit: 10 }));
      } else {
        Toast("error", res.message || "Failed to create staff");
      }
    })
    .catch((error) =>
      Toast("error", error.message || "Failed to create staff"),
    );
};

export const editStaff = (payload) => (dispatch) => {
  apiInstanceFetch
    .patch("subAdmin/reshapeSubAdmin", payload)
    .then((res) => {
      if (res.status) {
        // dispatch({
        //   type: EDIT_STAFF,
        //   payload: { data: res.data, id: payload.subAdminId },
        // });
        dispatch(getStaff({ start: 1, limit: 10 }));
        Toast("success", "Staff updated successfully!");
        dispatch({ type: CLOSE_STAFF_DIALOG });
      } else {
        Toast("error", res.message || "Failed to update staff");
      }
    })
    .catch((error) =>
      Toast("error", error.message || "Failed to update staff"),
    );
};

export const toggleStaffStatus = (subadminId) => (dispatch) => {
  const url = `subAdmin/alterSubAdminState?subAdminId=${subadminId}`;
  apiInstanceFetch
    .patch(url)
    .then((res) => {
      if (res.status) {
        // dispatch({ type: TOGGLE_STAFF_STATUS, payload: res.data });
        dispatch(getStaff({ start: 1, limit: 10 }));
        Toast("success", res.message);
      } else {
        Toast("error", res.message || "Failed to update status");
      }
    })
    .catch((error) =>
      Toast("error", error.message || "Failed to update status"),
    );
};

export const deleteStaff = (subadminId) => (dispatch) => {
  apiInstanceFetch
    .delete(`subAdmin/purgeSubAdmin?subAdminId=${subadminId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: DELETE_STAFF, payload: subadminId });
        Toast("success", "Staff deleted successfully!");
      } else {
        Toast("error", res.message || "Failed to delete staff");
      }
    })
    .catch((error) =>
      Toast("error", error.message || "Failed to delete staff"),
    );
};

export const openStaffDialog = (data) => (dispatch) => {
  dispatch({ type: OPEN_STAFF_DIALOG, payload: data });
};

export const closeStaffDialog = () => (dispatch) => {
  dispatch({ type: CLOSE_STAFF_DIALOG });
};
