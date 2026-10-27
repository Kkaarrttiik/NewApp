import {
  CLOSE_BROADCASTGIFT_DIALOG,
  CREATE_NEW_BROADCASTGIFT,
  DELETE_BROADCASTGIFT,
  EDIT_BROADCASTGIFT,
  GET_BROADCASTGIFT,
  OPEN_BROADCASTGIFT_DIALOG,
  VIP_SWITCH_BROADCASTGIFT,
} from "./types";

const initialState = {
  broadcastgift: [],
  dialog: false,
  dialogData: null,
};

const broadcastGiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BROADCASTGIFT:
      return {
        ...state,
        broadcastgift: action.payload,
      };

    case CREATE_NEW_BROADCASTGIFT: {
      const data = [...state.broadcastgift];
      data.unshift(action.payload);
      return {
        ...state,
        broadcastgift: data,
      };
    }

    case EDIT_BROADCASTGIFT:
      return {
        ...state,
        broadcastgift: state.broadcastgift.map((item) =>
          item._id === action.payload.id ? action.payload.data : item
        ),
      };

    case DELETE_BROADCASTGIFT:
      return {
        ...state,
        broadcastgift: state.broadcastgift.filter(
          (item) => item._id !== action.payload
        ),
      };

    case VIP_SWITCH_BROADCASTGIFT:
      return {
        ...state,
        broadcastgift: state.broadcastgift.map((item) =>
          item._id === action.payload._id
            ? { ...item, isActive: action.payload.isActive }
            : item
        ),
      };

    case OPEN_BROADCASTGIFT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_BROADCASTGIFT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default broadcastGiftReducer;
