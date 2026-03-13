// // src/components/Sidebar.jsx
import { Link } from "react-router-dom"

export default function Sidebar({ open }) {
  return (
    <div className={`sidebar bg-white shadow-sm ${open ? "active" : ""}`}>
      <ul className="list-unstyled mt-3 px-2">

        <li className="mb-1">
          <Link to="/dashboard/products" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-box-seam fs-5 text-primary"></i>Quản lý sản phẩm
          </Link>
        </li>
        <li className="mb-1">
          <Link to="/dashboard/brands" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-tags fs-5 text-primary"></i>Quản lý thương hiệu
          </Link>
        </li>
        <li className="mb-1">
          <Link to="/dashboard/orders" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-receipt fs-5 text-primary"></i>Quản lý đơn hàng
          </Link>
        </li>
        <li className="mb-1">
          <Link to="/dashboard/customers" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-people fs-5 text-primary"></i>Quản lý khách hàng
          </Link>
        </li>
        <li className="mb-1">
          <Link to="/dashboard/staff" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-person-badge fs-5 text-primary"></i>Quản lý nhân viên
          </Link>
        </li>

        {/* <li className="mb-1">
          <Link to="/dashboard/staff" className="d-flex align-items-center gap-3 py-3 px-4 text-dark text-decoration-none rounded-pill hover-bg-light transition-all">
            <i className="bi bi-person-badge fs-5 text-primary"></i>Trạng thái đơn hàng
          </Link>
        </li> */}
      </ul>

      <div className="position-absolute bottom-0 w-100 p-3">
        <small className="text-muted d-block text-center">© 2026 SmartHub Admin</small>
      </div>
    </div>
  )
}