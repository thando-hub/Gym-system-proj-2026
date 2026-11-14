import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { assignTrainer } from '../services/programmeService';
import { memberService } from '../services/GymMemberService';
import { trainerService } from '../services/PersonalTrainerService';

export default function AssignTrainer() {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [memberId, setMemberId] = useState('');
    const [trainerId, setTrainerId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        loadDropdowns();
    }, []);

    async function loadDropdowns() {
        setLoading(true);
        setError('');
        try {
            const [membersData, trainersData] = await Promise.all([
                memberService.getAll(),
                trainerService.getAll(),
            ]);
            setMembers(membersData);
            setTrainers(trainersData);
        } catch (err) {
            setError('Failed to load members or trainers. Is the API running?');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!memberId || !trainerId) {
            setError('Please select both a member and a trainer.');
            return;
        }

        setSubmitting(true);
        try {
            await assignTrainer(parseInt(memberId), parseInt(trainerId));
            setSuccessMsg('Trainer assigned to member successfully!');
            setMemberId('');
            setTrainerId('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign trainer.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Assign Trainer to Member</h2>
                <Button variant="outline-secondary" onClick={() => navigate('/admin/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>

            {successMsg && (
                <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>
                    {successMsg}
                </Alert>
            )}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading...</p>
                </div>
            ) : (
                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Assignment Form</h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="memberId">
                                <Form.Label>Select Member *</Form.Label>
                                <Form.Select
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Member --</option>
                                    {members.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} {m.surname} ({m.memberNumber})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="trainerId">
                                <Form.Label>Select Trainer *</Form.Label>
                                <Form.Select
                                    value={trainerId}
                                    onChange={(e) => setTrainerId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Trainer --</option>
                                    {trainers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} {t.surname} ({t.specialization})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => navigate('/admin/dashboard')}
                                >
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Assigning...
                                        </>
                                    ) : (
                                        'Assign Trainer'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}
