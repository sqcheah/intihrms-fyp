import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_LEAVETYPE,
  FETCH_ALL_LEAVETYPE,
  FETCH_ONE_LEAVETYPE,
  UPDATE_LEAVETYPE,
  LEAVETYPE_END_LOADING,
  LEAVETYPE_ERROR,
  LEAVETYPE_START_LOADING,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const getLeaveTypes = () => async (dispatch) => {
  try {
    dispatch({ type: LEAVETYPE_START_LOADING });
    const { data } = await api.getLeaveTypes();
    dispatch({ type: FETCH_ALL_LEAVETYPE, payload: data });
    dispatch({ type: LEAVETYPE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVETYPE_ERROR);
  }
};
export const getLeaveType = (id) => async (dispatch) => {
  try {
    dispatch({ type: LEAVETYPE_START_LOADING });
    const { data } = await api.getLeaveType(id);
    dispatch({ type: FETCH_ONE_LEAVETYPE, payload: data });
    dispatch({ type: LEAVETYPE_END_LOADING });
    message.success('Success');
    return data;
  } catch (error) {
    handleError(error, LEAVETYPE_ERROR);
  }
};
export const createLeaveType = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LEAVETYPE_START_LOADING });
    const { data } = await api.createLeaveType(formData);
    dispatch({ type: CREATE_LEAVETYPE, payload: data });
    dispatch({ type: LEAVETYPE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVETYPE_ERROR);
  }
};

export const updateLeaveType = (id, leaveType) => async (dispatch) => {
  try {
    dispatch({ type: LEAVETYPE_START_LOADING });
    const { data } = await api.updateLeaveType(id, leaveType);
    dispatch({ type: UPDATE_LEAVETYPE, payload: data });
    dispatch({ type: LEAVETYPE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVETYPE_ERROR);
  }
};
