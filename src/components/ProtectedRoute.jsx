import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const { isAuthenticated, token } = useSelector((state) => state);

    console.log('>>>>', state)

    if (!isAuthenticated || !token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

// export default ProtectedRoute;