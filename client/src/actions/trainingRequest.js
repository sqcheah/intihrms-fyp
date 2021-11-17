import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_USER,
  FETCH_ALL_USER,
  FETCH_ONE_USER,
  UPDATE_USER,
  USER_END_LOADING,
  USER_ERROR,
  USER_START_LOADING,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const getUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.getUsers();
    dispatch({ type: FETCH_ALL_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, USER_ERROR);
  }
};
export const getUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.getUser(id);
    dispatch({ type: FETCH_ONE_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
    message.success('Success');
    return data;
  } catch (error) {
    handleError(error, USER_ERROR);
  }
};
export const createUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.createUser(formData);
    dispatch({ type: CREATE_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
    message.success('Success');
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      dispatch({
        type: USER_ERROR,
        error: error.response.data.message,
      });
      message.error(error.response.data.message.toString());
    } else if (error.request) {
      // The request was made but no response was received
      dispatch({
        type: USER_ERROR,
        error: error.request,
      });
      message.error(error.request.toString());
    } else {
      // Something happened in setting up the request that triggered an Error
      dispatch({
        type: USER_ERROR,
        error: error.message,
      });
      message.error(error.message.toString());
    }
  }
};

export const updateUser = (id, user) => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.updateUser(id, user);
    dispatch({ type: UPDATE_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, USER_ERROR);
  }
};
