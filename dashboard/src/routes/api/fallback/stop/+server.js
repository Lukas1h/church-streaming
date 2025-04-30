export async function POST({ params }) {
    try {
        const responce = await fetch('http://fallback/api/monitoring/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await responce.json();

        if (responce.ok && data) {
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            throw new Error('Failed to stop container');
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}