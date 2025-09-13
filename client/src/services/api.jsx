const BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function apiGet(path){
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}
export async function apiPost(path, body){
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}