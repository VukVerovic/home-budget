import { useState } from "react";

export default function DodajTrosak({ categories = [], onAdd }) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));

  async function submit(e) {
    e.preventDefault();
    const num = Number(amount);
    if (!Number.isFinite(num) || !categoryId) return;
    await onAdd({ amount: num, categoryId, note, date });
    setAmount("");
    setNote("");
    setCategoryId("");  
  }

  return (
    <div className="card">
      <h3 style={{ margin: 0 }}>Dodaj transakciju</h3>
      <form onSubmit={submit} style={{ marginTop: 8 }}>
        <div className="row" style={{ marginBottom: 8 }}>
          <input className="inp" placeholder="Iznos (npr. 1500)" value={amount} onChange={e=>setAmount(e.target.value)} />
          <select className="select" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">Kategorija…</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
          </select>
          <input className="select" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <textarea className="inp" placeholder="Beleška (opciono)..." value={note} onChange={e=>setNote(e.target.value)} />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn">Sačuvaj</button>
        </div>
      </form>
    </div>
  );
}