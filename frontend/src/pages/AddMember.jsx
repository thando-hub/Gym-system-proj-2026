import { useState, useEffect } from 'react';
import { memberService } from '../services/GymMemberService';
import { trainerService } from '../services/PersonalTrainerService';
import { useNavigate } from 'react-router-dom';

export default function AddMember() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        memberNumber: '', name: '', surname: '', gender: '', dateOfBirth: '',
        homeAddress: '', email: '', phoneNumber: '', membershipType: '', personalTrainerId: ''
    });
    const [errors, setErrors] = useState({});
    const [trainers, setTrainers] = useState([]);

    useEffect(() => { trainerService.getAll().then(setTrainers); }, []);

    const validate = () => {
        const errs = {};
        if (!form.memberNumber) errs.memberNumber = 'Required';
        if (!form.name) errs.name = 'Required';
        if (!form.surname) errs.surname = 'Required';
        if (!form.gender) errs.gender = 'Required';
        if (!form.dateOfBirth) errs.dateOfBirth = 'Required';
        if (!form.homeAddress) errs.homeAddress = 'Required';
        if (!form.email) errs.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (form.phoneNumber && !/^\d+$/.test(form.phoneNumber)) errs.phoneNumber = 'Must be numeric';
        if (!form.membershipType) errs.membershipType = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await memberService.create({ ...form, personalTrainerId: form.personalTrainerId || null });
        navigate('/admin/members');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Add Member</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                    ['memberNumber', 'Member Number'], ['name', 'Name'], ['surname', 'Surname'],
                    ['homeAddress', 'Home Address'], ['email', 'Email'], ['phoneNumber', 'Phone Number']
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
                    <label>Date of Birth:</label>
                    <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                    {errors.dateOfBirth && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.dateOfBirth}</div>}
                </div>

                <div>
                    <label>Membership Type:</label>
                    <select value={form.membershipType} onChange={e => setForm({ ...form, membershipType: e.target.value })}>
                        <option value="">Select</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annual">Annual</option>
                    </select>
                    {errors.membershipType && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.membershipType}</div>}
                </div>

                <div>
                    <label>Assigned Trainer:</label>
                    <select value={form.personalTrainerId} onChange={e => setForm({ ...form, personalTrainerId: e.target.value })}>
                        <option value="">None</option>
                        {trainers.map(t => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => navigate('/admin/members')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}