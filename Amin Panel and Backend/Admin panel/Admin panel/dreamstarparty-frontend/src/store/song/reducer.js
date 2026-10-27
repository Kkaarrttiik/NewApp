import { CREATE_NEW_SONG, DELETE_SONG, EDIT_SONG, GET_SONG } from './types';

const initialState = {
  song: [],
  total: 0,
  dialog: false,
  dialogData: null,
};

const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SONG:
      return {
        ...state,
        song: action.payload.song,
        total: action.payload.total,
      };
    case CREATE_NEW_SONG:
      const data = [...state.song];
      data.unshift(action.payload);
      return {
        ...state,
        song: data,
      };
    case EDIT_SONG:
      return {
        ...state,
        song: state.song.map((song) => {
          if (song._id === action.payload.id) return action.payload.data;
          else return song;
        }),
      };
    case DELETE_SONG:
      return {
        ...state,
        song: state.song.filter((song) => song._id !== action.payload),
      };

    default:
      return state;
  }
};

export default songReducer;
