import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { assignProgramme, getAllProgrammes } from '../services/programmeService';
import { memberService } from '../services/GymMemberService';

export default function AssignProgramme() {
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [memberId, setMemberId] = useState('');
    const [programmeId, setProgrammeId] = useState('');
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
            const [membersData, programmesData] = await Promise.all([
                memberService.getAll(),
                getAllProgrammes(),
            ]);
            setMembers(membersData);
            setProgrammes(programmesData);
        } catch (err) {
            setError('Failed to load members or programmes. Is the API running?');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!memberId || !programmeId) {
            setError('Please select both a member and a programme.');
            return;
        }

        setSubmitting(true);
        try {
            await assignProgramme(parseInt(memberId), programmeId);
            setSuccessMsg('Training programme assigned to member successfully!');
            setMemberId('');
            setProgrammeId('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign programme.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Assign Programme to Member</h2>
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
                    <Card.Header className="bg-success text-white">
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

                            <Form.Group className="mb-4" controlId="programmeId">
                                <Form.Label>Select Training Programme *</Form.Label>
                                <Form.Select
                                    value={programmeId}
                                    onChange={(e) => setProgrammeId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Programme --</option>
                                    {programmes.map((p) => (
                                        <option key={p.programmeId} value={p.programmeId}>
                                            {p.name || p.programmeName} ({p.duration} weeks — {p.fitnessGoal})
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
                                <Button variant="success" type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Assigning...
                                        </>
                                    ) : (
                                        'Assign Programme'
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
