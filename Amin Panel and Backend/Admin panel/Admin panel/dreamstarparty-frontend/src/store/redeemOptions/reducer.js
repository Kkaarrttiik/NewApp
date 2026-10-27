import {
  CLOSE_REDEEM_OPT_DIALOG,
  CREATE_NEW_REDEEM_OPT,
  DELETE_REDEEM_OPT,
  EDIT_REDEEM_OPT,
  GET_REDEEM_OPT,
  GET_REDEEM_OPT_DATA,
  OPEN_REDEEM_OPT_DIALOG,
  TOGGEL_REDEEM_OPT_STATUS,
} from './types';

const initialState = {
  redeemOptions: [],
  redeemOptDropdown: [],
  dialog: false,
  dialogData: null,
};

const levelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REDEEM_OPT:
      return {
        ...state,
        redeemOptions: action.payload,
      };
    case GET_REDEEM_OPT_DATA:
      return {
        ...state,
        redeemOptDropdown: action.payload,
      };
    case CREATE_NEW_REDEEM_OPT:
      const data = [...state.redeemOptions];
      data.unshift(action.payload);
      return {
        ...state,
        redeemOptions: data,
      };
    case EDIT_REDEEM_OPT:
      return {
        ...state,
        redeemOptions: state.redeemOptions.map((redeemOptions) => {
          if (redeemOptions._id === action.payload.id)
            return action.payload.data;
          else return redeemOptions;
        }),
      };
    case TOGGEL_REDEEM_OPT_STATUS:
      return {
        ...state,
        redeemOptions: state.redeemOptions.map((redeemOptions) => {
          if (redeemOptions?._id === action.payload?._id)
            return {
              ...redeemOptions,
              isActive: action?.payload?.isActive,
            };
          else return redeemOptions;
        }),
      };
    case DELETE_REDEEM_OPT:
      return {
        ...state,
        redeemOptions: state.redeemOptions.filter(
          (redeemOptions) => redeemOptions._id !== action.payload
        ),
      };
    case OPEN_REDEEM_OPT_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };
    case CLOSE_REDEEM_OPT_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default levelReducer;
