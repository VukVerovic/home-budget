export default function ListaKategorija({ categories = [], onDelete }) {
  return (
    <div className="card">
      <h3 style={{ margin: 0 }}>Kategorije ({categories.length})</h3>
      {categories.length === 0 ? (
        <div className="muted" style={{ marginTop: 8 }}>Još nema kategorija.</div>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Naziv</th><th>Tip</th><th>Brisanje</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td><span className="badge">{c.type}</span></td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-secondary" onClick={()=>onDelete(c.id)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}