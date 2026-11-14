import { useState, useEffect } from 'react';
import { memberService } from '../services/GymMemberService';

export default function MyProfile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        memberService.getMyProfile().then(setProfile);
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>My Profile</h2>
            <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
                <tbody>
                    <tr><th>Member Number</th><td>{profile.memberNumber}</td></tr>
                    <tr><th>Name</th><td>{profile.name} {profile.surname}</td></tr>
                    <tr><th>Gender</th><td>{profile.gender}</td></tr>
                    <tr><th>Date of Birth</th><td>{new Date(profile.dateOfBirth).toLocaleDateString()}</td></tr>
                    <tr><th>Email</th><td>{profile.email}</td></tr>
                    <tr><th>Phone</th><td>{profile.phoneNumber || 'Not provided'}</td></tr>
                    <tr><th>Address</th><td>{profile.homeAddress}</td></tr>
                    <tr><th>Membership Type</th><td>{profile.membershipType}</td></tr>
                    <tr><th>Assigned Trainer</th><td>{profile.personalTrainer ? `${profile.personalTrainer.name} ${profile.personalTrainer.surname}` : 'None'}</td></tr>
                </tbody>
            </table>
        </div>
    );
}