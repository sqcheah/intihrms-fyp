import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_LEAVE,
  FETCH_ALL_LEAVE,
  FETCH_LEAVE_BY_DATERANGE,
  FETCH_ONE_LEAVE,
  LEAVE_END_LOADING,
  LEAVE_ERROR,
  LEAVE_START_LOADING,
  UPDATE_LEAVE,
  FETCH_LEAVE_REQUESTS,
  FETCH_UPCOMING_LEAVE,
  FETCH_LEAVE_HISTORY,
  FETCH_TODAY_LEAVE,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const fetchAllLeaves = () => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.fetchAllLeaves();
    dispatch({ type: FETCH_ALL_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const fetchLeaveById = (id) => async (dispatch) => {
  try {
    console.log('test');
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.fetchLeaveById(id);
    dispatch({ type: FETCH_ONE_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
    return data;
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};

export const createLeave = (leave) => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.createLeave(leave);
    dispatch({ type: CREATE_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const updateLeave = (id, leave) => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.updateLeave(id, leave);
    dispatch({ type: UPDATE_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const fetchLeaveByDateRange = (dateRange) => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const data = await api.fetchLeaveByDateRange(dateRange);
    console.log(data);
    dispatch({ type: FETCH_LEAVE_BY_DATERANGE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const fetchLeaveRequests =
  (role, user, department) => async (dispatch) => {
    try {
      dispatch({ type: LEAVE_START_LOADING });
      const { data } = await api.fetchLeaveRequests(role, user, department);
      dispatch({ type: FETCH_LEAVE_REQUESTS, payload: data });
      dispatch({ type: LEAVE_END_LOADING });
      message.success('Success');
    } catch (error) {
      handleError(error, LEAVE_ERROR);
    }
  };
export const fetchUpcomingLeaves = (id) => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.fetchUpcomingLeaves(id);
    dispatch({ type: FETCH_UPCOMING_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const fetchLeaveHistory = (id) => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.fetchLeaveHistory(id);
    dispatch({ type: FETCH_LEAVE_HISTORY, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
export const fetchTodayLeaves = () => async (dispatch) => {
  try {
    dispatch({ type: LEAVE_START_LOADING });
    const { data } = await api.fetchTodayLeaves();
    dispatch({ type: FETCH_TODAY_LEAVE, payload: data });
    dispatch({ type: LEAVE_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, LEAVE_ERROR);
  }
};
