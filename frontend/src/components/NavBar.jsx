import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const roles = user.roles || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            backgroundColor: '#1f2937',
            color: 'white',
            borderBottom: '1px solid #374151'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <strong style={{ fontSize: '18px' }}>Welcome To Gymnation</strong>

                {roles.includes('Admin') && (
                    <>
                        <Link to="/admin/dashboard" style={linkStyle}>Dash-Board</Link>
                        <Link to="/admin/members" style={linkStyle}>Our Members</Link>
                        <Link to="/admin/trainers" style={linkStyle}>Our Trainers</Link>
                    </>
                )}

                {roles.includes('PersonalTrainer') && (
                    <>
                        <Link to="/trainer/dashboard" style={linkStyle}>Dash-Board</Link>
                        <Link to="/trainer/members" style={linkStyle}>My Members</Link>
                        <Link to="/trainer/workouts" style={linkStyle}>Workouts</Link>
                    </>
                )}

                {roles.includes('GymMember') && (
                    <>
                        <Link to="/member/dashboard" style={linkStyle}>Dashboard</Link>
                        <Link to="/member/MyProfile" style={linkStyle}>My Profile</Link>
                        <Link to="/member/workouts" style={linkStyle}>My Workouts</Link>
                    </>
                )}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#8eb7f5' }}>
                    {user.firstName} {user.lastName} ({roles.join(', ')})
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '6px 14px',
                        backgroundColor: '#7b0606',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

const linkStyle = {
    color: 'Light blue', //This was white
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 10px',
    borderRadius: '4px'
};
