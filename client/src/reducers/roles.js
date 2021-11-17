import {
  CREATE_ROLE,
  FETCH_ALL_ROLE,
  FETCH_ONE_ROLE,
  UPDATE_ROLE,
  ROLE_END_LOADING,
  ROLE_ERROR,
  ROLE_START_LOADING,
} from '../constants/actionTypes';

export default (
  state = { error: null, isLoading: true, roles: [] },
  action
) => {
  switch (action.type) {
    case ROLE_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case ROLE_END_LOADING:
      return { ...state, isLoading: false };
    case ROLE_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case UPDATE_ROLE:
      return {
        ...state,
        roles: state.roles.map((role) =>
          role._id === action.payload._id ? action.payload : role
        ),
      };
    case FETCH_ONE_ROLE:
      return { ...state, role: action.payload };
    case FETCH_ALL_ROLE:
      return { ...state, roles: action.payload };
    case CREATE_ROLE:
      return { ...state, roles: [...state.roles, action.payload] };
    default:
      return state;
  }
};
