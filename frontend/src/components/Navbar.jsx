export default function Navbar() {
  const loggedIn = true
  const username = 'admin'

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid px-5">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-mortarboard me-2"></i>
          THCS Ngũ Anh Một Nàng
        </a>

        <ul className="navbar-nav ms-auto align-items-center gap-2">
          {loggedIn ? (
            <li className="nav-item dropdown">
              <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-2"></i>
                {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item">Thông tin cá nhân</a></li>
                <li><a className="dropdown-item text-danger">Đăng xuất</a></li>
              </ul>
            </li>
          ) : (
            <li>
              <button className="btn btn-primary">Đăng nhập</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
