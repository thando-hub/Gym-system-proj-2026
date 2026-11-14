import { useState, useEffect } from 'react';
import { memberService } from '../services/GymMemberService';
import { Link } from 'react-router-dom';

export default function MembersList() {
    const [members, setMembers] = useState([]);
    const [filters, setFilters] = useState({ memberNumber: '', name: '', surname: '' });

    const load = async () => {
        setMembers(await memberService.getAll(filters));
    };

    useEffect(() => { load(); }, [filters]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this member?')) {
            await memberService.delete(id);
            load();
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Members</h2>
            <Link to="/admin/members/add" style={{ marginBottom: '1rem', display: 'inline-block' }}>Add Member</Link>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input placeholder="Member Number" value={filters.memberNumber} onChange={e => setFilters({ ...filters, memberNumber: e.target.value })} />
                <input placeholder="Name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
                <input placeholder="Surname" value={filters.surname} onChange={e => setFilters({ ...filters, surname: e.target.value })} />
            </div>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Member #</th><th>Name</th><th>Surname</th><th>Email</th><th>Type</th><th>Trainer</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m.id}>
                            <td>{m.memberNumber}</td>
                            <td>{m.name}</td>
                            <td>{m.surname}</td>
                            <td>{m.email}</td>
                            <td>{m.membershipType}</td>
                            <td>{m.personalTrainer?.name || '—'}</td>
                            <td>
                                <Link to={`/admin/members/edit/${m.id}`}>Edit</Link> |
                                <button onClick={() => handleDelete(m.id)} style={{ color: 'red', marginLeft: '0.5rem' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}