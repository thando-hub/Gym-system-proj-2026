// PersonalTrainerService.js
import api from './api';

const API_URL = '/personaltrainers';

export const trainerService = {
    getAll: async (filters = {}) => {
        const res = await api.get(API_URL, { params: filters });
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`${API_URL}/${id}`);
        return res.data;
    },
    getMyProfile: async () => {
        const res = await api.get(`${API_URL}/my-profile`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post(API_URL, data);
        return res.data;
    },
    update: async (data) => {
        const res = await api.put(API_URL, data);
        return res.data;
    },
    delete: async (id) => {
        await api.delete(`${API_URL}/${id}`);
    }
};
