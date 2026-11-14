/* import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

export default function App() {
    return (
        <Routes>
            <Route path="*" element={<Login />} />
        </Routes>
    );
} */
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProgrammesList from './pages/ProgrammesList';
import AddProgramme from './pages/AddProgramme';
import EditProgramme from './pages/EditProgramme';
import AssignTrainer from './pages/AssignTrainer';
import AssignProgramme from './pages/AssignProgramme';
import MemberProgramme from './pages/MemberProgramme';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';

import MembersList from './pages/MembersList.jsx';
import AddMember from './pages/AddMember.jsx';
import EditMember from './pages/EditMember.jsx';
import TrainersList from './pages/TrainersList.jsx';
import AddTrainer from './pages/AddTrainer.jsx';
import EditTrainer from './pages/EditTrainer.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyMembers from './pages/MyMembers.jsx';
import TrainerWorkouts from './pages/TrainerWorkouts.jsx';
import MemberWorkouts from './pages/MemberWorkouts.jsx';
import TrainerDashboard from './pages/TrainerDashboard.jsx';

import { useAuth } from './context/AuthContext';

export default function App() {
    const location = useLocation();
    const { user, loading } = useAuth();
    const showNavBar = location.pathname.toLowerCase() !== '/login';

    function getDefaultRedirect() {
        if (!user) return '/login';
        if (user?.roles?.includes('Admin')) return '/admin/dashboard';
        if (user?.roles?.includes('PersonalTrainer')) return '/trainer/dashboard';
        if (user?.roles?.includes('GymMember')) return '/member/dashboard';
        return '/login';
    }

    // Wait until AuthContext has finished reading from localStorage
    if (loading) return null;

    return (
        <>
            {showNavBar && <NavBar />}
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/members" element={<ProtectedRoute allowedRoles={['Admin']}><MembersList /></ProtectedRoute>} />
                <Route path="/admin/members/add" element={<ProtectedRoute allowedRoles={['Admin']}><AddMember /></ProtectedRoute>} />
                <Route path="/admin/members/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><EditMember /></ProtectedRoute>} />

                <Route path="/admin/trainers" element={<ProtectedRoute allowedRoles={['Admin']}><TrainersList /></ProtectedRoute>} />
                <Route path="/admin/trainers/add" element={<ProtectedRoute allowedRoles={['Admin']}><AddTrainer /></ProtectedRoute>} />
                <Route path="/admin/trainers/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><EditTrainer /></ProtectedRoute>} />

                <Route path="/admin/programmes" element={<ProtectedRoute allowedRoles={['Admin']}><ProgrammesList /></ProtectedRoute>} />
                <Route path="/admin/programmes/add" element={<ProtectedRoute allowedRoles={['Admin']}><AddProgramme /></ProtectedRoute>} />
                <Route path="/admin/programmes/edit/:id" element={<ProtectedRoute allowedRoles={['Admin']}><EditProgramme /></ProtectedRoute>} />

                <Route path="/admin/assign-trainer" element={<ProtectedRoute allowedRoles={['Admin']}><AssignTrainer /></ProtectedRoute>} />
                <Route path="/admin/assign-programme" element={<ProtectedRoute allowedRoles={['Admin']}><AssignProgramme /></ProtectedRoute>} />

                {/* Trainer Routes */}
                <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={['PersonalTrainer']}><TrainerDashboard /></ProtectedRoute>} />
                <Route path="/trainer/members" element={<ProtectedRoute allowedRoles={['PersonalTrainer']}><MyMembers /></ProtectedRoute>} />
                <Route path="/trainer/workouts" element={<ProtectedRoute allowedRoles={['PersonalTrainer']}><TrainerWorkouts /></ProtectedRoute>} />

                {/* Member Routes */}
                <Route path="/member/dashboard" element={<ProtectedRoute allowedRoles={['GymMember']}><MemberDashboard /></ProtectedRoute>} />
                <Route path="/member/profile" element={<ProtectedRoute allowedRoles={['GymMember']}><MyProfile /></ProtectedRoute>} />
                <Route path="/member/workouts" element={<ProtectedRoute allowedRoles={['GymMember']}><MemberWorkouts /></ProtectedRoute>} />
                <Route path="/member/programme" element={<ProtectedRoute allowedRoles={['GymMember']}><MemberProgramme /></ProtectedRoute>} />
                <Route path="/member/my-programme" element={<ProtectedRoute allowedRoles={['GymMember']}><MemberProgramme /></ProtectedRoute>} />

                {/* Default Redirects */}
                <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
                <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
            </Routes>
        </>
    );
}
