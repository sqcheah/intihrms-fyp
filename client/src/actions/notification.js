import {
  FETCH_ALL_NOTIFICATION,
  NOTIFICATION_END_LOADING,
  NOTIFICATION_ERROR,
  NOTIFICATION_START_LOADING,
} from '../constants/actionTypes';
import * as api from '../api/index.js';
export const getNotificationsById = (id) => async (dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_START_LOADING });
    const { data } = await api.getNotificationsById(id);
    dispatch({ type: FETCH_ALL_NOTIFICATION, payload: data });
    dispatch({ type: NOTIFICATION_END_LOADING });
    return data;
  } catch (error) {
    dispatch({ type: NOTIFICATION_ERROR, error });
  }
};
