import {
  CREATE_DEPT,
  DELETE_DEPT,
  FETCH_ALL_DEPT,
  UPDATE_DEPT,
  DEPT_END_LOADING,
  DEPT_ERROR,
  DEPT_START_LOADING,
} from '../constants/actionTypes';

export default (
  state = { error: null, isLoading: true, depts: [] },
  action
) => {
  switch (action.type) {
    case DEPT_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case DEPT_END_LOADING:
      return { ...state, isLoading: false };
    case DEPT_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case UPDATE_DEPT:
      return {
        ...state,
        depts: state.depts.map((dept) =>
          dept._id === action.payload._id ? action.payload : dept
        ),
      };
    case FETCH_ALL_DEPT:
      return { ...state, depts: action.payload };
    case CREATE_DEPT:
      return { ...state, depts: [...state.depts, action.payload] };
    case DELETE_DEPT:
      return {
        ...state,
        depts: state.depts.filter((dept) => dept._id !== action.payload),
      };
    default:
      return state;
  }
};
