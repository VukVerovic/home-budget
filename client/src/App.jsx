import { useEffect, useMemo, useState } from "react";
import "./styles/app.css";

import DodajKategoriju from "./components/DodajKategoriju.jsx";
import DodajTransakciju from "./components/DodajTransakciju.jsx";
import ListaKategorija from "./components/ListaKategorija.jsx";
import ListaTransakcija from "./components/ListaTransakcija.jsx";
import Filteri from "./components/Filteri.jsx";
import PieChart from "./components/PieChart.jsx";
import { apiGet, apiPost } from "./services/api.jsx";

function Header() {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h1 className="h1">Kućni budžet</h1>
    </div>
  );
}

export default function App() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // ===== Fetch helpers =====
  async function fetchCategories() {
    try {
      const res = await apiGet("/categories/all");
      setCategories(Array.isArray(res) ? res : (res.categories || []));
    } catch (e) {
      console.error("Greška pri fetch-u kategorija", e);
    }
  }

  async function fetchTransactions() {
    try {
      const res = await apiGet("/transactions/all");
      setTransactions(Array.isArray(res) ? res : (res.transactions || []));
    } catch (e) {
      console.error("Greška pri fetch-u transakcija", e);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  // ===== Akcije nad kategorijama =====
  async function addCategory({ name, type }) {
    try {
      const created = await apiPost("/categories/create", { name, type });
      if (created?.id) {
        setCategories(prev => [...prev, created]);
      } else {
        await fetchCategories();
      }
    } catch (e) {
      console.error("Greška pri kreiranju kategorije", e);
    }
  }

  async function deleteCategory(id) {
    try {
      await apiPost("/categories/delete", { id });
      setCategories(prev => prev.filter(c => c.id !== id));
      // transakcije ostaju — ako su „viseće“, u listi će im tip biti "—"
    } catch (e) {
      console.error("Greška pri brisanju kategorije", e);
    }
  }

  // ===== Akcije nad transakcijama =====
  async function addTransaction({ amount, categoryId, note, date }) {
    try {
      const payload = {
        amount: Number(amount),
        categoryId,
        note,
        date: date || new Date().toISOString().slice(0, 10),
      };
      const created = await apiPost("/transactions/create", payload);
      if (created?.id) {
        setTransactions(prev => [created, ...prev]);
      } else {
        await fetchTransactions();
      }
    } catch (e) {
      console.error("Greška pri kreiranju transakcije", e);
    }
  }

  // ===== Izvedena stanja =====
  const [selectedType, setSelectedType] = useState("sve");
  const [selectedCategoryId, setSelectedCategoryId] = useState("sve");

  const categoriesById = useMemo(
    () => new Map(categories.map(c => [c.id, c])),
    [categories]
  );

  const filtered = useMemo(() => {
    let list = transactions.map(t => {
      const cat = categoriesById.get(t.categoryId);
      return { ...t, categoryType: cat?.type || "—" };
    });
    if (selectedType !== "sve") list = list.filter(t => t.categoryType === selectedType);
    if (selectedCategoryId !== "sve") {
      list = list.filter(t => String(t.categoryId) === String(selectedCategoryId));
    }
    return list;
  }, [transactions, categoriesById, selectedType, selectedCategoryId]);

  const totals = useMemo(() => {
    let prihod = 0, trosak = 0;
    for (const t of transactions) {
      const cat = categoriesById.get(t.categoryId);
      if (cat?.type === "prihod") prihod += Number(t.amount) || 0;
      else if (cat?.type === "trosak") trosak += Number(t.amount) || 0;
    }
    return { prihod, trosak, balance: prihod - trosak };
  }, [transactions, categoriesById]);

  // Pite — NE prate filtere; računaju se iz svih transakcija
  function buildPieDataAllTx(allTx, wantedType) {
    const sums = new Map();
    for (const t of allTx) {
      const c = categoriesById.get(t.categoryId);
      if (c?.type === wantedType) {
        sums.set(c.name, (sums.get(c.name) || 0) + Number(t.amount || 0));
      }
    }
    return Array.from(sums.entries()).map(([label, value]) => ({ label, value }));
  }
  const pieExpenses = useMemo(
    () => buildPieDataAllTx(transactions, "trosak"),
    [transactions, categoriesById]
  );
  const pieIncome = useMemo(
    () => buildPieDataAllTx(transactions, "prihod"),
    [transactions, categoriesById]
  );

  return (
    <div className="wrap">
      <Header />

      {/* KPI */}
      <div className="card">
        <div className="kpi">
          <div className="pill">Prihodi: {totals.prihod}</div>
          <div className="pill" style={{ background: "#ffecec", borderColor: "#ffcccc", color: "#b00020" }}>
            Rashodi: {totals.trosak}
          </div>
          <div className="pill" style={{ background: "#e8f5e9", borderColor: "#c8e6c9", color: "#2e7d32" }}>
            Stanje: {totals.balance}
          </div>
        </div>
      </div>

      <div className="grid">
        {/* Levo: kategorije */}
        <div>
          <DodajKategoriju onAdd={addCategory} />
          <ListaKategorija categories={categories} onDelete={deleteCategory} />
        </div>

        {/* Desno: transakcije + filteri + pie */}
        <div>
          <DodajTransakciju categories={categories} onAdd={addTransaction} />
          <Filteri
            categories={categories}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
          <ListaTransakcija
            transactions={filtered}
            categories={categories}
            selectedType={selectedType}
            selectedCategoryId={selectedCategoryId}
          />

          {/* Pie – 2 grafa 50/50 */}
          <div className="charts-grid">
            <div className="card pie-card">
              <h3>Raspodela rashoda</h3>
              {pieExpenses.length === 0 ? (
                <div className="muted" style={{ marginTop: 8 }}>Nema podataka za grafik.</div>
              ) : (
                <div className="pie-wrap" style={{ marginTop: 8 }}>
                  <PieChart data={pieExpenses} size={240} />
                </div>
              )}
            </div>

            <div className="card pie-card">
              <h3>Raspodela prihoda</h3>
              {pieIncome.length === 0 ? (
                <div className="muted" style={{ marginTop: 8 }}>Nema podataka za grafik.</div>
              ) : (
                <div className="pie-wrap" style={{ marginTop: 8 }}>
                  <PieChart data={pieIncome} size={240} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}