import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function MemberDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [taskCount, setTaskCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUpcomingTasks = async () => {
            try {
                const memberId = user?.gymMemberId || 1;
                const plansRes = await api.get(`/WorkoutPlans/member/${memberId}`);
                const allTasks = plansRes.data.flatMap(plan => plan.workoutTasks || []);
                const upcoming = allTasks.filter(
                    t => t.status && t.status !== 'Complete'
                );
                setTaskCount(upcoming.length);
            } catch (err) {
                console.error(err);
                setError('Failed to load your tasks.');
            } finally {
                setLoading(false);
            }
        };
        fetchUpcomingTasks();
    }, [user]);

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Member Dashboard</h2>
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
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>ProGrame</div>
                            <Card.Title className="mt-3">My Training Programme</Card.Title>
                            <Card.Text className="text-muted">
                                View the training programme assigned to you.
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/member/programme')}
                            >
                                View My Programme
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-3">
                    <Card className="h-100 shadow-sm text-center">
                        <Card.Body className="d-flex flex-column justify-content-center p-4">
                            <div style={{ fontSize: '2.5rem', fontFamily: "'Dancing Script', cursive", color: '#040a10' }}>TasKs</div>
                            <h2 className="mt-2">{taskCount}</h2>
                            <Card.Text className="text-muted">Upcoming Tasks</Card.Text>
                            <Button
                                as={Link}
                                to="/member/workouts"
                                variant="success"
                            >
                                View My Workouts
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3">Quick Actions</h4>
            <Row>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/member/profile" variant="outline-primary" className="w-100">
                        My Profile
                    </Button>
                </Col>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/member/workouts" variant="outline-success" className="w-100">
                        My Workouts
                    </Button>
                </Col>
                <Col md={4} className="mb-2">
                    <Button as={Link} to="/member/programme" variant="outline-info" className="w-100">
                        My Programme
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
