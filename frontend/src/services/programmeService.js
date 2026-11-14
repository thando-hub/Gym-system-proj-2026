import api from './api';

// ─── Programme CRUD ───────────────────────────────────────────────────────────

export async function getAllProgrammes() {
    const response = await api.get('/TrainingProgramme');
    return response.data;
}

export async function getProgrammeById(id) {
    const response = await api.get(`/TrainingProgramme/${id}`);
    return response.data;
}

export async function createProgramme(programmeData) {
    const payload = {
        programmeName: programmeData.name || programmeData.programmeName,
        description: programmeData.description || '',
        duration: parseInt(programmeData.duration, 10),
        fitnessGoal: programmeData.fitnessGoal,
    };
    const response = await api.post('/TrainingProgramme', payload);
    return response.data;
}

export async function updateProgramme(id, programmeData) {
    const payload = {
        programmeId: id,
        programmeName: programmeData.name || programmeData.programmeName,
        description: programmeData.description || '',
        duration: parseInt(programmeData.duration, 10),
        fitnessGoal: programmeData.fitnessGoal,
    };
    const response = await api.put(`/TrainingProgramme/${id}`, payload);
    return response.data;
}

export async function deleteProgramme(id) {
    const response = await api.delete(`/TrainingProgramme/${id}`);
    return response.data;
}

// ─── Assignment ───────────────────────────────────────────────────────────────

// Assign a PersonalTrainer to a GymMember (Admin only)
export async function assignTrainer(memberId, trainerId) {
    const response = await api.post('/TrainingProgramme/assign-trainer', {
        memberId,
        trainerId,
    });
    return response.data;
}

// Assign a TrainingProgramme to a GymMember (Admin only)
export async function assignProgramme(memberId, programmeId) {
    const response = await api.post('/TrainingProgramme/assign-programme', {
        memberId,
        programmeId,
    });
    return response.data;
}

// ─── Trainer Programmes ───────────────────────────────────────────────────────

// Get all TrainingProgrammes assigned to a trainer's members
export async function getProgrammesForTrainer(trainerId) {
    const response = await api.get(`/TrainingProgramme/trainer/${trainerId}`);
    return response.data;
}

// ─── Member Programme ─────────────────────────────────────────────────────────

// Get the training programme assigned to the currently logged-in GymMember
export async function getMyProgramme() {
    const response = await api.get('/TrainingProgramme/my-programme');
    return response.data;
}
