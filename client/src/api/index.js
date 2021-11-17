import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem('profile')).token
    }`;
  }

  return req;
});
const config = {
  headers: {
    'content-type': 'multipart/form-data',
  },
};
export const fetchAllLeaves = () => API.get('/leaves');
export const fetchLeaveById = (id) => API.get(`/leaves/${id}`);
export const fetchLeaveByDateRange = (dateRange) =>
  API.post(`/leaves/range`, dateRange);
export const createLeave = (newLeave) => API.post('/leaves', newLeave);
export const updateLeave = (id, updatedLeave) =>
  API.patch(`/leaves/${id}`, updatedLeave);
export const fetchLeaveRequests = (role, user, department) =>
  API.get(`/leaves/${role}/${user}/${department}`);
export const fetchUpcomingLeaves = (id) => API.get(`/leaves/upcoming/${id}`);
export const fetchLeaveHistory = (id) => API.get(`/leaves/history/${id}`);
export const fetchTodayLeaves = () => API.get('/leaves/date/today');

export const signIn = (formData) => API.post('/users/signIn', formData);
export const signUp = (formData) => API.post('/users/signUp', formData);
export const resetPassword = (email) => API.post('/users/resetPassword', email);

export const getDepts = () => API.get('/depts');
export const getDept = (id) => API.get(`depts/${id}`);
export const createDept = (newDept) => API.post('/depts', newDept);
export const deleteDept = (id) => API.delete(`/depts/${id}`);

export const createUser = (formData) => API.post('/users', formData);
export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`users/${id}`);
export const updateUser = (id, updatedUser) =>
  API.patch(`/users/${id}`, updatedUser);
export const fetchDeptUsers = (department) =>
  API.get(`users/dept/${department}`);

export const createLeaveType = (formData) => API.post('/leaveTypes', formData);
export const getLeaveTypes = () => API.get('/leaveTypes');
export const getLeaveType = (id) => API.get(`/leaveTypes/${id}`);
export const updateLeaveType = (id, updatedLeaveType) =>
  API.patch(`/leaveTypes/${id}`, updatedLeaveType);

export const createRole = (formData) => API.post('/roles', formData);
export const getRoles = () => API.get('/roles');
export const getRole = (id) => API.get(`/roles/${id}`);
export const updateRole = (id, updatedRole) =>
  API.patch(`/roles/${id}`, updatedRole);

export const fetchAllHolidays = () => API.get('/holidays');
export const fetchHolidaysByYear = (year) => API.get(`/holidays/${year}`);
export const createHoliday = (formData) => API.post('/holidays', formData);
export const updateHoliday = (id, formData) =>
  API.patch(`/holidays/${id}`, formData);

export const createTraining = (newTraining) =>
  API.post('/training', newTraining);
export const fetchAllTrainings = () => API.get('/training');
export const fetchTrainingById = (id) => API.get(`/training/${id}`);
export const updateTraining = (id, updatedTraining) =>
  API.post(`/training/${id}`, updatedTraining);
export const leaveTraining = (id, updatedTraining) =>
  API.patch(`/training/${id}`, updatedTraining);
export const fetchExtTraining = (role, user, department) =>
  API.get(`/training/ext/${role}/${user}/${department}`);
export const updateTrainingStatus = (id, updatedTraining) =>
  API.post(`/training/ext/${id}`, updatedTraining);
export const fetchExtTrainingHistory = (id) =>
  API.get(`/training/history/ext/${id}`);
export const fetchTrainingHistory = (id) => API.get(`/training/history/${id}`);
export const fetchUpcomingTraining = (id) =>
  API.get(`/training/upcoming/${id}`);
export const fetchTodayTrainings = () => API.get('/training/date/today');
