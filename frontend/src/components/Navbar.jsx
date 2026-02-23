import { useState } from "react"

export default function Navbar({ toggleSidebar }) {
  const [loggedIn] = useState(true) // sau này thay bằng auth thật
  const username = "Admin"

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid px-5">

        {/* Nút mở sidebar (sau này gắn chức năng) */}
        <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>
          &#9776;
        </button>

        {/* Logo */}
        <a className="navbar-brand fw-bold ms-3" href="/">
          <i className="bi bi-phone me-2"></i>
          SmartHub
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">

            {/* Search */}
            <li className="nav-item me-4">
              <form
                className="d-flex"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="form-control me-2"
                  type="text"
                  placeholder="Tìm điện thoại..."
                  style={{ width: "220px" }}
                />
                <button className="btn btn-outline-primary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </li>

            {/* Menu */}
            <li className="nav-item">
              <a className="nav-link" href="/">
                Trang chủ
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#products">
                Sản phẩm
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#cart">
                Giỏ hàng
              </a>
            </li>

            {/* User */}
            {loggedIn ? (
              <li className="nav-item dropdown ms-lg-2">
                <button
                  className="btn btn-primary dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <a className="dropdown-item" href="#">
                      Thông tin cá nhân
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Đơn hàng của tôi
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item text-danger" href="#">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Đăng xuất
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-lg-2">
                <a className="btn btn-primary" href="#">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Đăng nhập
                </a>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}