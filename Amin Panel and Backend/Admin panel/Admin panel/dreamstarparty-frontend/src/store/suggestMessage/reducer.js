import {
  CLOSE_SG_DIALOG,
  CREATE_NEW_SUGGEST_MESSAGE,
  DELETE_SUGGEST_MESSAGE,
  EDIT_SUGGEST_MESSAGE,
  GET_SUGGEST_MESSAGE,
  OPEN_SG_DIALOG,
} from './types';

const initialState = {
  suggestMessages: [],
  dialog: false,
  dialogData: null,
};

const suggestMsgReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUGGEST_MESSAGE:
      return {
        ...state,
        suggestMessages: action.payload.data,
      };
    case CREATE_NEW_SUGGEST_MESSAGE:
      const data = [...state.suggestMessages];
      data.unshift(action.payload);
      return {
        ...state,
        suggestMessages: data,
      };
    case EDIT_SUGGEST_MESSAGE:
      return {
        ...state,
        suggestMessages: state.suggestMessages.map((msg) => {
          if (msg._id === action.payload.id) return action.payload.data;
          else return msg;
        }),
      };
    case DELETE_SUGGEST_MESSAGE:
      return {
        ...state,
        suggestMessages: state.suggestMessages.filter((msg) => msg._id !== action.payload),
      };
    case OPEN_SG_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_SG_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default suggestMsgReducer;
