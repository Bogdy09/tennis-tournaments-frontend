

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTournamentById } from "../api.js";

export default function ViewTournament({ isOnline, serverAvailable }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        getTournamentById(id, isOnline, serverAvailable).then(setTournament).catch(() => setTournament(null));
    }, [id]);

    if (!tournament) {
        return <div>Tournament not found</div>;
    }

    return (
        <div>
            <h2>{tournament.name}</h2>
            <p><strong>Location:</strong> {tournament.location}</p>
            <p><strong>Date:</strong> {new Date(tournament.date).toLocaleDateString()}</p>
            <p><strong>Prize:</strong> {tournament.prize}</p>
            <p><strong>Favorite Player:</strong> {tournament.favoritePlayerName || "Unknown"}</p>

            <button onClick={() => navigate("/")}>Back to Tournaments</button>
        </div>
    );
}
