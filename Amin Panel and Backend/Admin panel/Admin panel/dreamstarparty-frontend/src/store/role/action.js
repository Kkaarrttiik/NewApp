import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CLOSE_ROLE_DIALOG,
  CREATE_NEW_ROLE,
  DELETE_ROLE,
  EDIT_ROLE,
  GET_ROLES,
  OPEN_ROLE_DIALOG,
  TOGGLE_ROLE_STATUS,
} from "./types";

export const getRoles = (params = {}) => (dispatch) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `role/browseRoles?${query}` : "role/browseRoles";
  apiInstanceFetch
    .get(url)
    .then((res) => {
      if (res.status) {
        const list = Array.isArray(res.data) ? res.data : res.data?.list || [];
        const total = res.data?.total;
        dispatch({ type: GET_ROLES, payload: { data: list, total } });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const createNewRole = (payload) => (dispatch) => {
  apiInstanceFetch
    .post("role/defineRole", payload)
    .then((res) => {
      if (res.status) {
        dispatch({ type: CREATE_NEW_ROLE, payload: { data: res.data } });
        Toast("success", "Role created successfully!");
        dispatch({ type: CLOSE_ROLE_DIALOG });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const editRole = (payload) => (dispatch) => {
  apiInstanceFetch
    .patch("role/reviseRole", payload)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: EDIT_ROLE,
          payload: { data: res.data, id: payload.roleId },
        });
        Toast("success", "Role updated successfully!");
        dispatch({ type: CLOSE_ROLE_DIALOG });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const toggleRoleStatus = (roleId) => (dispatch) => {
  const url = `role/shiftRoleState?roleId=${roleId}`;
  apiInstanceFetch
    .patch(url)
    .then((res) => {
      if (res.status) {
        dispatch({ type: TOGGLE_ROLE_STATUS, payload: res.data });
        Toast("success", res.message);
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const deleteRole = (roleId) => (dispatch) => {
  apiInstanceFetch
    .delete(`role/eraseRole?roleId=${roleId}`)
    .then((res) => {
      if (res.status) {
        dispatch({ type: DELETE_ROLE, payload: roleId });
        Toast("success", "Role deleted successfully!");
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const openRoleDialog = (data) => (dispatch) => {
  dispatch({ type: OPEN_ROLE_DIALOG, payload: data });
};

export const closeRoleDialog = () => (dispatch) => {
  dispatch({ type: CLOSE_ROLE_DIALOG });
};
