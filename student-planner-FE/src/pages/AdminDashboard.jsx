import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

const AdminDashboard = () => {

    const [users, setUsers] = useState([]);
    const [eventCount, setEventCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    // fetch all users
    const fetchUsers = async () => {
        const res = await fetch(`${API_URL}/api/admin/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (data.success) {
            setUsers(data.data);
        }
    }

    // Fetch total events 
    const fetchEventCount = async () => {
        const res = await fetch(`${API_URL}/api/admin/events`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (data.success) {
            setEventCount(data.data.length);
        }
    }

    // Delete user
    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        const res = await fetch(`${API_URL}/api/admin/users/delete`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        if (data.success) {
            setUsers(users.filter((u) => u.id !== id));
            alert("User deleted successfully");
        } else {
            alert("Failed to delete user");
        }
    };

    useEffect(() => {
        Promise.all([fetchUsers(), fetchEventCount()]).then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading dashboard...</p>

    return (
        <div style={{ padding: "30px", fontFamily: "Arial" }}>

            <h1>Admin Dashboard</h1>

            {/* Summary cards */}
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <div style={{
                    padding: "20px",
                    background: "#f5f5f5",
                    borderRadius: "10px",
                    width: "200px",
                    textAlign: "center"
                }}>
                    <h3>Total Users</h3>
                    <h1>{users.length}</h1>
                </div>

                <div style={{
                    padding: "20px",
                    background: "#f5f5f5",
                    borderRadius: "10px",
                    width: "200px",
                    textAlign: "center"
                }}>
                    <h3>Total Events</h3>
                    <h1>{eventCount}</h1>
                </div>
            </div>

            {/* User table */}
            <h2 style={{ marginTop: "40px" }}>All Users</h2>

            <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.created_at}</td>

                            <td>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    style={{
                                        background: "red",
                                        color: "white",
                                        padding: "5px 10px",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}

export default AdminDashboard;