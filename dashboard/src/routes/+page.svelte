<script>
    import { onMount } from "svelte";
    import { cn } from "@sglara/cn";
    import { restartContainer, reloadKeys } from "$lib/docker/client";

    let logs = "";
    let containers = null;
    let isLive = true;

    onMount(async () => {
        const source = new EventSource("/api/logs");
        source.onmessage = (event) => {
            logs += event.data + "\n";
        };

        let refreshIntervalId = setInterval(() => {
            fetch("/api/containers")
                .then((response) => response.json())
                .then((data) => {
                    containers = data;
                    console.log("Containers: ", containers);
                });
        }, 1000);

        // console.log("Containers: ", containers);

        return () => {
            source.close();
            clearInterval(refreshIntervalId);
        };
    });
</script>

<div class="bg-gray-900 text-white h-screen">
    <header
        class="bg-gray-800 p-4 border-gray-700 border-b-2 flex items-center justify-between h-[4rem]"
    >
        <h1 class="text-3xl font-bold text-slate-200">Dashboard</h1>
        <p
            class={cn(
                "text-2xl font-extrabold px-3 py-1 bg-gray-900 rounded-xl border-gray-700 border-2",
                isLive ? "bg-green-500" : "bg-red-500",
            )}
        >
            {isLive ? "LIVE" : "Not live."}
        </p>
    </header>

    <div class="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-[calc(100vh-4rem)]">
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

        <div
            class="bg-gray-800 p-4 rounded-lg col-span-2 space-y-2 max-h-full flex flex-col"
        >
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-white">Logs</h2>
            </div>

            <pre
                class="bg-black text-green-400 p-4 text-sm flex flex-col-reverse overflow-auto rounded-md flex-1">
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
