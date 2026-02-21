// Central API helper — attaches the JWT token to every request

const API_BASE = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

export const api = {
    get: (path: string) => apiFetch(path),
    post: (path: string, body: any) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path: string, body: any) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
};
