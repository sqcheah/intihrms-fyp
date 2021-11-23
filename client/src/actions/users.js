import { message } from 'antd';
import * as api from '../api/index.js';
import {
  CREATE_USER,
  FETCH_ALL_USER,
  FETCH_DEPT_USER,
  FETCH_ONE_USER,
  UPDATE_USER,
  USER_END_LOADING,
  USER_ERROR,
  USER_START_LOADING,
} from '../constants/actionTypes';

export const getUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.getUsers();
    dispatch({ type: FETCH_ALL_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
  } catch (error) {
    dispatch({ type: USER_ERROR, error });
  }
};
export const getUser = (id) => async (dispatch) => {
  try {
    console.log('hrer', id);
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.getUser(id);
    dispatch({ type: FETCH_ONE_USER, payload: data });
    dispatch({ type: USER_END_LOADING });

    return data;
  } catch (error) {
    dispatch({ type: USER_ERROR, error });
  }
};
export const createUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.createUser(formData);
    dispatch({ type: CREATE_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
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
  } catch (error) {
    dispatch({ type: USER_ERROR, error });
  }
};

export const fetchDeptUsers = (department) => async (dispatch) => {
  try {
    dispatch({ type: USER_START_LOADING });
    const { data } = await api.fetchDeptUsers(department);
    console.log('users', data);
    //return data;
    dispatch({ type: FETCH_DEPT_USER, payload: data });
    dispatch({ type: USER_END_LOADING });
  } catch (error) {
    dispatch({ type: USER_ERROR, error });
  }
};
