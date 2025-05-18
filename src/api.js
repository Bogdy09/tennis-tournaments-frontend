import axios from "axios";
import { queueOperation } from './utils/offlineQueue.js';
const API_URL = 'hhttps://tennis-backend-ioen.onrender.com';



export const getTournaments = async () => {
    const response = await fetch("https://tennis-backend-ioen.onrender.com/api/tournaments");
    if (!response.ok) throw new Error("Failed to fetch tournaments");
    return await response.json(); // should be { tournaments: [...] } or just [...]
};

// In api.js
export async function getPlayers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/players?${params}`);
    if (!res.ok) throw new Error('Failed to load players');
    return res.json();
}


export async function addPlayer(player) {
    const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
    if (!res.ok) throw new Error('Failed to add player');
}

export async function updatePlayer(id, player) {
    const res = await fetch(`/api/players/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
    if (!res.ok) throw new Error('Failed to update player');
}

export async function deletePlayer(id) {
    const res = await fetch(`/api/players/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete player');
}


export const getTournamentById = async (id, isOnline, serverAvailable) => {
    if (!isOnline || !serverAvailable) {
        const local = localStorage.getItem('offline_local_tournaments');
        const list = local ? JSON.parse(local) : [];
        return list.find(t => t.id === Number(id)) || null;
    }

    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
export const createTournament = async (tournament, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId'); 
    console.log('isOnline:', isOnline, 'serverAvailable:', serverAvailable);
    if (!isOnline || !serverAvailable) {
        queueOperation({ type: 'POST', data: { ...tournament, userId } });

        const local = JSON.parse(localStorage.getItem('offline_local_tournaments') || '[]');
        local.push({ ...tournament, id: Date.now() });
        localStorage.setItem('offline_local_tournaments', JSON.stringify(local));

        return { queued: true };
    }
    console.log('Sending tournament with userId:', localStorage.getItem('userId'));


    const res = await fetch('https://tennis-backend-ioen.onrender.com/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tournament, userId }), 
    });

    if (!res.ok) throw new Error('Network error');
    return await res.json();
};

export const deleteTournament = async (id, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId'); 
    if (!isOnline || !serverAvailable) {
        queueOperation({ type: 'DELETE', id });
        return { queued: true };
    }

    try {
        await axios.delete(`${API_URL}/${id}`, {
            data: { userId }
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to delete tournament:', error);
        throw error; // Or return { success: false, error }
    }
};
export const updateTournament = async (id, updates, isOnline, serverAvailable) => {
    console.log("hi");
    const userId = localStorage.getItem('userId'); 
    if (!isOnline || !serverAvailable) {
        queueOperation({ type: 'PATCH', id, data: updates, userId });
        return { queued: true };
    }
    console.log('Updating tournament with userId:', localStorage.getItem('userId'));
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { ...updates, userId }, {

            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update tournament:', error);
        throw error;
    }
};