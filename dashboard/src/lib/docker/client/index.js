
export async function reloadKeys() {
    try {
        const response = await fetch(`/api/keys/reload`);
        if (!response.ok) {
            console.error("Failed to reload keys: ", response.statusText);
        }
    } catch (error) {
        console.error("Error reloading keys:", error);
    }
}

export async function loadKeys(keys) {
    try {
        const response = await fetch(`/api/keys/load`, {
            method: "POST",
            body: JSON.stringify(keys),
        });
        if (!response.ok) {
            console.error("Failed to reload keys: ", response.statusText);
        }
    } catch (error) {
        console.error("Error reloading keys:", error);
    }
}

export async function restartContainer(container) {
    try {
        const response = await fetch(
            `/api/containers/${container.Id}/restart`,
            {
                method: "POST",
            },
        );
        if (!response.ok) {
            console.error(
                "Failed to restart container:",
                response.statusText,
            );
        }
    } catch (error) {
        console.error("Error restarting container:", error);
    }
}

