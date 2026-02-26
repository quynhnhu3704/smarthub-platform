// src/components/Sidebar.jsx
import { Link } from "react-router-dom"

export default function Sidebar({ open }) {
  return (
    <div className={`sidebar bg-white shadow-sm ${open ? "active" : ""}`}>
      <h5 className="fw-bold px-3 pt-3 pb-2"><i className="bi bi-speedometer2 me-2"></i>Quản lý hệ thống</h5>
      <ul className="list-unstyled px-3">
        <li><Link to="/admin/products" className="d-block py-2 text-dark text-decoration-none">Quản lý sản phẩm</Link></li>
        <li><Link to="/admin/orders" className="d-block py-2 text-dark text-decoration-none">Quản lý đơn hàng</Link></li>
        <li><Link to="/admin/customers" className="d-block py-2 text-dark text-decoration-none">Quản lý khách hàng</Link></li>
        <li><Link to="/admin/staff" className="d-block py-2 text-dark text-decoration-none">Quản lý nhân viên</Link></li>
      </ul>
    </div>
  )
}