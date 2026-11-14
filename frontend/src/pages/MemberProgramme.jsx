import { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Badge, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProgramme } from '../services/programmeService';

export default function MemberProgramme() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [programme, setProgramme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyProgramme();
    }, []);

    async function fetchMyProgramme() {
        setLoading(true);
        setError('');
        try {
            const data = await getMyProgramme();
            setProgramme(data);
        } catch (err) {
            if (err.response?.status === 404) {
                // No programme assigned yet — not an error, just show info message
                setProgramme(null);
            } else {
                setError('Could not load your training programme. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">My Training Programme</h2>
                    <p className="text-muted mb-0">
                        Welcome, <strong>{user?.firstName} {user?.lastName}</strong>!
                    </p>
                </div>
                <Button variant="outline-secondary" onClick={() => navigate('/member/dashboard')}>
                    Back to Dashboard
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading your programme...</p>
                </div>
            ) : programme === null ? (
                <Alert variant="info">
                    <strong>No programme assigned yet.</strong> Please contact your trainer or an admin
                    to have a training programme assigned to you.
                </Alert>
            ) : (
                <Row>
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h4 className="mb-0">{programme.programmeName || programme.name}</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <p className="text-muted mb-4">
                                    {programme.description || 'No description provided.'}
                                </p>

                                <Row className="mb-3">
                                    <Col xs={5}>
                                        <strong>Duration:</strong>
                                    </Col>
                                    <Col>
                                        <Badge bg="info">{programme.duration} weeks</Badge>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={5}>
                                        <strong>Fitness Goal:</strong>
                                    </Col>
                                    <Col>
                                        <Badge bg="success">{programme.fitnessGoal}</Badge>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="text-muted small">
                                This programme is assigned by your admin. Contact them to request changes.
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
