const LOCAL_STORAGE_KEY = 'tournament_offline_queue';

function getLocalTournaments() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveLocalTournaments(tournaments) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tournaments));
}

export function getQueue() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function queueOperation(op) {
    const queue = getQueue();
    queue.push(op);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(queue));

    if (op.type === 'POST') {
        const local = JSON.parse(localStorage.getItem('offline_local_tournaments') || '[]');
        local.push({ ...op.data, id: Date.now() }); // generate a temp ID
        localStorage.setItem('offline_local_tournaments', JSON.stringify(local));
    }
}


const API_URL = "https://tennis-backend-ioen.onrender.com";

export async function syncQueue(isOnline, serverAvailable) {
    if (!isOnline || !serverAvailable) return;

    const queue = getQueue();
    const remainingOps = [];

    for (let op of queue) {
        try {
            if (op.type === 'POST') {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(op.data),
                });
                if (!res.ok) throw new Error("POST failed");
            } else if (op.type === 'DELETE') {
                await fetch(`${API_URL}/${op.id}`, { method: 'DELETE' });
            } else if (op.type === 'PATCH') {
                await fetch(`${API_URL}/${op.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(op.data),
                });
            }
        } catch (err) {
            console.error('Sync failed for operation:', op);
            remainingOps.push(op);
        }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remainingOps));

    // Remove offline-local tournaments ONLY if no remaining POST ops
    if (!remainingOps.some(op => op.type === 'POST')) {
        localStorage.removeItem('offline_local_tournaments');
    }
}
