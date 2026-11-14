import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProgrammeById, updateProgramme } from '../services/programmeService';

export default function EditProgramme() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [programmeName, setProgrammeName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('Weight Loss');
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProgramme();
    }, [id]);

    async function loadProgramme() {
        setPageLoading(true);
        setError('');
        try {
            const data = await getProgrammeById(id);
            setProgrammeName(data.name || data.programmeName || '');
            setDescription(data.description || '');
            setDuration(data.duration || '');
            setFitnessGoal(data.fitnessGoal || 'Weight Loss');
        } catch (err) {
            setError('Could not load training programme details.');
        } finally {
            setPageLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await updateProgramme(id, {
                programmeId: id,
                name: programmeName,
                programmeName,
                description,
                duration,
                fitnessGoal,
            });
            navigate('/admin/programmes');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update training programme.';
            setError(msg);
            setSubmitting(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading programme details...</p>
            </div>
        );
    }

    return (
        <Container className="py-4" style={{ maxWidth: '600px' }}>
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">Edit Training Programme</h4>
                </Card.Header>
                <Card.Body className="p-4">
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="programmeName">
                            <Form.Label>Programme Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Beginner Strength Split"
                                value={programmeName}
                                onChange={(e) => setProgrammeName(e.target.value)}
                                maxLength={100}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter programme details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="duration">
                            <Form.Label>Duration (weeks) *</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="104"
                                placeholder="e.g. 8"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="fitnessGoal">
                            <Form.Label>Fitness Goal *</Form.Label>
                            <Form.Select
                                value={fitnessGoal}
                                onChange={(e) => setFitnessGoal(e.target.value)}
                                required
                            >
                                <option value="Weight Loss">Weight Loss</option>
                                <option value="Muscle Building">Muscle Building</option>
                                <option value="General Fitness">General Fitness</option>
                                <option value="Strength">Strength</option>
                                <option value="Endurance">Endurance</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => navigate('/admin/programmes')}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
