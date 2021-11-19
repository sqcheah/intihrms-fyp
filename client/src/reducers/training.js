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

export default (
  state = { error: null, isLoading: true, trainings: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_START_LOADING:
      return { ...state, isLoading: true, error: null };
    case TRAINING_END_LOADING:
      return { ...state, isLoading: false };
    case TRAINING_ERROR: {
      return { ...state, error: action.error, isLoading: false };
    }

    case FETCH_ONE_TRAINING:
      return { ...state, training: action.payload };
    case FETCH_ALL_TRAINING:
      return { ...state, trainings: action.payload };
    case CREATE_TRAINING:
      return { ...state, trainings: [...state.trainings, action.payload] };

    case UPDATE_TRAINING:
      return {
        ...state,
        training: action.payload,
      };

    case LEAVE_TRAINING:
      return {
        ...state,
        training: action.payload,
      };

    case FETCH_EXT_TRAINING:
      return { ...state, trainings: action.payload };

    case UPDATE_TRAINING_STATUS:
      return {
        ...state,
        trainings: state.trainings.map((training) =>
          training._id === action.payload._id ? action.payload : training
        ),
        training: action.payload,
      };

    case FETCH_EXT_TRAINING_HISTORY:
      return { ...state, extTrainings: action.payload };

    case FETCH_TRAINING_HISTORY:
      return { ...state, trainings: action.payload };

    case FETCH_UPCOMING_TRAINING:
      return { ...state, upcomingTraining: action.payload };

    case FETCH_TODAY_TRAINING:
      return { ...state, trainings: action.payload };

    case FETCH_TRAINING_COUNT:
      return { ...state, trainingCount: action.payload };

    default:
      return state;
  }
};
