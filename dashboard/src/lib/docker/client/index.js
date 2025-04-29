
export async function getContainers() {
    try {
        const response = await fetch(`/api/containers`);
        if (!response.ok) {
            console.error("Failed to fetch containers: ", response.statusText);
            return [];
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching containers:", error);
        return [];
    }
}

export async function getNginxStats() {
    try {
        const response = await fetch(`/api/rtmp/stats`);
        if (!response.ok) {
            console.error("Failed to fetch nginx stats: ", response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching nginx stats:", error);
        return null;
    }
}

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

