import {
  CLOSE_BROADCASTGAME_DIALOG,
  CREATE_NEW_BROADCASTGAME,
  DELETE_BROADCASTGAME,
  EDIT_BROADCASTGAME,
  GET_BROADCASTGAME,
  OPEN_BROADCASTGAME_DIALOG,
  VIP_SWITCH_BROADCASTGAME,
} from "./types";

const initialState = {
  broadcastgame: [],
  dialog: false,
  dialogData: null,
};

const broadcastGameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BROADCASTGAME:
      return {
        ...state,
        broadcastgame: action.payload,
      };

    case CREATE_NEW_BROADCASTGAME: {
      const data = [...state.broadcastgame];
      data.unshift(action.payload);
      return {
        ...state,
        broadcastgame: data,
      };
    }

    case EDIT_BROADCASTGAME:
      return {
        ...state,
        broadcastgame: state.broadcastgame.map((item) =>
          item._id === action.payload.id ? action.payload.data : item
        ),
      };

    case DELETE_BROADCASTGAME:
      return {
        ...state,
        broadcastgame: state.broadcastgame.filter(
          (item) => item._id !== action.payload
        ),
      };

    case VIP_SWITCH_BROADCASTGAME:
      return {
        ...state,
        broadcastgame: state.broadcastgame.map((item) =>
          item._id === action.payload._id
        ? { ...item, isActive: action.payload.isActive }
            : item
        ),
      };

    case OPEN_BROADCASTGAME_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_BROADCASTGAME_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default broadcastGameReducer;
