import React, { useEffect } from 'react';
import { isTokenExpired } from '../components/utilities/utilitiesFunction.jsx';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigator = useNavigate();
    const tokenCheck = isTokenExpired(token)

    useEffect(() => {
        if (tokenCheck) {
            localStorage.removeItem('token');
            return navigator('/')
        }
    }, [tokenCheck, navigator]);

    return children;
};

export default ProtectedRoute;