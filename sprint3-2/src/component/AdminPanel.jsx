import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState('dateDesc');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const roles = decodedToken.roles || [];
            setIsAdmin(roles.includes('ROLE_ADMIN'));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };

            const response = await axios.get('http://localhost:8080/adminpanel/users', { headers });

            console.log('Response data:', response.data);

            if (response.data && Array.isArray(response.data.allUsers)) {
                setUsers(response.data.allUsers);
            } else {
                console.error('Unexpected response format:', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };


    const handleDeleteUser = async (userId) => {
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
            const response = await axios.delete(`http://localhost:8080/adminpanel/users/${userId}`, { headers });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!isAdmin) {
        return <div className={"container-fluid justify-content-center fs-2 text-danger d-flex bg-white"}>Access Denied</div>;
    }
    return (
        <div className="container-fluid vh-100 w-100 mh-100 bg-gradient rounded-5 border-top border-danger overflow-hidden d-flex">
            <div className="vh-100 w-100 rounded-5 border-danger px-5 py-0 overflow-scroll">
                <h2 className="text-white d-flex justify-content-center bg-black rounded-4 mb-0 fw-bold">
                    <i className={"fa fa-table py-1 px-3 text-success"}></i>Admin Panel
                </h2>
                <div className="d-flex justify-content-between my-3">
                    <div>
                        <label className="text-white me-2">Sort By:</label>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="form-select w-auto d-inline-block"
                        >
                            <option value="dateDesc">Date (Newest First)</option>
                            <option value="dateAsc">Date (Oldest First)</option>
                            <option value="nameAsc">Name (A-Z)</option>
                            <option value="nameDesc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>
                <table className="table table-responsive table-responsive-md table-dark table-bordered border-danger vh-100 overflow-auto">
                    <thead className="table-active rounded-5">
                    <tr>
                        <th className="text-danger table-active">User ID</th>
                        <th className="text-danger table-active">Name</th>
                        <th className="text-danger table-active">Email</th>
                        <th className="text-danger table-active">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(users) && users.map(user => (
                        <tr key={user.id}>
                            <td className="fs-5">{user.id}</td>
                            <td className="fs-5">{user.userName}</td>
                            <td className="fs-5">{user.email}</td>
                            <td className="fs-5">{user.role}</td>

                            <td className="fs-5">
                                <button className="btn btn-warning me-2">Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;



    // const checkIfAdmin = () => {
    //     const token = localStorage.getItem('accessToken');
    //     if (token) {
    //         const decodedToken = jwtDecode(token);
    //         const roles = decodedToken.roles || [];
    //         setIsAdmin(roles.includes('ROLE_ADMIN'));
    //     } else {
    //         navigate('/login');
    //     }
    // };
    //
    // const fetchUsers = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/adminpanel/users');
    //         setUsers(response.data);
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //     }
    // };

//     const handleDeleteUser = async (userId) => {
//         try {
//             await axios.delete(`http://localhost:8080/adminpanel/users/${userId}`);
//             setUsers(users.filter(user => user.id !== userId));
//         } catch (error) {
//             console.error('Error deleting user:', error);
//         }
//     };
//
//     if (!isAdmin) {
//         return <div>Access Denied</div>;
//     }
//
//     return (
//         <div
//             className="container-fluid vh-100 w-100 mh-100 bg-gradient rounded-5 border-top border-danger overflow-hidden d-flex">
//             <div className="vh-100 w-100 rounded-5 border-danger px-5 py-0 overflow-scroll">
//                 <h2 className="text-white d-flex justify-content-center bg-black rounded-4 mb-0 fw-bold">
//                     <i className={"fa fa-table py-1 px-3 text-success"}></i>Admin Panel
//                 </h2>
//                 <div className="d-flex justify-content-between my-3">
//                     <div>
//                         <label className="text-white me-2">Sort By:</label>
//                         <select
//                             value={sortOption}
//                             onChange={(e) => setSortOption(e.target.value)}
//                             className="form-select w-auto d-inline-block"
//                         >
//                             <option value="dateDesc">Date (Newest First)</option>
//                             <option value="dateAsc">Date (Oldest First)</option>
//                             <option value="nameAsc">Name (A-Z)</option>
//                             <option value="nameDesc">Name (Z-A)</option>
//                         </select>
//                     </div>
//                 </div>
//                 <table
//                     className="table table-responsive table-responsive-md table-dark table-bordered border-danger vh-100 overflow-auto">
//                     <thead className="table-active rounded-5">
//                     <tr>
//                         <th className="text-danger table-active">User ID</th>
//                         <th className="text-danger table-active">Name</th>
//                         <th className="text-danger table-active">Email</th>
//                         <th className="text-danger table-active">Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {users.map(user => (
//                         <tr key={user.id}>
//                             <td className="fs-5">{user.id}</td>
//                             <td className="fs-5">{user.name}</td>
//                             <td className="fs-5">{user.email}</td>
//                             <td className="fs-5">
//                                 <button className="btn btn-warning me-2">Edit</button>
//                                 <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
// export default AdminPanel;
