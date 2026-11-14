import { useState } from 'react';
import { trainerService } from '../services/PersonalTrainerService';
import { useNavigate } from 'react-router-dom';

export default function AddTrainer() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        staffNumber: '', name: '', surname: '', gender: '',
        email: '', phoneNumber: '', specialization: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.staffNumber) errs.staffNumber = 'Required';
        if (!form.name) errs.name = 'Required';
        if (!form.surname) errs.surname = 'Required';
        if (!form.gender) errs.gender = 'Required';
        if (!form.email) errs.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.phoneNumber) errs.phoneNumber = 'Required';
        else if (!/^\d+$/.test(form.phoneNumber)) errs.phoneNumber = 'Must be numeric';
        if (!form.specialization) errs.specialization = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await trainerService.create(form);
        navigate('/admin/trainers');
    };

    const specializations = ['Strength Training', 'Cardio', 'Yoga', 'HIIT', 'Rehabilitation', 'Nutrition', 'CrossFit'];

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add Personal Trainer</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                    ['staffNumber', 'Staff Number'], ['name', 'Name'], ['surname', 'Surname'],
                    ['email', 'Email'], ['phoneNumber', 'Phone Number']
                ].map(([key, label]) => (
                    <div key={key}>
                        <label>{label}:</label>
                        <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                        {errors[key] && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors[key]}</div>}
                    </div>
                ))}

                <div>
                    <label>Gender:</label>
                    {['Male', 'Female', 'Other'].map(g => (
                        <label key={g} style={{ marginLeft: '0.5rem' }}>
                            <input type="radio" name="gender" value={g} checked={form.gender === g}
                                onChange={e => setForm({ ...form, gender: e.target.value })} /> {g}
                        </label>
                    ))}
                    {errors.gender && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.gender}</div>}
                </div>

                <div>
                    <label>Specialization:</label>
                    <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}>
                        <option value="">Select</option>
                        {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialization && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.specialization}</div>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => navigate('/admin/trainers')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}