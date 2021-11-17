import {
  CREATE_HOLIDAY,
  DELETE_HOLIDAY,
  FETCH_ALL_HOLIDAY,
  UPDATE_HOLIDAY,
  HOLIDAY_END_LOADING,
  HOLIDAY_ERROR,
  HOLIDAY_START_LOADING,
  FETCH_HOLIDAY_BY_YEAR,
} from '../constants/actionTypes';

export default (
  state = { error: null, isLoading: true, holidays: [] },
  action
) => {
  switch (action.type) {
    case HOLIDAY_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case HOLIDAY_END_LOADING:
      return { ...state, isLoading: false };
    case HOLIDAY_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }
    case UPDATE_HOLIDAY:
      return {
        ...state,
        holidays: {
          ...state.holidays,
          lists: state.holidays.lists.map((holiday) =>
            holiday._id === action.payload._id ? action.payload : holiday
          ),
        },
      };
    case FETCH_HOLIDAY_BY_YEAR:
    case FETCH_ALL_HOLIDAY:
      return { ...state, holidays: action.payload };
    case CREATE_HOLIDAY:
      return {
        ...state,
        holidays: {
          ...state.holidays,
          lists: [...state.holidays.lists, action.payload],
        },
      };
    case DELETE_HOLIDAY:
      return {
        ...state,
        holidays: {
          ...state.holidays,
          lists: state.holidays.lists.filter(
            (holiday) => holiday._id !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};
