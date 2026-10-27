import {
  CLOSE_STICKER_DIALOG,
  CREATE_NEW_STICKER,
  DELETE_STICKER,
  EDIT_STICKER,
  GET_STICKER,
  OPEN_STICKER_DIALOG,
} from "./types";

const initialState = {
  sticker: [],
  dialog: false,
  dialogData: null,
};

const stickerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STICKER:
      return {
        ...state,
        sticker: action.payload,
      };
    case CREATE_NEW_STICKER:
      const data = [...action.payload,...state.sticker];
      return {
        ...state,
        sticker: data,
      };
    case EDIT_STICKER:
      return {
        ...state,
        sticker: state.sticker.map((sticker) => {
          if (sticker._id === action.payload.id) return action.payload.data;
          else return sticker;
        }),
      };
    case DELETE_STICKER:
      return {
        ...state,
        sticker: state.sticker.filter(
          (sticker) => sticker._id !== action.payload
        ),
      };
    case OPEN_STICKER_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_STICKER_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default stickerReducer;
