import {
  CREATE_USER,
  FETCH_ALL_USER,
  FETCH_ONE_USER,
  UPDATE_USER,
  USER_END_LOADING,
  USER_ERROR,
  USER_START_LOADING,
  FETCH_DEPT_USER,
} from '../constants/actionTypes';

export default (state = { users: [], user: {} }, action) => {
  switch (action.type) {
    case USER_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case USER_END_LOADING:
      return { ...state, isLoading: false };
    case USER_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case FETCH_ONE_USER:
      return { ...state, user: action.payload };
    case FETCH_ALL_USER:
      return { ...state, users: action.payload };
    case CREATE_USER:
      return { ...state, users: [...state.users, action.payload] };

    case FETCH_DEPT_USER:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};
