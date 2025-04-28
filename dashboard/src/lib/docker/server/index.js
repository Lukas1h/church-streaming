// docker.js
import Docker from 'dockerode';

export const docker = new Docker({ socketPath: '/var/run/docker.sock' });




export async function getContainerByName(name) {
    try {
        const containers = await docker.listContainers({ all: true });
        const containerInfo = containers.find(c =>
            c.Names.some(n => n.replace(/^\//, '') === name)
        );

        if (!containerInfo) {
            throw new Error(`Container with name "${name}" not found.`);
        }

        const container = docker.getContainer(containerInfo.Id);
        return container;
    } catch (err) {
        console.error(err);
        return null;
    }
}