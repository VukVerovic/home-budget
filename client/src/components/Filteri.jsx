export default function Filteri({ categories = [], selectedType, setSelectedType, selectedCategoryId, setSelectedCategoryId }) {
  return (
    <div className="card">
      <h3 style={{ margin: 0 }}>Filteri</h3>
      <div className="row" style={{ marginTop: 8 }}>
        <select className="select" value={selectedType} onChange={e=>setSelectedType(e.target.value)}>
          <option value="all">Svi tipovi</option>
          <option value="prihod">Prihod</option>
          <option value="rashod">Rashod</option>
        </select>

        <select className="select" value={selectedCategoryId} onChange={e=>setSelectedCategoryId(e.target.value)}>
          <option value="all">Sve kategorije</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );
}