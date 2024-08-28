
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const auth = localStorage.getItem("token");
    return auth ? element : <Navigate to="/" />;
}

export default ProtectedRoute;
