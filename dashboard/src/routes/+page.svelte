<script>
    import { onMount } from "svelte";
    import { cn } from "@sglara/cn";
    import {
        restartContainer,
        reloadKeys,
        getContainers,
        getNginxStats,
    } from "$lib/docker/client";

    let logs = "";
    let containers = null;
    let nginxStats = null; //{"http-flv":{"nginx_version":"1.26.3","nginx_http_flv_version":"1.2.12","compiler":"gcc 14.2.0 (Alpine 14.2.0) ","built":"Apr 28 2025 19:56:03","pid":17,"uptime":47,"naccepted":0,"bw_in":0,"bytes_in":0,"bw_out":0,"bytes_out":0,"servers":[{"port":1935,"server_index":0,"applications":[{"name":"live","live":{"streams":[],"nclients":0},"recorders":{"count":1,"lists":[{"id":"","flags":["off"],"unique":false,"append":false,"lock_file":false,"notify":false,"path":"","max_size":0,"max_frames":0,"interval":18446744073709551615,"suffix":".flv"}]}}]}]}}
    let isLive = false;
    let stream = null;

    onMount(async () => {
        const source = new EventSource("/api/logs");
        source.onmessage = (event) => {
            logs += event.data + "\n";
        };

        let refreshIntervalId = setInterval(() => {
            getContainers()
                .then((data) => {
                    containers = data;
                })
                .catch((error) => {
                    console.error("Error fetching containers:", error);
                });

            getNginxStats()
                .then((data) => {
                    nginxStats = data;

                    // Update isLive based on whether any client is publishing
                    isLive = nginxStats["http-flv"].servers.some((server) =>
                        server.applications.some((app) =>
                            app.live.streams.some((stream) =>
                                stream.clients.some(
                                    (client) => client.publishing,
                                ),
                            ),
                        ),
                    );

                    // Update stream variable if any client is publishing
                    stream =
                        nginxStats["http-flv"].servers
                            .flatMap((server) =>
                                server.applications.flatMap((app) =>
                                    app.live.streams.filter((stream) =>
                                        stream.clients.some(
                                            (client) => client.publishing,
                                        ),
                                    ),
                                ),
                            )
                            .map((stream) => stream.name)[0] || null;
                })
                .catch((error) => {
                    console.error("Error fetching nginx stats:", error);
                });
        }, 1000);

        return () => {
            source.close();
            clearInterval(refreshIntervalId);
        };
    });
</script>

<header
    class="bg-gray-800 p-4 border-gray-700 border-b-2 flex items-center justify-between h-[4rem]"
>
    <h1 class="text-3xl font-bold text-slate-200">Dashboard</h1>
    <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
            <p
                class={cn(
                    "text-sm font-semibold px-3 py-1 rounded-xl border-gray-700 border-2 flex items-center justify-center h-10",
                    "bg-gray-900 text-white",
                )}
            >
                BW In: {nginxStats?.["http-flv"]?.servers?.[0]
                    ?.applications?.[0]?.live?.streams?.[0]?.bw_in || 0} bps
            </p>
            <p
                class={cn(
                    "text-sm font-semibold px-3 py-1 rounded-xl border-gray-700 border-2 flex items-center justify-center h-10",
                    "bg-gray-900 text-white",
                )}
            >
                BW Out: {nginxStats?.["http-flv"]?.servers?.[0]
                    ?.applications?.[0]?.live?.streams?.[0]?.bw_out || 0} bps
            </p>
        </div>
        <p
            class={cn(
                "text-xl font-semibold px-3 py-1 rounded-xl border-gray-700 border-2 flex items-center justify-center h-10",
                stream === "stream" ? "bg-green-500" : "bg-red-500 flash",
            )}
        >
            {stream === "backup"
                ? "Fallback"
                : stream === "stream"
                  ? "Primary"
                  : "Unknown"}
        </p>

        <p
            class={cn(
                "text-2xl font-extrabold px-3 py-1 bg-gray-900 rounded-xl border-gray-700 border-2 flex items-center justify-center h-10",
                isLive ? "bg-green-500" : "bg-red-500 flash",
            )}
        >
            {isLive ? "ON AIR" : "OFF AIR"}
        </p>
    </div>
</header>

<div class="bg-gray-900 text-white min-h-screen">
    <div class="grid grid-cols-2 gap-4 p-4">
        <div class="bg-gray-800 p-4 rounded-lg space-y-2">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-white">Keys</h2>
                <button
                    class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                    on:click={reloadKeys}
                >
                    Save
                </button>
            </div>
            <div class="space-y-2">
                <div>
                    <label for="youtube-key" class="block text-gray-400"
                        >YouTube Stream Key</label
                    >
                    <input
                        id="youtube-key"
                        type="text"
                        class="w-full p-2 bg-gray-700 text-white rounded-lg border-gray-600 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter YouTube Stream Key"
                    />
                </div>
                <div>
                    <label for="facebook-key" class="block text-gray-400"
                        >Facebook Stream Key</label
                    >
                    <input
                        id="facebook-key"
                        type="text"
                        class="w-full p-2 bg-gray-700 text-white rounded-lg border-gray-600 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Facebook Stream Key"
                    />
                </div>
                <div>
                    <label for="instagram-key" class="block text-gray-400"
                        >Instagram Stream Key</label
                    >
                    <input
                        id="instagram-key"
                        type="text"
                        class="w-full p-2 bg-gray-700 text-white rounded-lg border-gray-600 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Instagram Stream Key"
                    />
                </div>
            </div>
        </div>

        <div class="bg-gray-800 p-4 rounded-lg space-y-4">
            <h2 class="text-xl font-bold text-white">Containers</h2>

            <div class="space-y-2">
                {#each containers as container}
                    <div
                        class="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                        <div class="flex items-center space-x-2">
                            <span class="text-white font-medium"
                                >{container.Names[0]}</span
                            >
                            <span class="text-gray-400 text-sm"
                                >{container.Status}</span
                            >
                        </div>
                        <div class="flex items-center space-x-2">
                            <span
                                class={cn(
                                    "px-3 py-1 rounded-full text-sm font-semibold",
                                    container.State === "running"
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white",
                                )}>{container.State}</span
                            >
                            <button
                                class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                                on:click={() => restartContainer(container)}
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg space-y-4">
            <h2 class="text-xl font-bold text-white">NGINX Stats</h2>

            <div class="space-y-2">
                {#if nginxStats}
                    <div class="bg-gray-700 p-3 rounded-lg">
                        <h3 class="text-lg font-semibold text-white">
                            General Stats
                        </h3>
                        <ul class="text-gray-400 text-sm space-y-1">
                            <li>
                                <strong>Version:</strong>
                                {nginxStats["http-flv"].nginx_version}
                            </li>
                            <li>
                                <strong>Uptime:</strong>
                                {nginxStats["http-flv"].uptime} seconds
                            </li>
                            <li>
                                <strong>Accepted Connections:</strong>
                                {nginxStats["http-flv"].naccepted}
                            </li>
                            <li>
                                <strong>Bandwidth In:</strong>
                                {nginxStats["http-flv"].bw_in} bps
                            </li>
                            <li>
                                <strong>Bytes In:</strong>
                                {nginxStats["http-flv"].bytes_in} bytes
                            </li>
                            <li>
                                <strong>Bandwidth Out:</strong>
                                {nginxStats["http-flv"].bw_out} bps
                            </li>
                            <li>
                                <strong>Bytes Out:</strong>
                                {nginxStats["http-flv"].bytes_out} bytes
                            </li>
                        </ul>
                    </div>
                    {#each nginxStats["http-flv"].servers as server}
                        <div class="bg-gray-700 p-3 rounded-lg">
                            <h3 class="text-lg font-semibold text-white">
                                Server Port: {server.port}
                            </h3>
                            <ul class="text-gray-400 text-sm space-y-1">
                                {#each server.applications as app}
                                    <li>
                                        <strong>Application:</strong>
                                        {app.name}
                                        <ul class="ml-4">
                                            <li>
                                                <strong>Clients:</strong>
                                                {app.live.nclients}
                                            </li>
                                            <li>
                                                <strong>Streams:</strong>
                                                {#if app.live.streams.length > 0}
                                                    <ul class="ml-4">
                                                        {#each app.live.streams as stream}
                                                            <li>
                                                                <strong
                                                                    >Stream
                                                                    Name:</strong
                                                                >
                                                                {stream.name}
                                                                <ul
                                                                    class="ml-4"
                                                                >
                                                                    <li>
                                                                        <strong
                                                                            >Bandwidth
                                                                            In:</strong
                                                                        >
                                                                        {stream.bw_in}
                                                                        bps
                                                                    </li>
                                                                    <li>
                                                                        <strong
                                                                            >Bytes
                                                                            In:</strong
                                                                        >
                                                                        {stream.bytes_in}
                                                                        bytes
                                                                    </li>
                                                                    <li>
                                                                        <strong
                                                                            >Bandwidth
                                                                            Out:</strong
                                                                        >
                                                                        {stream.bw_out}
                                                                        bps
                                                                    </li>
                                                                    <li>
                                                                        <strong
                                                                            >Bytes
                                                                            Out:</strong
                                                                        >
                                                                        {stream.bytes_out}
                                                                        bytes
                                                                    </li>
                                                                    <li>
                                                                        <strong
                                                                            >Clients:</strong
                                                                        >
                                                                        {#each stream.clients as client}
                                                                            <ul
                                                                                class="ml-4"
                                                                            >
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >ID:</strong
                                                                                    >
                                                                                    {client.id}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Address:</strong
                                                                                    >
                                                                                    {client.address}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Time:</strong
                                                                                    >
                                                                                    {client.time}
                                                                                    seconds
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Flash
                                                                                        Version:</strong
                                                                                    >
                                                                                    {client.flashver}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Page
                                                                                        URL:</strong
                                                                                    >
                                                                                    {client.pageurl}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Dropped:</strong
                                                                                    >
                                                                                    {client.dropped}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >AV
                                                                                        Sync:</strong
                                                                                    >
                                                                                    {client.avsync}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Publishing:</strong
                                                                                    >
                                                                                    {client.publishing
                                                                                        ? "Yes"
                                                                                        : "No"}
                                                                                </li>
                                                                                <li
                                                                                >
                                                                                    <strong
                                                                                        >Active:</strong
                                                                                    >
                                                                                    {client.active
                                                                                        ? "Yes"
                                                                                        : "No"}
                                                                                </li>
                                                                            </ul>
                                                                        {/each}
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                        {/each}
                                                    </ul>
                                                {:else}
                                                    None
                                                {/if}
                                            </li>
                                        </ul>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                {:else}
                    <p class="text-gray-400">No NGINX stats available.</p>
                {/if}
            </div>
        </div>

        <div
            class="bg-gray-800 p-4 rounded-lg col-span-1 space-y-2 max-h-full flex flex-col"
        >
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-white">Logs</h2>
            </div>

            <!-- <pre
                class="bg-black text-green-400 p-4 text-sm flex flex-col-reverse overflow-auto rounded-md flex-1">
                <div class="">{logs}</div>
            
            </pre> -->
        </div>

        <div
            class="bg-gray-800 p-4 rounded-lg col-span-2 space-y-2 max-h-full flex flex-col"
        >
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-white">Logs</h2>
            </div>

            <pre
                class="bg-black text-green-400 p-4 text-sm flex flex-col-reverse overflow-auto rounded-md flex-1 max-h-[10rem]">
                <div class="">{logs}</div>
            
            </pre>
        </div>
    </div>
</div>

<!-- <div>
    <h1 class="text-2xl font-bold text-left text-white">Logs</h1>
    <p class="text-center text-gray-400">This is a live log viewer.</p>
</div>
<pre class="bg-black text-green-400 p-4 text-sm overflow-y-scroll h-96">
    {logs}
</pre> -->

<style>
    /* Add a flashing animation with no fading */
    @keyframes flash {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.2;
        }
    }

    .flash {
        animation: flash 1.5s steps(1, end) infinite;
    }
</style>
