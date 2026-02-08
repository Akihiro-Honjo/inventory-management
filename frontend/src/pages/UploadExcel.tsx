    import React, { useState } from "react";
    import { fetchAPI } from "../api";

    const UploadExcel: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [markDiscontinued, setMarkDiscontinued] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);


    // --- ドラッグ＆ドロップ処理 --------------------
    const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
    }
    };
// --------------------------------------------------

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!file) {
        setError("ファイルを選択してください");
        return;
        }

        try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mark_discontinued", String(markDiscontinued));

        const res = await fetchAPI("/upload-excel/", {
            method: "POST",
            body: formData,
        });

        setResult(res);

        // 自動で商品一覧へ移動
        window.location.href = "/products";

        } catch (err: any) {
        setError(err.message);
        }
        };

        return (
        <div style={{ padding: "40px" }}>
        


        <h2>Excel アップロード</h2>

        <form onSubmit={handleUpload}>
        <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
            border: "2px dashed #999",
            padding: "30px",
            marginBottom: "15px",
            textAlign: "center",
            borderRadius: "6px",
            background: dragActive ? "#f0f0f0" : "transparent",
            cursor: "pointer"
        }}
        onClick={() => document.getElementById("fileInput")?.click()}
        >
        <p>ここにファイルをドラッグ＆ドロップ<br />またはクリックして選択</p>
        {file && (
        <div
            style={{
            marginTop: "15px",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "14px",
            background: "#fafafa"
            }}
        >
            📄 添付ファイル：{file.name}
        </div>
        )}

        </div>

            <div>
            <input
            id="fileInput"          // ← クリックで開くために追加
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }} // ← 必ず非表示にする
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            /> */}
            </div>

            <div style={{ marginTop: "10px" }}>
            <label>
                <input
                type="checkbox"
                checked={markDiscontinued}
                onChange={(e) => setMarkDiscontinued(e.target.checked)}
                />
                廃盤（取り消し線）にする
            </label>
            </div>

            <button type="submit" style={{ marginTop: "20px" }}>
            アップロード
            </button>
        </form>
        
        <button onClick={() => (window.location.href = "/products")}>
            商品一覧へ戻る
        </button>


        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* {result && (
            <pre style={{ marginTop: "20px" }}>
            {JSON.stringify(result, null, 2)}
            </pre>
        )} */}
        </div>
    );
    };

    export default UploadExcel;
