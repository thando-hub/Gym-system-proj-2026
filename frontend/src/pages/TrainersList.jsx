import { useState, useEffect } from 'react';
import { trainerService } from '../services/PersonalTrainerService';
import { Link } from 'react-router-dom';

export default function TrainersList() {
    const [trainers, setTrainers] = useState([]);
    const [filters, setFilters] = useState({ staffNumber: '', name: '', surname: '' });

    const load = async () => {
        setTrainers(await trainerService.getAll(filters));
    };

    useEffect(() => { load(); }, [filters]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this trainer?')) {
            await trainerService.delete(id);
            load();
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Personal Trainers</h2>
            <Link to="/admin/trainers/add" style={{ marginBottom: '1rem', display: 'inline-block' }}>Add Trainer</Link>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input placeholder="Staff Number" value={filters.staffNumber} onChange={e => setFilters({ ...filters, staffNumber: e.target.value })} />
                <input placeholder="Name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
                <input placeholder="Surname" value={filters.surname} onChange={e => setFilters({ ...filters, surname: e.target.value })} />
            </div>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Staff #</th><th>Name</th><th>Surname</th><th>Email</th><th>Specialization</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map(t => (
                        <tr key={t.id}>
                            <td>{t.staffNumber}</td>
                            <td>{t.name}</td>
                            <td>{t.surname}</td>
                            <td>{t.email}</td>
                            <td>{t.specialization}</td>
                            <td>
                                <Link to={`/admin/trainers/edit/${t.id}`}>Edit</Link> |
                                <button onClick={() => handleDelete(t.id)} style={{ color: 'red', marginLeft: '0.5rem' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}