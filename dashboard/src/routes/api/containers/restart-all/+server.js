import { docker } from '$lib/docker/server/';

export async function GET({ params }) {
    try {
        const containers = await docker.listContainers();

        for (const containerInfo of containers) {
            const container = docker.getContainer(containerInfo.Id);

            // Stop the container
            await container.stop();
            console.log(`Stopped container: ${containerInfo.Names[0]}`);

            // Wait for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Start the container
            await container.start();
            console.log(`Started container: ${containerInfo.Names[0]}`);
        }

        return new Response(JSON.stringify({ status: 'restarted' }));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}