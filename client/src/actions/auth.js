import * as api from '../api/index.js';
import {
  AUTH,
  AUTH_END_LOADING,
  AUTH_ERROR,
  AUTH_START_LOADING,
} from '../constants/actionTypes';

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });

    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });

    navigate('/home');
  } catch (error) {
    dispatch({ type: AUTH_ERROR, error });
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });

    const { data } = await api.signUp(formData);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });

    navigate('/');
  } catch (error) {
    dispatch({ type: AUTH_ERROR, error });
  }
};

export const resetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_START_LOADING });

    const { data } = await api.resetPassword(email);
    dispatch({ type: AUTH, data });
    dispatch({ type: AUTH_END_LOADING });
  } catch (error) {
    dispatch({ type: AUTH_ERROR, error });
  }
};
