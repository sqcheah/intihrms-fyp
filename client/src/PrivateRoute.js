import { Route, Redirect } from 'react-router-dom';
import {
  LEAVE_APPROVE,
  LEAVE_VIEW_ALL,
  ROLES_ASSIGN,
} from './constants/permissions';

//https://medium.com/@thanhbinh.tran93/private-route-public-route-and-restricted-route-with-react-router-d50b27c15f5e
function PrivateRoute({
  component: Component,
  requiredPermissions = null,
  matchAllPermissions = false,
  ...rest
}) {
  const user = JSON.parse(localStorage.getItem('profile'));
  let hasAccess = true;
  if (requiredPermissions) {
    if (matchAllPermissions) {
      hasAccess = requiredPermissions.every(
        (ai) => [LEAVE_APPROVE, ROLES_ASSIGN, LEAVE_VIEW_ALL].indexOf(ai) !== -1
      );

      console.log(hasAccess);
    } else {
      hasAccess = [LEAVE_APPROVE, ROLES_ASSIGN, LEAVE_VIEW_ALL].some(
        (ai) => requiredPermissions.indexOf(ai) !== -1
      );
    }
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        user && hasAccess ? <Component {...props} /> : <Redirect to='/auth' />
      }
    />
  );
}

export default PrivateRoute;
