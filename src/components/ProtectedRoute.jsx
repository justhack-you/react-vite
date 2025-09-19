import React from 'react';
import { isTokenExpired } from '../components/utilities/utilitiesFunction.jsx';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigator = useNavigate();

    console.log('token',token)
    if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        return navigator('/')
    }

    return children;
};

export default ProtectedRoute;