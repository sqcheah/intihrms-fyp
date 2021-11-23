import {
  FETCH_ALL_NOTIFICATION,
  NOTIFICATION_END_LOADING,
  NOTIFICATION_ERROR,
  NOTIFICATION_START_LOADING,
  NOTIFICATION_SUCCESS,
} from '../constants/actionTypes';
import { handleError } from './error.js';
export default (
  state = { error: null, isLoading: true, notifications: [], success: null },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_START_LOADING:
      return { ...state, isLoading: true, error: null, success: null };
    case NOTIFICATION_END_LOADING:
      return { ...state, isLoading: false };
    case NOTIFICATION_ERROR: {
      return { ...state, error: handleError(action.error), isLoading: false };
    }
    case NOTIFICATION_SUCCESS: {
      return { ...state, success: action.payload.success };
    }

    case FETCH_ALL_NOTIFICATION:
      return { ...state, notifications: action.payload };

    default:
      return state;
  }
};
