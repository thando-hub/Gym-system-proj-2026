import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { trainerService } from '../services/PersonalTrainerService';
import { memberService } from '../services/GymMemberService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TrainerDashboard() {
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignedMembers = async () => {
            try {
                const trainer = await trainerService.getMyProfile();
                if (!trainer || !trainer.id) {
                    setError('No trainer record found for your account.');
                    setLoading(false);
                    return;
                }

                const members = await memberService.getTrainerMembers(trainer.id);
                setMemberCount(members.length);
            } catch (err) {
                console.error(err);
                setError('Failed to load assigned members.');
            } finally {
                setLoading(false);
            }
        };
        fetchAssignedMembers();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Trainer Dashboard</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <h2>{memberCount}</h2>
                            <Card.Text>Assigned Members</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4 className="mb-3">Quick Actions</h4>
            <Row>
                <Col md={4}>
                    <Button as={Link} to="/trainer/members" variant="primary" className="w-100 mb-2">
                        My Members
                    </Button>
                </Col>
                <Col md={4}>
                    <Button as={Link} to="/trainer/workouts" variant="success" className="w-100 mb-2">
                        My Workouts
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
