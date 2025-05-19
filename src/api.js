import axios from "axios";
import { queueOperation } from './utils/offlineQueue.js';

const API_URL = 'https://tennis-backend-ioen.onrender.com';

// Players API
export async function getPlayers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/api/players?${params}`);
    if (!res.ok) throw new Error('Failed to load players');
    return res.json();
}

export async function addPlayer(player) {
    const res = await fetch(`${API_URL}/api/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
    if (!res.ok) throw new Error('Failed to add player');
    return res.json();
}

export async function updatePlayer(id, player) {
    const res = await fetch(`${API_URL}/api/players/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
    if (!res.ok) throw new Error('Failed to update player');
    return res.json();
}

export async function deletePlayer(id) {
    const res = await fetch(`${API_URL}/api/players/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete player');
    return res.json();
}

// Tournaments API
export const getTournaments = async () => {
    const response = await fetch(`${API_URL}/api/tournaments`);
    if (!response.ok) throw new Error("Failed to fetch tournaments");
    return await response.json();
};

export const getTournamentById = async (id, isOnline, serverAvailable) => {
    if (!isOnline || !serverAvailable) {
        const local = localStorage.getItem('offline_local_tournaments');
        const list = local ? JSON.parse(local) : [];
        return list.find(t => t.id === Number(id)) || null;
    }
    const response = await axios.get(`${API_URL}/api/tournaments/${id}`);
    return response.data;
};

export const createTournament = async (tournament, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId');
    
    if (!isOnline || !serverAvailable) {
        queueOperation({ 
            type: 'POST', 
            data: { ...tournament, userId },
            url: `${API_URL}/api/tournaments`
        });

        const local = JSON.parse(localStorage.getItem('offline_local_tournaments') || '[]');
        local.push({ ...tournament, id: Date.now() });
        localStorage.setItem('offline_local_tournaments', JSON.stringify(local));

        return { queued: true };
    }

    const res = await fetch(`${API_URL}/api/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tournament, userId })
    });

    if (!res.ok) throw new Error('Failed to create tournament');
    return await res.json();
};

export const updateTournament = async (id, updates, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId');
    
    if (!isOnline || !serverAvailable) {
        queueOperation({ 
            type: 'PATCH', 
            id, 
            data: updates, 
            userId,
            url: `${API_URL}/api/tournaments/${id}`
        });
        return { queued: true };
    }

    try {
        const response = await axios.patch(
            `${API_URL}/api/tournaments/${id}`, 
            { ...updates, userId },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to update tournament:', error);
        throw error;
    }
};

export const deleteTournament = async (id, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId');
    
    if (!isOnline || !serverAvailable) {
        queueOperation({ 
            type: 'DELETE', 
            id,
            url: `${API_URL}/api/tournaments/${id}`,
            data: { userId }
        });
        return { queued: true };
    }

    try {
        await axios.delete(`${API_URL}/api/tournaments/${id}`, {
            data: { userId }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to delete tournament:', error);
        throw error;
    }
};
