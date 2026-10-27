import {
  CLOSE_BD_DIALOG,
  GET_BD,
  GET_BD_DROPDOWN,
  OPEN_BD_DIALOG,
  VIP_SWITCH_BD,
} from "./type";

const initialState = {
  bdData: [],
  total: 0,
  dialog: false,
  dialogData: null,
  bdDropdown: [],
};

const bdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BD:
      return {
        ...state,
        bdData: action.payload.bdData,
        total: action.payload.total,
      };

    case GET_BD_DROPDOWN:
      return {
        ...state,
        bdDropdown: action.payload ?? [],
      };

    case VIP_SWITCH_BD:
      return {
        ...state,
        bdData: state.bdData.map((item) =>
          item._id === action.payload
            ? { ...item, isActive: !item.isActive }
            : item,
        ),
      };

    case OPEN_BD_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_BD_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default bdReducer;
