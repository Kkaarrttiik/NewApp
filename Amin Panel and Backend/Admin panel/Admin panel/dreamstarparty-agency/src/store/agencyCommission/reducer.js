import { GET_COMMISSIONS } from "./types";

const initialState = {
  agencyCommission: [],
  totalCommission: 0,
};

const agencyCommissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMISSIONS:
      return {
        ...state,
        agencyCommission: action.payload.data,
        totalCommission: action.payload.total,
      };

    default:
      return state;
  }
};

export default agencyCommissionReducer;
