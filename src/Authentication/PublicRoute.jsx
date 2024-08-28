// PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const auth = localStorage.getItem("token");
    return auth ? <Navigate to="/dashboard" /> : element;
}

export default PublicRoute;
