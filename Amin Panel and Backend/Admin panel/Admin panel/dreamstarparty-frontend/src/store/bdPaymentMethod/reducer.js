import {
  CLOSE_BD_PAYMENT_METHOD_DIALOG,
  CREATE_BD_PAYMENT_METHOD,
  DELETE_BD_PAYMENT_METHOD,
  GET_BD_PAYMENT_METHOD,
  OPEN_BD_PAYMENT_METHOD_DIALOG,
  TOGGLE_BD_PAYMENT_METHOD,
  UPDATE_BD_PAYMENT_METHOD,
} from "./types";

const initialState = {
  bdPaymentMethod: [],
  total: 0,
  dialog: false,
  dialogData: null,
};

const bdPaymentMethodReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BD_PAYMENT_METHOD:
      return {
        ...state,
        bdPaymentMethod: action.payload.data,
        total: action.payload.total,
      };

    case CREATE_BD_PAYMENT_METHOD:
      return {
        ...state,
        bdPaymentMethod: [action.payload, ...state.bdPaymentMethod],
        total: state.total + 1,
      };

    case UPDATE_BD_PAYMENT_METHOD:
      return {
        ...state,
        bdPaymentMethod: state.bdPaymentMethod.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        ),
      };

    case DELETE_BD_PAYMENT_METHOD:
      return {
        ...state,
        bdPaymentMethod: state.bdPaymentMethod.filter(
          (item) => item._id !== action.payload,
        ),
        total: state.total - 1,
      };

    case TOGGLE_BD_PAYMENT_METHOD:
      return {
        ...state,
        bdPaymentMethod: state.bdPaymentMethod.map((item) =>
          item._id === action.payload
            ? { ...item, isActive: !item.isActive }
            : item,
        ),
      };

    case OPEN_BD_PAYMENT_METHOD_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_BD_PAYMENT_METHOD_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default bdPaymentMethodReducer;
