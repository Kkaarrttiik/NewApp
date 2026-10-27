import axios from 'axios';
import { apiInstanceFetch } from '../../util/api';
import { Toast } from '../../util/Toast';
import {
  CLOSE_SG_DIALOG,
  CREATE_NEW_SUGGEST_MESSAGE,
  DELETE_SUGGEST_MESSAGE,
  EDIT_SUGGEST_MESSAGE,
  GET_SUGGEST_MESSAGE,
} from './types';

export const getSuggestedMsgs =
  () =>
    (dispatch) => {
      apiInstanceFetch
        .get(`suggestedMessage/getAllSuggestedMessages`)
        .then((res) => {
          if (res.status) {
            dispatch({
              type: GET_SUGGEST_MESSAGE,
              payload: { data: res.data },
            });
          } else {
            Toast('error', res.message);
          }
        })
        .catch((error) => Toast('error', error.message));
    };

export const createNewSuggestMsg = (data) => (dispatch) => {
  axios
    .post(`suggestedMessage/addSuggestedMessage?message=${data}`)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Suggested Message created successfully!');
        dispatch({ type: CLOSE_SG_DIALOG });
        dispatch({ type: CREATE_NEW_SUGGEST_MESSAGE, payload: res.data.data });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const editSuggestMsg = (msgId, data) => (dispatch) => {
  axios
    .patch(`suggestedMessage/updateSuggestedMessage?id=${msgId}&message=${data}`)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Suggested Message updated successfully!');
        dispatch({ type: CLOSE_SG_DIALOG });
        dispatch({
          type: EDIT_SUGGEST_MESSAGE,
          payload: { data: res.data.data, id: msgId },
        });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const deleteSuggestMsg = (msgId) => (dispatch) => {
  axios
    .delete(`suggestedMessage/deleteSuggestedMessage?id=${msgId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_SUGGEST_MESSAGE, payload: msgId });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
