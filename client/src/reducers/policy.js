import {
  CREATE_POLICY,
  FETCH_ALL_POLICY,
  FETCH_ONE_POLICY,
  UPDATE_POLICY,
  POLICY_END_LOADING,
  POLICY_ERROR,
  POLICY_START_LOADING,
} from '../constants/actionTypes';

export default (
  state = { error: null, isLoading: true, policies: [] },
  action
) => {
  switch (action.type) {
    case POLICY_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case POLICY_END_LOADING:
      return { ...state, isLoading: false };
    case POLICY_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case UPDATE_POLICY:
      return {
        ...state,
        policies: state.policies.map((policy) =>
          policy._id === action.payload._id ? action.payload : policy
        ),
      };
    case FETCH_ONE_POLICY:
      return { ...state, policy: action.payload };
    case FETCH_ALL_POLICY:
      return { ...state, policies: action.payload };
    case CREATE_POLICY:
      return { ...state, policies: [...state.policies, action.payload] };
    default:
      return state;
  }
};
