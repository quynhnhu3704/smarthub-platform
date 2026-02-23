export default function Header() {
  return (
    <header className="hero py-5 py-lg-6" style={{ height: "40vh" }}>
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center">
          <div className="text-white">
            <span className="badge badge-na rounded-pill px-3 py-2 mb-3">
              SmartHub • Hệ thống bán điện thoại chính hãng
            </span>

            <h1 className="display-5 fw-extrabold">
              Công nghệ đỉnh cao – Giá tốt mỗi ngày
            </h1>

            <p className="lead opacity-75">
              SmartHub cung cấp điện thoại chính hãng, bảo hành uy tín,
              hỗ trợ trả góp và giao hàng toàn quốc nhanh chóng.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <a href="#products" className="btn btn-light fw-semibold">
                <i className="bi bi-phone me-2"></i>
                Xem sản phẩm
              </a>

              <a href="#cart" className="btn btn-outline-light fw-semibold">
                <i className="bi bi-cart-check me-2"></i>
                Xem giỏ hàng
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
