import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournaments, deleteTournament } from "../api.js";


export default function Home() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getTournaments();
                console.log("Fetched:", response);
                setTournaments(response.tournaments || []);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch tournaments.");
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    const handleView = (tournament) => {
        navigate(`/edit-tournament/${tournament.id}`, {
            state: { tournament, from: "home" }
        });
    };

    const handleDelete = async (id) => {
        const isOnline = navigator.onLine;
        const serverAvailable = true;

        const result = await deleteTournament(id, isOnline, serverAvailable);

        if (result.success || result.queued) {
            setTournaments((prev) => prev.filter(t => t.id !== id));
        }
    };


    return (
        <div style={{ padding: "20px" }}>
            <h1>Tournaments List</h1>

            {loading && <p>Loading tournaments...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && tournaments.length === 0 && <p>No tournaments available.</p>}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {tournaments.map((tournament) => (
                    <li key={tournament.id} style={{
                        marginBottom: "15px",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <h3 style={{ margin: "0 0 5px 0" }}>{tournament.name}</h3>
                            <p style={{ margin: "0" }}>
                                {tournament.location} • {new Date(tournament.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleView(tournament)}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#2196F3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginRight: "10px"
                                }}
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleDelete(tournament.id)}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#ff4d4d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
