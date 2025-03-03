const BASE_URL = import.meta.env.VITE_BASE_URL;
export const registerUser = async (userId: string) => {
    const response = await fetch(BASE_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register user');
    }

    return response.json();
};
