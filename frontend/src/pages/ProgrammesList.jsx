import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllProgrammes, deleteProgramme } from '../services/programmeService';

export default function ProgrammesList() {
    const navigate = useNavigate();

    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchProgrammes();
    }, []);

    async function fetchProgrammes() {
        setLoading(true);
        setError('');
        try {
            const data = await getAllProgrammes();
            setProgrammes(data);
        } catch (err) {
            setError('Could not load training programmes. Please ensure the API is running.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id, name) {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await deleteProgramme(id);
            setSuccessMsg(`Programme "${name}" deleted successfully.`);
            fetchProgrammes();
        } catch (err) {
            setError('Failed to delete programme.');
        }
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Training Programmes</h2>
                    <p className="text-muted mb-0">Manage all gym training programmes</p>
                </div>
                <div>
                    <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/admin/dashboard')}>
                        Back to Dashboard
                    </Button>
                    <Button variant="success" onClick={() => navigate('/admin/programmes/add')}>
                        + Add Programme
                    </Button>
                </div>
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
                    <p className="mt-2">Loading programmes...</p>
                </div>
            ) : (
                <Card className="shadow-sm">
                    <Table striped bordered hover responsive className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Programme Name</th>
                                <th>Description</th>
                                <th>Duration (weeks)</th>
                                <th>Fitness Goal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programmes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        No training programmes found. Click "+ Add Programme" to create one.
                                    </td>
                                </tr>
                            ) : (
                                programmes.map((p) => (
                                    <tr key={p.programmeId}>
                                        <td><strong>{p.name || p.programmeName}</strong></td>
                                        <td>{p.description || 'N/A'}</td>
                                        <td>
                                            <Badge bg="info">{p.duration} weeks</Badge>
                                        </td>
                                        <td>
                                            <Badge bg="secondary">{p.fitnessGoal}</Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/admin/programmes/edit/${p.programmeId}`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(p.programmeId, p.name || p.programmeName)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card>
            )}
        </Container>
    );
}
