import api from "./api";

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.token));
    }
    return response.data.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.token));
    }
    return response.data.data
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
