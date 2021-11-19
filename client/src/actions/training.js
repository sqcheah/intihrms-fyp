import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_TRAINING,
  FETCH_ALL_TRAINING,
  FETCH_ONE_TRAINING,
  TRAINING_START_LOADING,
  TRAINING_END_LOADING,
  TRAINING_ERROR,
  UPDATE_TRAINING,
  LEAVE_TRAINING,
  FETCH_EXT_TRAINING,
  UPDATE_TRAINING_STATUS,
  FETCH_EXT_TRAINING_HISTORY,
  FETCH_TRAINING_HISTORY,
  FETCH_UPCOMING_TRAINING,
  FETCH_TODAY_TRAINING,
  FETCH_TRAINING_COUNT,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const fetchAllTrainings = () => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchAllTrainings();
    dispatch({ type: FETCH_ALL_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      dispatch({
        type: TRAINING_ERROR,
        error: error.response.data.message,
      });
      message.error(error.response.data.message.toString());
    } else if (error.request) {
      // The request was made but no response was received
      dispatch({
        type: TRAINING_ERROR,
        error: error.request,
      });
      message.error(error.request.toString());
    } else {
      // Something happened in setting up the request that triggered an Error
      dispatch({
        type: TRAINING_ERROR,
        error: error.message,
      });
      message.error(error.message.toString());
    }
  }
};
export const fetchTrainingById = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchTrainingById(id);
    dispatch({ type: FETCH_ONE_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      dispatch({
        type: TRAINING_ERROR,
        error: error.response.data.message,
      });
      message.error(error.response.data.message.toString());
    } else if (error.request) {
      // The request was made but no response was received
      dispatch({
        type: TRAINING_ERROR,
        error: error.request,
      });
      message.error(error.request.toString());
    } else {
      // Something happened in setting up the request that triggered an Error
      dispatch({
        type: TRAINING_ERROR,
        error: error.message,
      });
      message.error(error.message.toString());
    }
  }
};
export const createTraining = (training) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.createTraining(training);
    dispatch({ type: CREATE_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      dispatch({
        type: TRAINING_ERROR,
        error: error.response.data.message,
      });
      console.log(error.response.data.message);
      console.log(error);
      message.error(error.response.data.message.toString());
    } else if (error.request) {
      // The request was made but no response was received
      dispatch({
        type: TRAINING_ERROR,
        error: error.request,
      });
      message.error(error.request.toString());
    } else {
      // Something happened in setting up the request that triggered an Error
      dispatch({
        type: TRAINING_ERROR,
        error: error.message,
      });
      message.error(error.message.toString());
    }
  }
};
export const updateTraining = (id, training) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.updateTraining(id, training);
    dispatch({ type: UPDATE_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      dispatch({
        type: TRAINING_ERROR,
        error: error.response.data.message,
      });
      console.log(error.response.data.message);
      console.log(error);
      // message.error(error.response.data.message.toString());
    } else if (error.request) {
      // The request was made but no response was received
      dispatch({
        type: TRAINING_ERROR,
        error: error.request,
      });
      message.error(error.request.toString());
    } else {
      // Something happened in setting up the request that triggered an Error
      dispatch({
        type: TRAINING_ERROR,
        error: error.message,
      });
      message.error(error.message.toString());
    }
  }
};
export const leaveTraining = (id, training) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.leaveTraining(id, training);
    dispatch({ type: LEAVE_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchExtTraining =
  (role, user, department) => async (dispatch) => {
    try {
      dispatch({ type: TRAINING_START_LOADING });
      const { data } = await api.fetchExtTraining(role, user, department);
      dispatch({ type: FETCH_EXT_TRAINING, payload: data });
      dispatch({ type: TRAINING_END_LOADING });
    } catch (error) {
      handleError(error, TRAINING_ERROR);
    }
  };
export const updateTrainingStatus = (id, training) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.updateTrainingStatus(id, training);
    dispatch({ type: UPDATE_TRAINING_STATUS, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchExtTrainingHistory = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchExtTrainingHistory(id);
    dispatch({ type: FETCH_EXT_TRAINING_HISTORY, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchTrainingHistory = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchTrainingHistory(id);
    dispatch({ type: FETCH_TRAINING_HISTORY, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchUpcomingTraining = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchUpcomingTraining(id);
    dispatch({ type: FETCH_UPCOMING_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchTodayTrainings = () => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchTodayTrainings();
    dispatch({ type: FETCH_TODAY_TRAINING, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
export const fetchTrainingCount = () => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_START_LOADING });
    const { data } = await api.fetchTrainingCount();
    dispatch({ type: FETCH_TRAINING_COUNT, payload: data });
    dispatch({ type: TRAINING_END_LOADING });
  } catch (error) {
    handleError(error, TRAINING_ERROR);
  }
};
