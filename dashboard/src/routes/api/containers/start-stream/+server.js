import { exec } from 'child_process';

export async function POST() {
    try {
        await new Promise((resolve, reject) => {
            exec('docker start fallback', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        return new Response(JSON.stringify({ status: 'on-demand profile started' }));
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}