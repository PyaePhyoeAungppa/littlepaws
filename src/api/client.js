// Import db.json directly so it's bundled and available in production (Vercel)
import dbData from '../../db.json';

const API_BASE = 'http://localhost:3001';

// Detect whether we're running against a live json-server
let serverAvailable = null; // null = not yet checked

async function checkServer() {
    if (serverAvailable !== null) return serverAvailable;
    try {
        const res = await fetch(`${API_BASE}/products?_limit=1`, { signal: AbortSignal.timeout(800) });
        serverAvailable = res.ok;
    } catch {
        serverAvailable = false;
    }
    return serverAvailable;
}

// In-memory store for write operations when server is unavailable (e.g. Vercel demo)
const memoryStore = {};

function getMemoryCollection(endpoint) {
    if (!memoryStore[endpoint]) {
        // Seed from bundled db.json
        memoryStore[endpoint] = dbData[endpoint] ? [...dbData[endpoint]] : [];
    }
    return memoryStore[endpoint];
}

// --- Public API ---

/**
 * READ — returns an array from the collection.
 * In dev (json-server running): fetches from localhost:3001.
 * In production / server down: reads from the bundled db.json (+ any in-memory writes).
 */
export async function fetchFromMock(endpoint) {
    const live = await checkServer();
    if (live) {
        try {
            const res = await fetch(`${API_BASE}/${endpoint}`);
            if (res.ok) return res.json();
        } catch { /* fall through */ }
    }
    // Production fallback — return in-memory collection (seeded from db.json)
    return getMemoryCollection(endpoint);
}

/**
 * WRITE — POST / PUT / DELETE.
 * In dev: hits json-server.
 * In production: mutates the in-memory store so the UI stays consistent within the session.
 */
export async function writeMock(endpoint, method = 'POST', body = null, id = null) {
    const live = await checkServer();
    const url = id ? `${API_BASE}/${endpoint}/${id}` : `${API_BASE}/${endpoint}`;

    if (live) {
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            });
            if (res.ok) return res.json().catch(() => ({}));
        } catch { /* fall through */ }
    }

    // In-memory fallback
    const col = getMemoryCollection(endpoint);
    if (method === 'POST') {
        const item = { ...body, id: body?.id || String(Date.now()) };
        col.push(item);
        return item;
    }
    if (method === 'PUT' && id) {
        const idx = col.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) col[idx] = { ...col[idx], ...body };
        return col[idx] || {};
    }
    if (method === 'DELETE' && id) {
        const idx = col.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) col.splice(idx, 1);
        return {};
    }
    return {};
}
