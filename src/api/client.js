export async function fetchFromMock(endpoint, options = {}) {
    const baseUrl = 'http://localhost:3001'; // Default json-server port
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
