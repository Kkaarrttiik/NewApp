import axios from "axios";
import { Toast } from "../../util/Toast";
import jwt_decode from "jwt-decode";

import { apiInstanceFetch } from "../../util/api";
import { projectName } from "../../util/Config";
import { STORAGE_KEYS } from "../../util/permissions";
import { createHash } from "../../util/hash";
import { SET_ADMIN, SIGNUP_ADMIN, UNSET_ADMIN, UPDATE_PROFILE } from "./types";

export const signupAdmin = (signup) => (dispatch) => {
  return axios
    .post("/admin/signup", signup)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SIGNUP_ADMIN });
        Toast("success", "Signup Successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 10);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error?.response?.data?.message || error?.message || "An error occurred");
    });
};

export const login = (data) => (dispatch) => {
  axios
    .post("admin/login", data)
    .then((res) => {
      if (res.data.status) {
        const isStaff = !!res.data.subAdmin;
        const decoded = jwt_decode(res.data.token);
        const flag = String(decoded?.flag || false);

        if (isStaff) {
          // Staff login flow
          const subAdmin = res.data.subAdmin;
          const perms = subAdmin.permissions || res.data.permissions || [];
          const user = {
            name: subAdmin.name || "Staff",
            email: subAdmin.email || data.email,
            image: subAdmin.image,
          };
          const loginType = "staff";
          const permissionsStr = JSON.stringify(perms);

          sessionStorage.setItem(STORAGE_KEYS.loginType, loginType);
          sessionStorage.setItem(STORAGE_KEYS.permissions, permissionsStr);
          sessionStorage.setItem(STORAGE_KEYS.flag, flag);
          sessionStorage.setItem("user", JSON.stringify(user));

          localStorage.setItem(STORAGE_KEYS.loginType, loginType);
          localStorage.setItem(STORAGE_KEYS.permissions, permissionsStr);
          localStorage.setItem(STORAGE_KEYS.flag, flag);
          localStorage.setItem("auth_hash", createHash({ loginType, permissions: permissionsStr, flag }));
        } else {
          // Admin login flow
          const loginType = "ADMIN";
          const permissionsStr = JSON.stringify(res.data.permissions || []);

          sessionStorage.setItem(STORAGE_KEYS.loginType, loginType);
          sessionStorage.setItem(STORAGE_KEYS.permissions, permissionsStr);
          sessionStorage.setItem(STORAGE_KEYS.flag, flag);

          localStorage.setItem(STORAGE_KEYS.loginType, loginType);
          localStorage.setItem(STORAGE_KEYS.permissions, permissionsStr);
          localStorage.setItem(STORAGE_KEYS.flag, flag);
          localStorage.setItem("auth_hash", createHash({ loginType, permissions: permissionsStr, flag }));
        }

        Toast("success", `You have successfully logged in ${projectName}`);
        dispatch({ type: SET_ADMIN, payload: res.data.token });
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 10);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => { });
};

export const sendEmail = (data) => (dispatch) => {
  axios
    .post("admin/sendEmail", data)
    .then((res) => {
      if (res.data.status) {
        Toast(
          "success",
          "Mail has been sent successfully. Sometimes mail has been landed on your spam!",
        );
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const getProfile = () => (dispatch) => {
  const logintype = sessionStorage.getItem("loginType");
  const user = sessionStorage.getItem("UID");

  // if (logintype === "staff") {
  //   dispatch({ type: UPDATE_PROFILE, payload: user });
  //   return;
  // }

  if (logintype === "staff") {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      dispatch({ type: UPDATE_PROFILE, payload: parsedUser });
    }
    return;
  }

  apiInstanceFetch
    .get("admin/profile")
    .then((res) => {
      if (res.status) {
        dispatch({ type: UPDATE_PROFILE, payload: res.admin });
      } else {
        Toast("error", res.message);
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};

export const changePassword = (data) => (dispatch) => {
  axios
    .put("admin", data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Password changed successfully.");
        setTimeout(() => {
          dispatch({ type: UNSET_ADMIN });
          window.location.href = "/";
        }, [3000]);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const updateNameEmail = (data) => (dispatch) => {
  axios
    .patch("admin", data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Profile updated successfully.");
        dispatch({ type: UPDATE_PROFILE, payload: res.data.admin });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => Toast("error", error.message));
};

export const updateCode = (signup) => (dispatch) => {
  axios
    .patch("admin/updateCode", signup)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Purchase Code Update Successfully !");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      Toast("error", error);
    });
};
