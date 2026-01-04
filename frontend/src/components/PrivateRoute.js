import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './common/Loader';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;