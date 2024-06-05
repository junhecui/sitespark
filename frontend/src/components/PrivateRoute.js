import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, token, ...rest }) => {
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
