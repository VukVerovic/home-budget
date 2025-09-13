import { useState } from "react";

export default function DodajKategoriju({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("prihod");

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd({ name: name.trim(), type });
    setName("");
    setType("prihod");
  }

  return (
    <div className="card">
      <h3 style={{ margin: 0 }}>Dodaj kategoriju</h3>
      <form onSubmit={submit} style={{ marginTop: 8 }} className="row">
        <input className="inp" placeholder="Naziv (npr. Hrana/Plata)..." value={name} onChange={e=>setName(e.target.value)} />
        <select className="select" value={type} onChange={e=>setType(e.target.value)}>
          <option value="prihod">Prihod</option>
          <option value="rashod">Rashod</option>
        </select>
        <button className="btn">Sačuvaj</button>
      </form>
    </div>
  );
}