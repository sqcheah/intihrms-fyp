import * as api from '../api/index.js';
import { message } from 'antd';
import {
  CREATE_HOLIDAY,
  DELETE_HOLIDAY,
  FETCH_ALL_HOLIDAY,
  FETCH_HOLIDAY_BY_YEAR,
  FETCH_ONE_HOLIDAY,
  HOLIDAY_END_LOADING,
  HOLIDAY_ERROR,
  HOLIDAY_START_LOADING,
} from '../constants/actionTypes';
import { handleError } from './error.js';

export const fetchAllHolidays = () => async (dispatch) => {
  try {
    dispatch({ type: HOLIDAY_START_LOADING });
    const { data } = await api.fetchAllHolidays();
    dispatch({ type: FETCH_ALL_HOLIDAY, payload: data });
    dispatch({ type: HOLIDAY_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, HOLIDAY_ERROR);
  }
};
export const fetchHolidaysByYear = (year) => async (dispatch) => {
  try {
    dispatch({ type: HOLIDAY_START_LOADING });
    const { data } = await api.fetchHolidaysByYear(year);
    dispatch({ type: FETCH_HOLIDAY_BY_YEAR, payload: data });
    dispatch({ type: HOLIDAY_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, HOLIDAY_ERROR);
  }
};
export const createHoliday = (formData) => async (dispatch) => {
  try {
    dispatch({ type: HOLIDAY_START_LOADING });
    const { data } = await api.createHoliday(formData);
    dispatch({ type: CREATE_HOLIDAY, payload: data });
    dispatch({ type: HOLIDAY_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, HOLIDAY_ERROR);
  }
};
export const updateHoliday = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: HOLIDAY_START_LOADING });
    const { data } = await api.updateHoliday(id, formData);
    dispatch({ type: DELETE_HOLIDAY, payload: data });
    dispatch({ type: HOLIDAY_END_LOADING });
    message.success('Success');
  } catch (error) {
    handleError(error, HOLIDAY_ERROR);
  }
};
