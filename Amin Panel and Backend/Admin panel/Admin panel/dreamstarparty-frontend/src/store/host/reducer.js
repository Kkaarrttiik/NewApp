import {
  BLOCK_UNBLOCK_SWITCH,
  GET_HOST
} from "./type";

const initialState = {
  host: [],
  total: 0,

};


const host = (state = initialState, action) => {

  switch (action.type) {
    case GET_HOST:
      return {
        ...state,
        host: action.payload.data,
        total: action.payload.total,
      };

    case BLOCK_UNBLOCK_SWITCH:
      return {
        ...state,
        host: state.host.map((host) => {
          if (host._id === action.payload._id)
            return {
              ...host,
              isBlock: action.payload.isBlock,
            };
          else return host;
        }),
      };

    default:
      return state;
  }
};

export default host;
