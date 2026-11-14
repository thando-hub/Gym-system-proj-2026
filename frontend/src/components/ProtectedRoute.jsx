/* import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, hasRole, loading } = useAuth();

    // Show nothing while we check auth status
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in -> redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role -> redirect to login (or a "not authorized" page)
    if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some((role) => hasRole(role));
        if (!hasPermission) {
            return <Navigate to="/login" replace />;
        }
    }

    // All good - render the protected page
    return children;
} */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;

    if (!user) return <Navigate to="/login" replace />;

    const role = user?.roles?.[0];

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'PersonalTrainer') return <Navigate to="/trainer/dashboard" replace />;
        if (role === 'GymMember') return <Navigate to="/member/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}