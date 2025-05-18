
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Add this import
//import { TournamentContext } from "../context/TournamentContext.js";
import { updateTournament } from "../api.js"; 


// Define API_URL (best practice: use environment variable)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/tournaments";

export default function EditTournament({ isOnline, serverAvailable }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    //const { tournaments, updateTournament } = useContext(TournamentContext);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);

    // Initialize form with either location state or empty values
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        date: "",
        prize: "",
        favoritePlayerId: ""
    });

    useEffect(() => {
        const loadTournament = async () => {
            setLoading(true);
            try {
                // Try location state first
                if (location.state?.tournament) {
                    setFormData(location.state.tournament);
                    return;
                }

                // Fallback to context
                const response = await axios.get(`${API_URL}/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Failed to load tournament:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadTournament();
    }, [id, location.state]);

    if (loading) return <div>Loading tournament data...</div>;
    if (error) return <div>Error loading tournament: {error}</div>;
    if (!formData.id) return <div>Tournament not found</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateTournament(Number(id), formData, isOnline, serverAvailable);
        navigate("/");
    };

    // Show loading only if we have no data at all
    if (!formData.name && !location.state?.tournament) {
        return <div>Loading tournament data...</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Edit Tournament</h2>
            <form onSubmit={handleSubmit}>
                
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    //required
                />
                <input
                    type="text"
                    placeholder="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    //required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    //required
                />
                <input
                    type="text"
                    placeholder="Prize"
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    //required
                />
                <input
                    type="text"
                    placeholder="Favorite Player"
                    name="favoritePlayerId"
                    value={formData.favoritePlayer}
                    onChange={handleChange}
                />

                
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}