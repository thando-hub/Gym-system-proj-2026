import { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import { memberService } from '../services/GymMemberService';
import { trainerService } from '../services/PersonalTrainerService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const trainer = await trainerService.getMyProfile();
                if (!trainer || !trainer.id) {
                    setError('No trainer record found for your account.');
                    setLoading(false);
                    return;
                }
                const members = await memberService.getTrainerMembers(trainer.id);
                setMembers(members);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.status === 404
                        ? 'No trainer record found for your account. Ask an admin to link your email.'
                        : 'Failed to load assigned members.'
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="mt-4">
            <h2>My Assigned Members</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {!error && members.length === 0 ? (
                <p>No members assigned yet.</p>
            ) : (
                members.length > 0 && (
                    <Table striped bordered hover style={{ marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Member #</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Membership Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.id}>
                                    <td>{m.memberNumber}</td>
                                    <td>{m.name} {m.surname}</td>
                                    <td>{m.email}</td>
                                    <td>{m.membershipType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )
            )}
        </Container>
    );
}
