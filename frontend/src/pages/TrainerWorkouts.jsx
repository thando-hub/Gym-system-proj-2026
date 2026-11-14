import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';
import { workoutPlanService, workoutTaskService } from '../services/workoutService';
import { trainerService } from '../services/PersonalTrainerService';
import { memberService } from '../services/GymMemberService';

export default function TrainerWorkouts() {
    const [plans, setPlans] = useState([]);
    const [assignedMembers, setAssignedMembers] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [planForm, setPlanForm] = useState({ planName: '', description: '', gymMemberId: '' });
    const [taskForm, setTaskForm] = useState({
        exerciseName: '', description: '', sets: 3, reps: 10, dueDate: ''
    });

    const loadPlans = async () => {
        try {
            const trainer = await trainerService.getMyProfile();
            if (!trainer || !trainer.id) {
                setError('No trainer record found for your account.');
                setLoading(false);
                return;
            }

            const members = await memberService.getTrainerMembers(trainer.id);
            setAssignedMembers(members);

            const memberIds = members.map(m => m.id);
            const allPlans = await workoutPlanService.getAll();
            const filteredPlans = allPlans.filter(p => memberIds.includes(p.gymMemberId));
            setPlans(filteredPlans);
        } catch (err) {
            console.error(err);
            setError('Failed to load workout plans.');
        } finally {
            setLoading(false);
        }
    };

    const loadTasks = async (planId) => {
        const data = await workoutTaskService.getByPlan(planId);
        setTasks(data);
        setSelectedPlan(planId);
    };

    useEffect(() => { loadPlans(); }, []);

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        if (editingTask && editingTask.id) {
            // Edit mode
            await workoutPlanService.update(editingTask.id, {
                planName: planForm.planName,
                description: planForm.description,
                gymMemberId: parseInt(planForm.gymMemberId)
            });
            setEditingTask(null);
        } else {
            // Create mode
            await workoutPlanService.create({
                planName: planForm.planName,
                description: planForm.description,
                gymMemberId: parseInt(planForm.gymMemberId)
            });
        }
        setShowPlanModal(false);
        setPlanForm({ planName: '', description: '', gymMemberId: '' });
        loadPlans();
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        await workoutTaskService.create({
            exerciseName: taskForm.exerciseName,
            description: taskForm.description,
            sets: parseInt(taskForm.sets),
            reps: parseInt(taskForm.reps),
            dueDate: taskForm.dueDate,
            workoutPlanId: selectedPlan
        });
        setShowTaskModal(false);
        setTaskForm({ exerciseName: '', description: '', sets: 3, reps: 10, dueDate: '' });
        loadTasks(selectedPlan);
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        await workoutTaskService.delete(id);
        loadTasks(selectedPlan);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskForm({
            exerciseName: task.exerciseName,
            description: task.description,
            sets: task.sets,
            reps: task.reps,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        setShowEditTaskModal(true);
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        await workoutTaskService.update(editingTask.id, {
            exerciseName: taskForm.exerciseName,
            description: taskForm.description,
            sets: parseInt(taskForm.sets),
            reps: parseInt(taskForm.reps),
            dueDate: taskForm.dueDate,
            workoutPlanId: selectedPlan
        });
        setShowEditTaskModal(false);
        setEditingTask(null);
        setTaskForm({ exerciseName: '', description: '', sets: 3, reps: 10, dueDate: '' });
        loadTasks(selectedPlan);
    };

    const handleDeletePlan = async (planId) => {
        if (!window.confirm('Delete this workout plan and all its tasks?')) return;
        await workoutPlanService.delete(planId);
        if (selectedPlan === planId) {
            setSelectedPlan(null);
            setTasks([]);
        }
        loadPlans();
    };

    const handleEditPlan = (plan) => {
        const member = assignedMembers.find(m => m.id === plan.gymMemberId);
        setPlanForm({
            planName: plan.planName,
            description: plan.description,
            gymMemberId: plan.gymMemberId
        });
        setEditingTask(plan); // Using editingTask to store the plan being edited
        setShowPlanModal(true);
    };

    if (loading) return <div className="text-center mt-5"><h5>Loading...</h5></div>;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Workout Plans</h2>
                <Button onClick={() => {
                    setEditingTask(null);
                    setPlanForm({ planName: '', description: '', gymMemberId: '' });
                    setShowPlanModal(true);
                }}>+ New Plan</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {!error && assignedMembers.length === 0 && (
                <Alert variant="info">No members assigned to you yet. Contact an admin to assign members.</Alert>
            )}

            {plans.length === 0 && !error && assignedMembers.length > 0 ? (
                <Alert variant="info">No workout plans created yet. Click "+ New Plan" to create one.</Alert>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Plan Name</th>
                            <th>Description</th>
                            <th>Member</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(p => {
                            const member = assignedMembers.find(m => m.id === p.gymMemberId);
                            return (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.planName}</td>
                                    <td>{p.description}</td>
                                    <td>{member ? `${member.name} ${member.surname}` : 'Unknown'}</td>
                                    <td>
                                        <Button size="sm" className="me-2" onClick={() => loadTasks(p.id)}>View Tasks</Button>
                                        <Button size="sm" variant="warning" className="me-2" onClick={() => handleEditPlan(p)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeletePlan(p.id)}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            {selectedPlan && (
                <>
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                        <h3>Tasks for Plan #{selectedPlan}</h3>
                        <Button onClick={() => setShowTaskModal(true)}>+ New Task</Button>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Exercise</th>
                                <th>Sets</th>
                                <th>Reps</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(t => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.exerciseName}</td>
                                    <td>{t.sets}</td>
                                    <td>{t.reps}</td>
                                    <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <Badge bg={
                                            t.status === 'Complete' ? 'success' :
                                            t.status === 'In Progress' ? 'warning' : 'secondary'
                                        }>
                                            {t.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button size="sm" variant="warning" className="me-2" onClick={() => handleEditTask(t)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteTask(t.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {/* Create/Edit Plan Modal */}
            <Modal show={showPlanModal} onHide={() => {
                setShowPlanModal(false);
                setEditingTask(null);
                setPlanForm({ planName: '', description: '', gymMemberId: '' });
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTask && editingTask.id ? 'Edit Workout Plan' : 'New Workout Plan'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreatePlan}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Plan Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={planForm.planName}
                                onChange={e => setPlanForm({ ...planForm, planName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={planForm.description}
                                onChange={e => setPlanForm({ ...planForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assign to Member *</Form.Label>
                            <Form.Select
                                value={planForm.gymMemberId}
                                onChange={e => setPlanForm({ ...planForm, gymMemberId: e.target.value })}
                                required
                            >
                                <option value="">-- Select a Member --</option>
                                {assignedMembers.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} {m.surname} ({m.memberNumber})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowPlanModal(false);
                            setEditingTask(null);
                            setPlanForm({ planName: '', description: '', gymMemberId: '' });
                        }}>Cancel</Button>
                        <Button type="submit" variant="primary">{editingTask && editingTask.id ? 'Update' : 'Create'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Create Task Modal */}
            <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
                <Modal.Header closeButton><Modal.Title>New Workout Task</Modal.Title></Modal.Header>
                <Form onSubmit={handleCreateTask}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Exercise Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={taskForm.exerciseName}
                                onChange={e => setTaskForm({ ...taskForm, exerciseName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={taskForm.description}
                                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sets</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={taskForm.sets}
                                onChange={e => setTaskForm({ ...taskForm, sets: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Reps</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={taskForm.reps}
                                onChange={e => setTaskForm({ ...taskForm, reps: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={taskForm.dueDate}
                                onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Create</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Task Modal */}
            <Modal show={showEditTaskModal} onHide={() => {
                setShowEditTaskModal(false);
                setEditingTask(null);
                setTaskForm({ exerciseName: '', description: '', sets: 3, reps: 10, dueDate: '' });
            }}>
                <Modal.Header closeButton><Modal.Title>Edit Workout Task</Modal.Title></Modal.Header>
                <Form onSubmit={handleUpdateTask}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Exercise Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={taskForm.exerciseName}
                                onChange={e => setTaskForm({ ...taskForm, exerciseName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={taskForm.description}
                                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sets</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={taskForm.sets}
                                onChange={e => setTaskForm({ ...taskForm, sets: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Reps</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={taskForm.reps}
                                onChange={e => setTaskForm({ ...taskForm, reps: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={taskForm.dueDate}
                                onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowEditTaskModal(false);
                            setEditingTask(null);
                            setTaskForm({ exerciseName: '', description: '', sets: 3, reps: 10, dueDate: '' });
                        }}>Cancel</Button>
                        <Button type="submit" variant="primary">Update</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}