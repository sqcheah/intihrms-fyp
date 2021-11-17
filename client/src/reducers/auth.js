import {
  AUTH,
  LOGOUT,
  AUTH_END_LOADING,
  AUTH_START_LOADING,
  AUTH_ERROR,
} from '../constants/actionTypes';

const authReducer = (
  state = { error: null, isLoading: true, authData: null },
  action
) => {
  switch (action.type) {
    case AUTH_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case AUTH_END_LOADING:
      return { ...state, isLoading: false };
    case AUTH_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    default:
      return state;
  }
};
export default authReducer;
