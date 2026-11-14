import { useState, useEffect } from 'react';
import { Container, Table, Form, Badge, Alert, Card } from 'react-bootstrap';
import { workoutPlanService, workoutTaskService } from '../services/workoutService';
import { memberService } from '../services/GymMemberService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MemberWorkouts() {
    const [plans, setPlans] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const member = await memberService.getMyProfile();
                if (!member || !member.id) {
                    setError('No member profile found for your account.');
                    setLoading(false);
                    return;
                }

                const memberPlans = await workoutPlanService.getByMember(member.id);
                setPlans(memberPlans);

                // Get all tasks and filter to only show tasks for this member's plans
                const allTasks = await workoutTaskService.getAll();
                const planIds = memberPlans.map(p => p.id);
                const memberTasks = allTasks.filter(t => planIds.includes(t.workoutPlanId));
                setTasks(memberTasks);
            } catch (err) {
                console.error(err);
                setError('Failed to load workout data.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredTasks = statusFilter
        ? tasks.filter(t => t.status === statusFilter)
        : tasks;

    const handleStatusChange = async (taskId, newStatus) => {
        await workoutTaskService.updateStatus(taskId, newStatus);
        const updatedTasks = await workoutTaskService.getAll();
        setTasks(updatedTasks);
    };

    const getStatusBadge = (status) => {
        const bg = status === 'Complete' ? 'success' :
                   status === 'In Progress' ? 'warning' : 'secondary';
        return <Badge bg={bg}>{status}</Badge>;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="mt-4">
            <h2>My Workout Plans</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {plans.length === 0 && !error ? (
                <Alert variant="info">No workout plans assigned to you yet. Contact your trainer to get started.</Alert>
            ) : (
                plans.map(plan => {
                    const planTasks = tasks.filter(t => t.workoutPlanId === plan.id);
                    const filteredPlanTasks = statusFilter
                        ? planTasks.filter(t => t.status === statusFilter)
                        : planTasks;

                    return (
                        <div key={plan.id} className="mb-5">
                            <Card className="shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">{plan.planName}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {plan.description && <p className="mb-3">{plan.description}</p>}

                                    {filteredPlanTasks.length === 0 ? (
                                        <p className="text-muted">No tasks {statusFilter ? `with status "${statusFilter}"` : ''} in this plan.</p>
                                    ) : (
                                        <Table striped bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Exercise</th>
                                                    <th>Description</th>
                                                    <th>Sets</th>
                                                    <th>Reps</th>
                                                    <th>Due Date</th>
                                                    <th>Status</th>
                                                    <th>Update Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPlanTasks.map(t => (
                                                    <tr key={t.id}>
                                                        <td>{t.exerciseName}</td>
                                                        <td>{t.description || '-'}</td>
                                                        <td>{t.sets}</td>
                                                        <td>{t.reps}</td>
                                                        <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                                                        <td>{getStatusBadge(t.status)}</td>
                                                        <td>
                                                            <Form.Select
                                                                size="sm"
                                                                style={{ minWidth: '140px' }}
                                                                value={t.status}
                                                                onChange={e => handleStatusChange(t.id, e.target.value)}
                                                            >
                                                                <option value="Not Started">Not Started</option>
                                                                <option value="In Progress">In Progress</option>
                                                                <option value="Complete">Complete</option>
                                                            </Form.Select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    );
                })
            )}

            {!error && plans.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                    <h3>Filter All Tasks by Status</h3>
                    <Form.Select
                        style={{ maxWidth: '200px' }}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </Form.Select>
                </div>
            )}
        </Container>
    );
}