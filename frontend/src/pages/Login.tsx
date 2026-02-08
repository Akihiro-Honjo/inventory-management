    import React, { useState } from "react";

    const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
        const res = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            throw new Error("ログイン失敗");
        }

        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // alert("ログイン成功！");
        window.location.href = "/products"; // 次の画面へ
        } catch {
        setError("ユーザー名またはパスワードが違います");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
        <h2>ログイン</h2>

        <form onSubmit={handleLogin}>
            <div>
            <label>ユーザー名：</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>

            <div style={{ marginTop: "10px" }}>
            <label>パスワード：</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" style={{ marginTop: "20px" }}>
            ログイン
            </button>
        </form>
        </div>
    );
    };

    export default Login;
