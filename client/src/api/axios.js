import axios from 'axios';

const api = axios.create({
    baseURL: 'https://anything-ai-assignment-3d19-api.vercel.app/api', // or your URL
    withCredentials: true, // Important for cookies
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. Check if error is 401 (Unauthorized)
        // 2. Check if we haven't already marked this request as retried (_retry)
        if (error.response?.status === 401 && !originalRequest._retry) {

            // 🛑 STOP LOOP: If the URL failing is ALREADY the refresh-token URL, 
            // do NOT try to refresh again. Just fail.
            if (originalRequest.url.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true; // Mark as retried to prevent loops

            try {
                // Attempt to refresh the token
                await api.post('/auth/refresh');

                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, it means session is truly dead.
                // We let the error propagate so the UI can catch it and redirect.
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;