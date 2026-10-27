import axios from 'axios';
import { apiInstanceFetch } from '../../util/api';
import { Toast } from '../../util/Toast';
import {
  CLOSE_LEVEL_DIALOG,
  CREATE_NEW_LEVEL,
  DELETE_LEVEL,
  EDIT_LEVEL,
  GET_LEVEL,
} from './types';

export const getLevel =
  ({ start, limit }) =>
  (dispatch) => {
    apiInstanceFetch
      .get(`level?start=${start}&limit=${limit}`)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_LEVEL,
            payload: { level: res.level, total: res.total },
          });
        } else {
          Toast('error', res.message);
        }
      })
      .catch((error) => Toast('error', error.message));
  };
export const createNewLevel = (data) => (dispatch) => {
  axios
    .post(`level`, data)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Level created successfully!');
        dispatch({ type: CLOSE_LEVEL_DIALOG });
        dispatch({ type: CREATE_NEW_LEVEL, payload: res.data.level });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const editLevel = (levelId, data) => (dispatch) => {
  axios
    .patch(`level/${levelId}`, data)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Level updated successfully!');
        dispatch({ type: CLOSE_LEVEL_DIALOG });
        dispatch({
          type: EDIT_LEVEL,
          payload: { data: res.data.level, id: levelId },
        });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const deleteLevel = (levelId) => (dispatch) => {
  axios
    .delete(`level/${levelId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_LEVEL, payload: levelId });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const AccessibleFunctionLevel = (data) => (dispatch) => {
  axios
    .patch(`level`, data)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Accessible Function update successfully!');
        dispatch({
          type: EDIT_LEVEL,
          payload: { data: res.data.level, id: res.data.level._id },
        });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
