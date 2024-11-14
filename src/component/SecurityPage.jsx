import React, {useState} from 'react';
import SideNav from "./SideNav";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const SecurityPage = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/unlimitedmarketplace/${userId}`, {
                userId,
                currentPassword,
                newPassword
            }, { headers });

            if (response.status === 204) {
                setSuccess('Password changed successfully');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError('Failed to change password');
            }
        } catch (error) {
            setError('Failed to change password: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container-fluid vh-100 w-100 mh-100 bg-transparent bg-transparent rounded-5 border-top border-danger  overflow-hidden d-flex">
            <SideNav/>
            <div
                className="bg-transparent rounded-5 h-75 w-100 px-5 border-danger py-0 my-0 d-flex flex-column align-items-center">
            <div className="user-input  bg-gradient p-5 rounded-5 border-1 border-danger w-50 mt-5" style={{minWidth:340,maxWidth:500}}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handlePasswordChange} className="input-container d-flex flex-column">
                        <h2 className="text-danger mb-4">Change Password</h2>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label text-white">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label text-white">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmNewPassword" className="form-label text-white">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100">Change Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default SecurityPage;