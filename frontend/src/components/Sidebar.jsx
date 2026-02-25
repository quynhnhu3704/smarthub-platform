// src/components/Sidebar.jsx
export default function Sidebar({ open }) {
  return (
    <div className={`sidebar bg-white shadow-sm ${open ? "active" : ""}`}>
      <h5 className="fw-bold px-3 pt-3 pb-2">
        <i className="bi bi-grid me-2"></i>Danh mục
      </h5>

      <ul className="list-unstyled px-3">
        <li><a href="#" className="d-block py-2 text-dark text-decoration-none">iPhone</a></li>
        <li><a href="#" className="d-block py-2 text-dark text-decoration-none">Samsung</a></li>
        <li><a href="#" className="d-block py-2 text-dark text-decoration-none">Xiaomi</a></li>
        <li><a href="#" className="d-block py-2 text-dark text-decoration-none">Phụ kiện</a></li>
      </ul>
    </div>
  )
}