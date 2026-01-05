import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // 1. Try to hit a lightweight endpoint. 
                // ideally GET /auth/verify or GET /auth/me
                // If you don't have one, use any endpoint that requires login like '/users/me'
                await api.get('/auth/verify');

                setIsAuthenticated(true);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                // If api call fails (and interceptor couldn't refresh), user is not logged in
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    if (isLoading) {
        return <div>Loading app...</div>; // Or your Spinner component
    }

    // If logged in, render the child route (Outlet). If not, redirect to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;