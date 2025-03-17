import { useLoading } from "@/context/LoadingContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useFetchInterceptor = () => {
    const { setLoading } = useLoading();

    const http = async (url: string, options: RequestInit = {}) => {
        setLoading(true);

        const token = localStorage.getItem("token");

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const fetchOptions: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${BASE_URL}${url}`, fetchOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            return data;
        } catch (error: any) {
            console.error("HTTP Error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { http };
};