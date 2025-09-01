import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/slices/adminSlice';
import { toast } from "sonner";


const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, loading} = useSelector((state) => state.auth);
    const {users, loading: adminLoading, error} = useSelector((state) => state.admin);

    useEffect(()=>{
        if (loading) return; // Wait for loading to finish
        if(!user || user.role !== "admin"){
            navigate("/");
        }
    },[user, loading, navigate]);

    useEffect(()=>{
        if (user && user.role === "admin"){
            dispatch(fetchUsers());
        }
    },[user,dispatch]);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", // default role
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Frontend validation
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required.");
            return;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        try {
            await dispatch(addUser(formData)).unwrap();
            toast.success("User added successfully!");
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "customer",
            });
        } catch {
            toast.error("Failed to add user.");
        }
    };

    const handleRoleChange = (userId, newRole) => {
        const userToUpdate = users.find(u => u._id === userId);
        if (!userToUpdate) return;
        dispatch(updateUser({
            id: userId,
            name: userToUpdate.name,
            email: userToUpdate.email,
            role: newRole
        }))
        .unwrap()
        .then(() => toast.success('User role updated!'))
        .catch(() => toast.error('Failed to update user role.'));
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                toast.success('User deleted successfully!');
                dispatch(fetchUsers());
            } catch {
                toast.error('Failed to delete user.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            {adminLoading && <p>Loading...</p>}
            {error && <p>Error: {typeof error === 'object' && error !== null ? error.message || JSON.stringify(error) : error}</p>}

            {/* add new user form */}
            <div className="p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Add new user</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Add User
                    </button>
                </form>
            </div>

            {/* user list management */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="p-2 border rounded"
                                        disabled={user.isPermanent}
                                        title={user.isPermanent ? 'Cannot change role of permanent admin' : ''}
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        disabled={user.isPermanent}
                                        title={user.isPermanent ? 'Cannot delete permanent admin' : ''}
                                    >
                                        Delete
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

export default UserManagement;
