import React, { useEffect, useState } from "react";
import { getAllUsers, getAllEvents, adminDeleteUser } from "../api/client";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [eventCount, setEventCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const users = await getAllUsers();
            const events = await getAllEvents();
            setUsers(users);
            setEventCount(events.length);
            setLoading(false);
        }
        load();
    }, []);

    async function deleteUser(id) {
        if (!window.confirm("Delete this user?")) return;

        try {
            await adminDeleteUser(id);
            alert("User deleted successfully");

            // remove deleted user from UI
            setUsers((prev) => prev.filter((u) => u.id !== id));

        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete user");
        }
    }

    if (loading) return <p>Loading dashboard...</p>

    return (
        <div className="mobile-main">
            <div className="panel-shell">

                <h1>Admin Dashboard</h1>

                {/* Summary cards */}
                <div className="chip-row" style={{ marginTop: "20px" }}>
                    <div className="panel-shell" style={{ width: "200px", textAlign: "center", padding: "12px" }}>
                        <h3>Total Users</h3>
                        <h1>{users.length}</h1>
                    </div>

                    <div className="panel-shell" style={{ width: "200px", textAlign: "center", padding: "12px" }}>
                        <h3>Total Events</h3>
                        <h1>{eventCount}</h1>
                    </div>
                </div>

                {/* User table */}
                <h2 style={{ marginTop: "40px" }}>All Users</h2>

                <div style={{ marginTop: "20px" }}>
                    <table style={{ width: "100%" }}>
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
                                <button onClick={() => deleteUser(user.id)} className="btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;