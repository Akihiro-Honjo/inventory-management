    import React, { useEffect, useState } from "react";
    import { fetchAPI } from "../api";
    import { deleteProductAPI } from "../api"; 
    import "./ProductList.css";



    interface Category {
    id: number;
    name: string;
    }

    interface Product {
    id: number;
    product_code: string;
    name: string;
    supplier?: { name: string };
    category?: { name: string };
    discontinued: boolean;
    }

    const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        loadProducts();
    }, [selectedCategory, keyword]);


    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const loadCategories = async () => {
        const data = await fetchAPI("/categories/");
        setCategories(data);
    };

    const loadProducts = async () => {
        const query = new URLSearchParams();
        if (keyword) query.append("q", keyword);
        if (selectedCategory) query.append("category", selectedCategory);

        const data = await fetchAPI(`/products/?${query.toString()}`);
        setProducts(data);
    };

    return (
    
    <div className="page-container">
    <h2 className="page-title">商品一覧</h2>

      {/* 追加：アップロードページへのボタン */}
        <button
            onClick={() => (window.location.href = "/upload")}
            style={{
            padding: "8px 14px",
            border: "1px solid #999",
            borderRadius: "4px",
            background: "#f5f5f5",
            cursor: "pointer",
            marginBottom: "20px"
            }}
        >
            ファイル添付
        </button>

    <div className="search-area">
        <input
        type="text"
        placeholder="商品名検索"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={loadProducts}>検索</button>
    </div>

    <div className="search-area" style={{ marginTop: "10px" }}>
        <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        >
        <option value="">全てのカテゴリ</option>
        {categories.map((c) => (
            <option key={c.id} value={c.name}>
            {c.name}
            </option>
        ))}
        </select>
    
        <button
        onClick={() => {
            setSelectedCategory("");
            setKeyword("");
        }}
        >
        全商品表示
        </button>


    </div>



    <table className="product-table">
    <thead>
        <tr>
        <th>コード</th>
        <th>商品名</th>
        <th>仕入先</th>
        <th>カテゴリ</th>
        <th>削除</th>
        </tr>
    </thead>


    <tbody>
    {products.map((p) => (
        <tr key={p.id}>
        <td>{p.product_code}</td>

        <td className={p.discontinued ? "discontinued" : ""}>
            {p.name}
        </td>

        <td>{p.supplier?.name || "-"}</td>
        <td>{p.category?.name || "-"}</td>

        {/* 追加：削除ボタン */}
        <td>
            {p.discontinued && (
            <button
                onClick={async () => {
                if (window.confirm("本当に削除しますか？")) {
                    await deleteProductAPI(p.id);
                    loadProducts(); // 削除後に再読み込み
                }
                }}
                style={{
                cursor: "pointer",
                border: "1px solid #aaa",
                background: "#f5f5f5",
                padding: "4px 8px",
                borderRadius: "4px"
                }}
            >
                ✕
            </button>
            )}
        </td>
        </tr>
    ))}
    </tbody>

    </table>


        </div>
    );
    };

    export default ProductList;
