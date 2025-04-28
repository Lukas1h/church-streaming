import { docker, getContainerByName } from '$lib/docker/server/';

export async function GET() {
    try {
        const containers = await docker.listContainers({ all: true });
        return new Response(JSON.stringify(containers), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500
        });
    }


}