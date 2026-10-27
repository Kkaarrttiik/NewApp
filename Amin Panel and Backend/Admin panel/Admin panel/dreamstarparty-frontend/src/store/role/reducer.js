import {
  CLOSE_ROLE_DIALOG,
  CREATE_NEW_ROLE,
  DELETE_ROLE,
  EDIT_ROLE,
  GET_ROLES,
  OPEN_ROLE_DIALOG,
  TOGGLE_ROLE_STATUS,
} from "./types";

const initialState = {
  roles: [],
  total: 0,
  dialog: false,
  dialogData: null,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return {
        ...state,
        roles: action.payload.data || [],
        total: action.payload.total != null ? action.payload.total : state.total,
      };
    case CREATE_NEW_ROLE:
      return {
        ...state,
        roles: [...state.roles, action.payload.data],
      };
    case EDIT_ROLE:
      return {
        ...state,
        roles: state.roles.map((role) =>
          role._id === action.payload.id ? action.payload.data : role
        ),
      };
    case DELETE_ROLE:
      return {
        ...state,
        roles: state.roles.filter((role) => role._id !== action.payload),
      };
    case TOGGLE_ROLE_STATUS:
      return {
        ...state,
        roles: state.roles.map((role) =>
          role._id === action.payload?._id ? action.payload : role
        ),
      };
    case OPEN_ROLE_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_ROLE_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    default:
      return state;
  }
};
export default roleReducer;
