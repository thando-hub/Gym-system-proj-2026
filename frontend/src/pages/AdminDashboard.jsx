import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ members: 0, trainers: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [membersRes, trainersRes] = await Promise.all([
                    api.get('/GymMembers'),
                    api.get('/PersonalTrainers'),
                ]);
                setCounts({
                    members: membersRes.data.length,
                    trainers: trainersRes.data.length,
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="text-muted mb-0">
                        Welcome, {user?.firstName} {user?.lastName}
                    </p>
                </div>
                <Button variant="outline-danger" onClick={logout}>
                    Logout
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col md={6} className="mb-3">
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <h2>{counts.members}</h2>
                            <Card.Text>Total Members</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <h2>{counts.trainers}</h2>
                            <Card.Text>Total Trainers</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem' , fontFamily: "'Dancing Script', cursive", color: '#040a10'}}>ProGraMmes</div>
                            <Card.Title className="mt-3">Training Programmes</Card.Title>
                            <Card.Text className="text-muted">
                                Create, edit and delete training programmes.
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/admin/programmes')}
                            >
                                Manage Programmes
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>MeMbers</div>
                            <Card.Title className="mt-3">Gym Members</Card.Title>
                            <Card.Text className="text-muted">
                                Manage gym members.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate('/admin/members')}>
                                Manage Members
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>Trainers</div>
                            <Card.Title className="mt-3">Personal Trainers</Card.Title>
                            <Card.Text className="text-muted">
                                Manage personal trainers.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate('/admin/trainers')}>
                                Manage Trainers
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>Assign T</div>
                            <Card.Title className="mt-3">Assign Trainer</Card.Title>
                            <Card.Text className="text-muted">
                                Assign a personal trainer to a gym member.
                            </Card.Text>
                            <Button variant="warning" onClick={() => navigate('/admin/assign-trainer')}>
                                Assign Trainer
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>Assign P</div>
                            <Card.Title className="mt-3">Assign Programme</Card.Title>
                            <Card.Text className="text-muted">
                                Assign a training programme to a gym member.
                            </Card.Text>
                            <Button variant="success" onClick={() => navigate('/admin/assign-programme')}>
                                Assign Programme
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3">Quick Actions</h4>
            <Row>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/admin/members" variant="primary" className="w-100">
                        Manage Members
                    </Button>
                </Col>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/admin/trainers" variant="primary" className="w-100">
                        Manage Trainers
                    </Button>
                </Col>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/admin/programmes" variant="primary" className="w-100">
                        Manage Programmes
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
