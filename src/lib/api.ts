const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = RequestInit & {
    retry?: boolean;
};

export async function api(url: string, options: RequestInit = {}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            ...options,
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
        });

        return res.ok;
    } catch {
        return false;
    }
}