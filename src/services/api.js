const BASE_URL = 'https://dummyjson.com';

const handleResponse = async (response) => {
    if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error('Something went wrong. Please try again.');
    }
    return response.json();
};

export const api = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);
            return handleResponse(response);
        } catch (error) {
            console.error('Network Error:', error);
            throw new Error('Network error. Please check your connection.');
        }
    },
};

export const userService = {
    getAll: (limit = 10, skip = 0) => api.get(`/users?limit=${limit}&skip=${skip}&select=firstName,lastName,email,image,role,company`),
    search: (query) => api.get(`/users/search?q=${query}&select=firstName,lastName,email,image,role,company`),
};

// Order CRUD + status workflow lives in orderService.ts (TypeScript)
export { orderService } from './orderService';
