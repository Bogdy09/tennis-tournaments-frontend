import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Home from "./pages/Home.js";
import AddTournament from "./pages/AddTournament.js";
import ViewTournament from "./pages/ViewTournament.js";
import EditTournament from "./pages/EditTournament.js";
import "./App.css";
import TournamentCharts from "./pages/TournamentsCharts.js";
import ReactDOM from "react-dom";
import ViewPlayers from './pages/ViewPlayers.js';
import LoginForm from './pages/LoginForm.jsx';
import Register from './pages/Register.jsx';
import MonitoredUsers from './pages/MonitoredUsers.js';

import { useEffect, useState } from "react";
import { syncQueue } from "./utils/offlineQueue.js";

export default function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [serverAvailable, setServerAvailable] = useState(true);

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        const pingServer = async () => {
            try {
                const res = await fetch("https://tennis-backend-ioen.onrender.com/api/tournaments");
                setServerAvailable(res.ok);
            } catch (err) {
                setServerAvailable(false);
            }
        };
        pingServer();
        const interval = setInterval(pingServer, 10000); // check every 10s

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOnline && serverAvailable) {
            syncQueue(isOnline, serverAvailable);
        }
    }, [isOnline, serverAvailable]);
    return (
        <Router>
            <Navbar isOnline={isOnline} serverAvailable={serverAvailable} />
            <Routes>
                <Route path="/" element={<Home />} />
               
                    <Route path="/" element={<Home isOnline={isOnline} serverAvailable={serverAvailable} />} />
           
                    <Route path="/add-tournament" element={<AddTournament isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/edit-tournament/:id" element={<EditTournament isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/view-tournament/:id" element={<ViewTournament isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/players" element={<ViewPlayers isOnline={isOnline} serverAvailable={serverAvailable} />} />

                <Route path="/charts" element={<TournamentCharts />} />
                <Route path="/players" element={<ViewPlayers isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/auth/login" element={<LoginForm isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/auth/register" element={<Register isOnline={isOnline} serverAvailable={serverAvailable} />} />
                <Route path="/monitored-users" element={<MonitoredUsers isOnline={isOnline} serverAvailable={serverAvailable} />} />
          

               


            </Routes>
        </Router>
    );
}
