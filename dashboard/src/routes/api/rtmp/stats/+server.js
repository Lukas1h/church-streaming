import { docker, getContainerByName } from '$lib/docker/server/';

export async function GET() {
    try {
        const request = await fetch('http://nginx:80/stats');
        if (!request.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await request.json();
        return new Response(JSON.stringify(data));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500
        });
    }


}


