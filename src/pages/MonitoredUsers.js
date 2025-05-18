import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MonitoredUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const loggedInUsername = localStorage.getItem("username"); // or from context

    useEffect(() => {
        const fetchMonitoredUsers = async () => {
            if (loggedInUsername !== "admin") return;

            try {
                const response = await axios.get(`/api/monitored-users?username=${loggedInUsername}`);
                setUsers(response.data);
            } catch (err) {
                setError("Failed to load monitored users");
                console.error(err);
            }
        };

        fetchMonitoredUsers();
    }, [loggedInUsername]);

    if (loggedInUsername !== "admin") return null;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Suspicious Users</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {users.map(u => (
                    <li key={u.id}>
                         User ID: {u.userId}, Username: {u.username || "N/A"}, Reason: {u.reason}
                    </li>
                ))}
            </ul>
        </div>
    );
}
