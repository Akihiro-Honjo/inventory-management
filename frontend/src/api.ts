    const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

    export async function fetchAPI(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("access_token");
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }

    return res.json();
    }

    // 商品削除API
    export async function deleteProductAPI(id: number) {
    return fetchAPI(`/products/${id}/delete/`, {
        method: "DELETE"
    });
    }
