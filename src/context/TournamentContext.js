import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [latestTournament, setLatestTournament] = useState(null);


    const API_URL = "https://tennis-backend-ioen.onrender.com/api/tournaments";

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(API_URL);
                const responseData = response.data;

                let tournamentsArray = [];

                if (Array.isArray(responseData)) {
                    tournamentsArray = responseData;
                } else if (Array.isArray(responseData?.tournaments)) {
                    tournamentsArray = responseData.tournaments;
                }

                setTournaments(tournamentsArray);

            } catch (err) {
                setError(err.message || 'Failed to load tournaments');
                setTournaments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();

        //  WebSocket setup
        const socket = io("https://tennis-backend-ioen.onrender.com/api/tournaments");

        socket.on("connect", () => {
            console.log(" Connected to WebSocket server");
        });

        socket.on("new-tournament", (newTournament) => {
            setTournaments(prev => [...prev, newTournament]);
            setLatestTournament(newTournament); //  track this
        });


        socket.on("disconnect", () => {
            console.log(" Disconnected from WebSocket server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const addTournament = async (newTournament) => {
        try {
            const response = await axios.post(API_URL, newTournament);
            setTournaments(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw new Error("API Error: " + err.message);
        }
    };

    const deleteTournament = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTournaments(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            throw new Error("API Error: " + err.message);
        }
    };

    const updateTournament = async (id, updatedFields) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}`, updatedFields);
            setTournaments(prev =>
                prev.map(t => (t.id === id ? response.data : t))
            );
            return response.data;
        } catch (err) {
            throw new Error("API Error: " + err.message);
        }
    };

    return (
        <TournamentContext.Provider value={{
            tournaments,
            loading,
            error,
            addTournament,
            deleteTournament,
            updateTournament,
            latestTournament
        }}>
            {children}
        </TournamentContext.Provider>
    );
};
