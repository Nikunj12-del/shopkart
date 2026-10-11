import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8085";

export default function App() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message || "Backend connected"))
      .catch(() => setStatus("Backend unavailable"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "3rem", background: "#020817", color: "#e2e8f0", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>ShopKart</h1>
      <p>Status: {status}</p>
    </main>
  );
}
