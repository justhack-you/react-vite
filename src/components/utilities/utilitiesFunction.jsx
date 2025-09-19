import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

export const validationCheck = (res) => {
    res.data.forEach((error) => {
        toast.error(error.msg);
    });
}

export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Invalid token:', error);
        return true;
    }
}

export const getTokenData = (token) => {
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};