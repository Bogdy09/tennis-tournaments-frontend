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
   
    const response = await axios.get(`${API_URL}/api/tournaments/${id}`);
    return response.data;
};

export const createTournament = async (tournament, isOnline, serverAvailable) => {
    const userId = localStorage.getItem('userId');
    
    
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
