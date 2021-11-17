import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_DEPT,
  DELETE_DEPT,
  FETCH_ALL_DEPT,
  FETCH_ONE_DEPT,
  DEPT_END_LOADING,
  DEPT_ERROR,
  DEPT_START_LOADING,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const getDepts = () => async (dispatch) => {
  try {
    dispatch({ type: DEPT_START_LOADING });
    const { data } = await api.getDepts();
    dispatch({ type: FETCH_ALL_DEPT, payload: data });
    dispatch({ type: DEPT_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, DEPT_ERROR);
  }
};
export const getDept = (id) => async (dispatch) => {
  try {
    dispatch({ type: DEPT_START_LOADING });
    const { data } = await api.getDept(id);
    dispatch({ type: FETCH_ONE_DEPT, payload: data });
    dispatch({ type: DEPT_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, DEPT_ERROR);
  }
};
export const createDept = (dept) => async (dispatch) => {
  try {
    dispatch({ type: DEPT_START_LOADING });
    const { data } = await api.createDept(dept);
    dispatch({ type: CREATE_DEPT, payload: data });
    dispatch({ type: DEPT_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, DEPT_ERROR);
  }
};
export const deleteDept = (id) => async (dispatch) => {
  try {
    dispatch({ type: DEPT_START_LOADING });
    const { data } = await api.deleteDept(id);
    dispatch({ type: DELETE_DEPT, payload: data });
    dispatch({ type: DEPT_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, DEPT_ERROR);
  }
};
