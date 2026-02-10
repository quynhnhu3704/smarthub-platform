export default function Header() {
  return (
    <header className="hero py-5">
      <div className="container position-relative" style={{zIndex:2}}>
        <span className="badge badge-na rounded-pill px-3 py-2 mb-3">
          Hệ thống quản lý thiết bị • THCS Ngũ Anh Một Nàng
        </span>

        <h1 className="display-5 fw-extrabold">
          Quản lý thiết bị – Nâng cao hiệu quả giảng dạy
        </h1>

        <p className="lead opacity-75">
          Theo dõi, cấp phát, bảo trì và thống kê thiết bị dạy học nhanh chóng, chính xác.
        </p>

        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-light fw-semibold">
            <i className="bi bi-grid me-2"></i>
            Xem danh sách thiết bị
          </button>

          <button className="btn btn-outline-light fw-semibold">
            <i className="bi bi-bag-check me-2"></i>
            Mượn ngay
          </button>
        </div>
      </div>
    </header>
  )
}
