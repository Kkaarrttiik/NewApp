import { GET_REPORTED_USER } from "./types";

const initialState = {
  reportedUser: [],
  total : 0
};

const ReportedUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORTED_USER:
      return {
        ...state,
        reportedUser: action.payload.report,
        total: action.payload.total,
      };
    default:
      return state;
  }
};

export default ReportedUserReducer;
