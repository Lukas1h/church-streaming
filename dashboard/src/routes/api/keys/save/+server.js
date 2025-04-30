import { exec } from 'child_process';
import { docker, getContainerByName } from '$lib/docker/server/';
import fs from 'fs';
import path from 'path';

export async function POST({ params, request }) {
    let json = await request.json();
    console.log('json', json);

    try {
        const configPath = path.resolve('/setup/config.json');
        await fs.promises.writeFile(configPath, JSON.stringify(json, null, 2), 'utf-8');
        console.log('JSON object written to /setup/config.json');

        const { stdout, stderr } = await new Promise((resolve, reject) => {
            exec('/setup/build-conf.sh', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error.message}`);
                    reject(error);
                } else {
                    console.log(`Script output: ${stdout}`);
                    resolve({ stdout, stderr });
                }
            });
        });

        let nginxContainer = await getContainerByName('nginx');
        // let stunnelContainer = await getContainerByName('stunnel');

        await nginxContainer.restart({ t: 1 });
        // await stunnelContainer.restart({ t: 1 });

        if (stderr) {
            console.warn('Shell script stderr:', stderr);
        }
        console.log('Shell script stdout:', stdout);
        return new Response(JSON.stringify({ status: 'success', output: stdout }));
    } catch (err) {
        return new Response(JSON.stringify({ status: 'error', error: err.message }), { status: 500 });
    }
}