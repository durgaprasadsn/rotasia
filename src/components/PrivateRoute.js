// Example PrivateRoute.js
import React from 'react';
import { Navigate, Routes } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const PrivateRoute = ({ component : Component, ...rest }) => {
    return (
    <Routes
        {...rest}
        render={(props) =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Navigate to="/" />
            )
        }
    />);
}

export default PrivateRoute;