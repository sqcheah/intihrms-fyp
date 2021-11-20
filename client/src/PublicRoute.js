import { Route, Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('profile'));
  return user ? <Navigate to='/' replace /> : children;
}

export default PublicRoute;
