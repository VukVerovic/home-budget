export default function ListaTransakcija({ transactions = [], categories = [], selectedType, selectedCategoryId }) {
  const byId = new Map(categories.map(c => [c.id, c]));
  const view = transactions.map(t => {
    const cat = byId.get(t.categoryId);
    return {
      ...t,
      categoryName: cat?.name || "—",
      categoryType: cat?.type || "—"
    };
  });

  return (
    <div className="card">
      <h3 style={{ margin: 0 }}>Transakcije ({view.length})</h3>
      {view.length === 0 ? (
        <div className="muted" style={{ marginTop: 8 }}>Nema podataka.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Kategorija</th>
              <th>Tip</th>
              <th>Iznos</th>
              <th>Beleška</th>
            </tr>
          </thead>
          <tbody>
            {view.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.categoryName}</td>
                <td><span className="badge">{t.categoryType}</span></td>
                <td>{t.amount}</td>
                <td>{t.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="muted" style={{ marginTop: 8 }}>
        Filteri (aktivno): tip = {selectedType || "sve"}, kategorija = {selectedCategoryId || "sve"}
      </div>
    </div>
  );
}