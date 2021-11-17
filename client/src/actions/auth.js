import * as api from '../api/index.js';
import { message } from 'antd';
import {
  AUTH,
  AUTH_END_LOADING,
  AUTH_START_LOADING,
  AUTH_ERROR,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const signIn = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });
    message.success('Success');
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });
    message.success('Success');

    history.push('/');
  } catch (error) {
    handleError(error, AUTH_ERROR);
  }
};

export const signUp = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });
    message.success('Success');
    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });
    message.success('Success');

    history.push('/');
  } catch (error) {
    handleError(error, AUTH_ERROR);
  }
};

export const resetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });
    message.success('Success');
    const { data } = await api.resetPassword(email);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, AUTH_ERROR);
  }
};
