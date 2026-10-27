import {
  ACCEPT_BD_REDEEM,
  CLEAR_BD_REDEEM,
  CLOSE_NEW_BD_REDEEM_DIALOG,
  DECLINE_BD_REDEEM,
  GET_BD_REDEEM,
  NEW_BD_REDEEM_CREATE,
  OPEN_NEW_BD_REDEEM_DIALOG,
} from "./types";

const initialState = {
  bdRedeem: [],
  totalRedeem: 0,
  totalRevenue: 0,
  myBdRedeem: [],
  totalMyRedeem: 0,
  dialog: false,
  dialogData: null,
};

const bdRedeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_BD_REDEEM:
      return {
        ...state,
        bdRedeem: { data: [], total: 0 },
      };

    case GET_BD_REDEEM:
      return {
        ...state,
        bdRedeem: action.payload,
      };

    case ACCEPT_BD_REDEEM:
      return {
        ...state,
        bdRedeem: state?.bdRedeem?.data?.filter(
          (bdRedeem) => bdRedeem._id !== action.payload,
        ),
      };

    case DECLINE_BD_REDEEM:
      return {
        ...state,
        bdRedeem: state?.bdRedeem?.data?.filter(
          (bdRedeem) => bdRedeem._id !== action.payload,
        ),
      };

    case NEW_BD_REDEEM_CREATE:
      const data = [...state.myBdRedeem];
      data.unshift(action.payload);
      return {
        ...state,
        myBdRedeem: data,
      };

    case OPEN_NEW_BD_REDEEM_DIALOG:
      return {
        ...state,
        dialog: true,
        dialogData: action.payload || null,
      };

    case CLOSE_NEW_BD_REDEEM_DIALOG:
      return {
        ...state,
        dialog: false,
        dialogData: null,
      };

    default:
      return state;
  }
};

export default bdRedeemReducer;
