// src/components/Navbar.jsx
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) navigate(`/products?keyword=${keyword.trim()}`)
    else navigate("/products")
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid px-5">
        <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>&#9776;</button>
        <a className="navbar-brand fw-bold ms-3" href="/"><i className="bi bi-phone me-2"></i>SmartHub</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item me-4">
              <form className="d-flex" onSubmit={handleSearch}>
                <input className="form-control me-2" type="text" placeholder="Tìm điện thoại..." style={{ width: "220px" }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
            </li>

            <li className="nav-item"><a className="nav-link" href="/">Trang chủ</a></li>
            <li className="nav-item"><a className="nav-link" href="#products">Sản phẩm</a></li>
            <li className="nav-item"><a className="nav-link" href="#cart">Giỏ hàng</a></li>

            {user ? (
              <li className="nav-item dropdown ms-lg-2">
                <button className="btn btn-primary dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-2"></i>{user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                  <li><Link className="dropdown-item" to="/change-password">Thay đổi mật khẩu</Link></li>
                  <li><Link className="dropdown-item" to="/my-orders">Đơn hàng của tôi</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        if (window.confirm("Bạn có chắc muốn đăng xuất không?")) {
                          logout()
                          navigate("/")
                        }
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-2 d-flex gap-2">
                <a className="btn btn-outline-primary" href="/register"><i className="bi bi-person-plus me-2"></i>Đăng ký</a>
                <a className="btn btn-primary" href="/login"><i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}