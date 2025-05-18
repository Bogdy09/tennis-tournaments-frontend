import React, { useEffect, useState } from 'react';
import { getPlayers, addPlayer, deletePlayer, updatePlayer } from '../api.js';

export default function ViewPlayers() {
    const [players, setPlayers] = useState([]);
    const [form, setForm] = useState({ name: '', country: '', ranking: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nameFilter, setNameFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        fetchData();
    }, [nameFilter, sortOrder]); // <-- add these dependencies


    const fetchData = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (nameFilter) filters.name = nameFilter;
            if (sortOrder) filters.sort = sortOrder;

            const data = await getPlayers(filters);
            setPlayers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    async function handleAdd() {
        try {
            await addPlayer(form);
            setForm({ name: '', country: '', ranking: '' });
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure?")) {
            await deletePlayer(id);
            fetchData();
        }
    }

    async function handleUpdate() {
        try {
            await updatePlayer(editingId, form);
            setEditingId(null);
            setForm({ name: '', country: '', ranking: '' });
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    }

    function startEdit(player) {
        setEditingId(player.id);
        setForm({ name: player.name, country: player.country, ranking: player.ranking });
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Players</h1>
            {/* Filter & Sort Controls */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                    <option value="">Sort by Ranking</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                <input placeholder="Ranking" type="number" value={form.ranking} onChange={e => setForm({ ...form, ranking: e.target.value })} />
                {editingId ?
                    <button onClick={handleUpdate}>Update</button> :
                    <button onClick={handleAdd}>Add</button>}
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {players.map(player => (
                    <li key={player.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                        <strong>{player.name}</strong> — {player.country}, Rank: {player.ranking}
                        <div>
                            <button onClick={() => startEdit(player)}>Edit</button>
                            <button onClick={() => handleDelete(player.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
