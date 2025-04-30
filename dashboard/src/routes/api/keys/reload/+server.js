import { exec } from 'child_process';
import { docker, getContainerByName } from '$lib/docker/server/';



export async function GET({ params }) {
    // const id = params.id;

    try {
        const { stdout, stderr } = await new Promise((resolve, reject) => {
            exec('/setup/build-conf.sh', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
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
        return new Response(JSON.stringify({ status: 'success', output: stdout }));
    } catch (err) {
        return new Response(JSON.stringify({ status: 'error', error: err.message }), { status: 500 });
    }



}