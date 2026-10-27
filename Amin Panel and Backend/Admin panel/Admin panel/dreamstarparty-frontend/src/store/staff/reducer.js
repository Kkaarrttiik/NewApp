import {
  CLOSE_STAFF_DIALOG,
  CREATE_STAFF,
  DELETE_STAFF,
  EDIT_STAFF,
  GET_STAFF,
  OPEN_STAFF_DIALOG,
  TOGGLE_STAFF_STATUS,
} from "./types";

const initialState = {
  staff: [],
  total: 0,
  dialog: false,
  dialogData: null,
};

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STAFF:
      return {
        ...state,
        staff: action.payload.data || [],
        total: action.payload.total != null ? action.payload.total : state.total,
      };
    case CREATE_STAFF:
      return {
        ...state,
        staff: [...state.staff, action.payload.data],
      };
    case EDIT_STAFF:
      return {
        ...state,
        staff: state.staff.map((s) =>
          s._id === action.payload.id ? action.payload.data : s
        ),
      };
    case DELETE_STAFF:
      return {
        ...state,
        staff: state.staff.filter((s) => s._id !== action.payload),
      };
    case TOGGLE_STAFF_STATUS:
      return {
        ...state,
        staff: state.staff.map((s) =>
          s._id === action.payload?._id ? action.payload : s
        ),
      };
    case OPEN_STAFF_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_STAFF_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };
    default:
      return state;
  }
};
export default staffReducer;
