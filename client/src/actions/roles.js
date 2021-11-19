import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_ROLE,
  FETCH_ALL_ROLE,
  FETCH_ONE_ROLE,
  UPDATE_ROLE,
  ROLE_END_LOADING,
  ROLE_ERROR,
  ROLE_START_LOADING,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const getRoles = () => async (dispatch) => {
  try {
    dispatch({ type: ROLE_START_LOADING });
    const { data } = await api.getRoles();
    dispatch({ type: FETCH_ALL_ROLE, payload: data });
    dispatch({ type: ROLE_END_LOADING });
  } catch (error) {
    handleError(error, ROLE_ERROR);
  }
};
export const getRole = (id) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_START_LOADING });
    const { data } = await api.getRole(id);
    dispatch({ type: FETCH_ONE_ROLE, payload: data });
    dispatch({ type: ROLE_END_LOADING });
  } catch (error) {
    handleError(error, ROLE_ERROR);
  }
};
export const createRole = (role) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_START_LOADING });
    const { data } = await api.createRole(role);
    dispatch({ type: CREATE_ROLE, payload: data });
    dispatch({ type: ROLE_END_LOADING });
  } catch (error) {
    handleError(error, ROLE_ERROR);
  }
};
export const updateRole = (id, role) => async (dispatch) => {
  try {
    dispatch({ type: ROLE_START_LOADING });
    const { data } = await api.updateRole(id, role);
    dispatch({ type: UPDATE_ROLE, payload: data });
    dispatch({ type: ROLE_END_LOADING });
  } catch (error) {
    handleError(error, ROLE_ERROR);
  }
};
