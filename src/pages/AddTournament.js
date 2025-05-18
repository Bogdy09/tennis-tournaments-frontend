import React, { useState } from "react";
import { createTournament } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function AddTournament({ isOnline, serverAvailable }) {
    const [form, setForm] = useState({ name: "", location: "", date: "", prize: "", favoritePlayer: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tournamentToSend = {
                ...form,
                favoritePlayerId: parseInt(form.favoritePlayer) || null,
                prizeMoney: form.prize
            };
            delete tournamentToSend.favoritePlayer;
            delete tournamentToSend.prize;

            await createTournament(tournamentToSend, isOnline, serverAvailable);
            navigate("/");
        } catch (err) {
            alert(err.message); // Or show more nicely in the UI
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="location" placeholder="Location" onChange={handleChange} required />
            <input name="date" type="date" onChange={handleChange} required />
            <input name="prize" placeholder="Prize" onChange={handleChange} required />
            <input name="favoritePlayer" placeholder="Favorite Player" onChange={handleChange} required />
            <button type="submit">Add Tournament</button>
        </form>
    );
}