export async function getContainers() {
    try {
        const response = await fetch(`/api/containers`);
        const data = await response.json();
        if (data.error) {
            console.error("Failed to get containers: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to get containers: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error fetching containers:", error);
        return [];
    }
}

export async function startContainer(container) {
    try {
        const response = await fetch(
            `/api/containers/${container}/start`,
            {
                method: "POST",
            },
        );
        const data = await response.json();
        if (data.error) {
            console.error("Failed to start container: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to start container: ", response.statusText);
            return null;
        }
    }
    catch (error) {
        console.error("Error starting container:", error);
        return null;
    }
}

export async function getNginxStats() {
    try {
        const response = await fetch(`/api/rtmp/stats`);
        const data = await response.json();
        if (data.error) {
            console.error("Failed to get stats: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to get stats: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error fetching nginx stats:", error);
        return null;
    }
}

export async function getKeys() {
    try {
        const response = await fetch(`/api/keys/get`);
        const data = await response.json();
        if (data.error) {
            console.error("Failed to get keys: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to get keys: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error getting keys:", error);
    }
}

export async function reloadKeys() {
    try {
        const response = await fetch(`/api/keys/reload`);
        const data = await response.json();
        if (data.error) {
            console.error("Failed to reload keys: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to reload keys: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error reloading keys:", error);
    }
}

export async function saveKeys(keys) {
    try {
        const response = await fetch(`/api/keys/save`, {
            method: "POST",
            body: JSON.stringify(keys),
        });
        const data = await response.json();
        if (data.error) {
            console.error("Failed to save keys: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to save keys: ", response.statusText);
            return null;
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
        const data = await response.json();
        if (data.error) {
            console.error("Failed to restart container: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to restart container: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error restarting container:", error);
    }
}

export async function startStream() {
    try {
        const response = await fetch(`/api/containers/start-stream`, {
            method: "POST",
        });
        const data = await response.json();
        if (data.error) {
            console.error("Failed to start stream: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to start stream: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error starting stream:", error);
        return null;
    }
}

export async function stopFallbackStream() {
    try {
        const response = await fetch(`/api/fallback/stop`, {
            method: "POST",
        });
        const data = await response.json();
        if (data.error) {
            console.error("Failed to stop fallback: ", data.error);
            return null;
        }
        if (response.ok) {
            return data;
        } else {
            console.error("Failed to stop fallback: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error stopping fallback:", error);
        return null;
    }
}

