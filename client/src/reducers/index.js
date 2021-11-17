import { combineReducers } from 'redux';
import leaves from './leaves';
import auth from './auth';
import depts from './depts';
import users from './users';
import leaveTypes from './leaveTypes';
import roles from './roles';
import holidays from './holidays';
import trainings from './training';
import trainingRequest from './trainingRequest';
import { LOGOUT } from '../constants/actionTypes';

const appReducers = combineReducers({
  leaves,
  auth,
  depts,
  users,
  leaveTypes,
  roles,
  holidays,
  trainings,
  trainingRequest,
});
//https://stackoverflow.com/a/35641992
export const reducers = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducers(state, action);
};
