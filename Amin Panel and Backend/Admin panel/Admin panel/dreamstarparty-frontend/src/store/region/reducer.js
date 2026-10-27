import {
  CLOSE_REGION_DIALOG,
  DELETE_REGION,
  EDIT_REGION,
  GET_REGION,
  INSERT_REGION,
  OPEN_REGION_DIALOG,
  VIP_SWITCH_REGION,
} from "./type";

const initialState = {
  name: [],
  total: 0,
  dialog: false,
  dialogData: null,
};

const regionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REGION:
      return {
        ...state,
        name: action.payload.name,
        total: action.payload.total,
      };

    case INSERT_REGION:
      const data = [...state.name];
      data.unshift(action.payload);
      console.log("data", data);
      return {
        ...state,
        name: data,
      };

    case EDIT_REGION:
      return {
        ...state,
        name: state.name.map((name) => {
          if (name._id === action.payload.id) return action.payload.data;
          else return name;
        }),
      };

    case DELETE_REGION:
      return {
        ...state,
        name: state.name.filter((name) => name._id !== action.payload),
      };

    case VIP_SWITCH_REGION:
      return {
        ...state,
        name: state.name.map((item) =>
          item._id === action.payload._id
            ? { ...item, isActive: action.payload.isActive }
            : item,
        ),
      };

    case OPEN_REGION_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_REGION_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default regionReducer;
