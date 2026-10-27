import axios from 'axios';
import { apiInstanceFetch } from '../../util/api';
import { Toast } from '../../util/Toast';
import { CREATE_NEW_SONG, DELETE_SONG, EDIT_SONG, GET_SONG } from './types';

export const getSong =
  ({ start, limit }) =>
  (dispatch) => {
    apiInstanceFetch
      .get(`song?start=${start}&limit=${limit}`)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_SONG,
            payload: { song: res.song, total: res.total },
          });
        } else {
          Toast('error', res.message);
        }
      })
      .catch((error) => Toast('error', error.message));
  };
export const createNewSong = (data) => (dispatch) => {
  axios
    .post(`song`, data)
    .then((res) => {
      if (res.data.status) {
        Toast('success', 'Song created successfully!');
        dispatch({ type: CREATE_NEW_SONG, payload: res.data.song });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const editSong = (data, songId) => (dispatch) => {
  axios
    .patch(`song/${songId}`, data)
    .then((res) => {
      if (res.data.status) {
        sessionStorage.removeItem('SongDetail');
        Toast('success', 'Song updated successfully!');
        dispatch({
          type: EDIT_SONG,
          payload: { data: res.data.song, id: songId },
        });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => Toast('error', error.message));
};
export const deleteSong = (songId) => (dispatch) => {
  axios
    .delete(`song/${songId}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: DELETE_SONG, payload: songId });
      } else {
        Toast('error', res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
