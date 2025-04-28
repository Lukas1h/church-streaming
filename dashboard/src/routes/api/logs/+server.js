import { PassThrough } from 'stream';
import { docker, getContainerByName } from '$lib/docker/server/';

export const GET = async ({ setHeaders }) => {
    const stream = new PassThrough();

    setHeaders({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const containers = ['nginx', 'dashboard', 'stunnel'];

    const attachLogs = async (name) => {
        try {
            const container = docker.getContainer(name);
            const logStream = await container.logs({
                follow: true,
                stdout: true,
                stderr: true,
                tail: 100,
            });

            logStream.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(Boolean);
                for (const line of lines) {
                    stream.write(`data: [${name}] ${line}\n\n`);
                }
            });

            logStream.on('error', (err) => {
                stream.write(`data: [${name} error] ${err.toString()}\n\n`);
            });

            logStream.on('end', async () => {
                stream.write(`data: [${name}] log stream closed\n\n`);
                // Reattach logs after a delay to handle restarts
                setTimeout(() => attachLogs(name), 1000);
            });
        } catch (err) {
            stream.write(`data: [${name} error] ${err.message}\n\n`);
            // Retry attaching logs after a delay in case of failure
            setTimeout(() => attachLogs(name), 1000);
        }
    };

    containers.forEach((name) => attachLogs(name));

    return new Response(stream);
};