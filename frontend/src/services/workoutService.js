import api from './api';

// Workout Plans
export const workoutPlanService = {
    getAll: async () => {
        const res = await api.get('/workoutplans');
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/workoutplans/${id}`);
        return res.data;
    },
    getByMember: async (memberId) => {
        const res = await api.get(`/workoutplans/member/${memberId}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/workoutplans', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/workoutplans/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        await api.delete(`/workoutplans/${id}`);
    }
};

// Workout Tasks
export const workoutTaskService = {
    getAll: async () => {
        const res = await api.get('/workouttasks');
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/workouttasks/${id}`);
        return res.data;
    },
    getByPlan: async (planId) => {
        const res = await api.get(`/workouttasks/plan/${planId}`);
        return res.data;
    },
    filterByStatus: async (status) => {
        const res = await api.get(`/workouttasks/filter?status=${status}`);
        return res.data;
    },
    create: async (data) => {
        const res = await api.post('/workouttasks', data);
        return res.data;
    },
    updateStatus: async (id, status) => {
        const res = await api.put(`/workouttasks/${id}/status`, { status });
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/workouttasks/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        await api.delete(`/workouttasks/${id}`);
    }
};