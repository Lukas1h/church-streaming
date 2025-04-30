

import { docker, getKeys } from '$lib/docker/server/';

export async function GET() {
    try {
        const keys = await getKeys();
        console.log('keys', keys);
        return new Response(JSON.stringify(keys), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500
        });
    }


}