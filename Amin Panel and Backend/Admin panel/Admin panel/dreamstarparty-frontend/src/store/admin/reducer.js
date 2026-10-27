import jwt_decode from "jwt-decode";
import { key } from "../../util/Config";
import { STORAGE_KEYS } from "../../util/permissions";
import { createHash } from "../../util/hash";
import setDevKey from "../../util/SetDevKey";
import setToken from "../../util/SetToken";

import { CLOSE_ADMIN_DIALOG, OPEN_ADMIN_DIALOG, SET_ADMIN, UNSET_ADMIN, UPDATE_PROFILE } from "./types";

const initialState = {
  isAuth: false,
  admin: {},
  dialog: false,
  dialogData: null,
};



const adminReducer = (state = initialState, action) => {
  let decoded;
  switch (action.type) {
    case SET_ADMIN:
      if (action.payload) {
        
        decoded = jwt_decode(action.payload);
      }
      


      
      setToken(action.payload);
      setDevKey(key);
      sessionStorage.setItem("UID", JSON.stringify(decoded));
      sessionStorage.setItem("TOKEN", action.payload);
      sessionStorage.setItem("KEY", key);
      sessionStorage.setItem("isAuth", true);
      return {
        ...state,
        isAuth: true,
        admin: decoded,
      };

    case UNSET_ADMIN:
      sessionStorage.removeItem(STORAGE_KEYS.permissions);
      sessionStorage.removeItem(STORAGE_KEYS.loginType);
      sessionStorage.removeItem(STORAGE_KEYS.flag);
      sessionStorage.removeItem("user");
      sessionStorage.clear();

      localStorage.removeItem(STORAGE_KEYS.permissions);
      localStorage.removeItem(STORAGE_KEYS.loginType);
      localStorage.removeItem(STORAGE_KEYS.flag);
      localStorage.removeItem("auth_hash");
      localStorage.clear();

      setToken(null);

      return {
        ...state,
        isAuth: false,
        admin: {},
      };

    case UPDATE_PROFILE:
      const updatedFlag = action.payload.flag !== undefined ? String(action.payload.flag) : String(state.admin.flag || false);
      const currentLoginType = sessionStorage.getItem(STORAGE_KEYS.loginType);
      const currentPermissions = sessionStorage.getItem(STORAGE_KEYS.permissions);
      if (currentLoginType && currentPermissions) {
        sessionStorage.setItem(STORAGE_KEYS.flag, updatedFlag);
        localStorage.setItem(STORAGE_KEYS.flag, updatedFlag);
        localStorage.setItem("auth_hash", createHash({ loginType: currentLoginType, permissions: currentPermissions, flag: updatedFlag }));
      }
      return {
        ...state,
        admin: {
          ...state.admin,
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          flag: action.payload.flag,
        },
      };
      case OPEN_ADMIN_DIALOG:
        return {
          ...state,
          dialog: true,
          dialogData: action.payload || null,
        };
      case CLOSE_ADMIN_DIALOG:
        return {
          ...state,
          dialog: false,
          dialogData: null,
        };
    default:
      return state;
  }
};

export default adminReducer;
