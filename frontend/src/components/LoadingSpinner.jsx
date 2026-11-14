import { Spinner, Container } from 'react-bootstrap';

export default function LoadingSpinner() {
    return (
        <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2 text-muted">Loading...</p>
        </Container>
    );
}