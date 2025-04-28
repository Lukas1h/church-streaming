import { docker, getContainerByName } from '$lib/docker/server/';

export async function POST({ params }) {
    const id = params.id;
    const container = docker.getContainer(id);

    try {
        await container.restart({ t: 1 });
        return new Response(JSON.stringify({ status: 'restarted' }));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}