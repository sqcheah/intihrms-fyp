import { Route, Redirect } from 'react-router-dom';

//https://medium.com/@thanhbinh.tran93/private-route-public-route-and-restricted-route-with-react-router-d50b27c15f5e
function PublicRoute({ component: Component, ...rest }) {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Route
      {...rest}
      render={(props) =>
        !user ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
}

export default PublicRoute;
