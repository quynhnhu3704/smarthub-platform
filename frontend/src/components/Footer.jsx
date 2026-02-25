// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer
      className="pt-5"
      style={{
        background: "linear-gradient(180deg,var(--na-primary), var(--na-primary-2))",
        color: "#fff"
      }}
    >
      <div className="container pb-4">
        <div className="row g-4">

          {/* Cột 1 */}
          <div className="col-lg-4">
            <h5 className="fw-bold">
              <i className="bi bi-phone me-2"></i>
              SmartHub
            </h5>
            <p className="opacity-75">
              Hệ thống bán điện thoại chính hãng, giá tốt,
              hỗ trợ trả góp và giao hàng toàn quốc nhanh chóng.
            </p>
          </div>

          <div className="col-lg-1"></div>

          {/* Cột 2 */}
          <div className="col-lg-4">
            <div className="fw-semibold mb-2">
              <i className="bi bi-record-circle me-2"></i>
              Thông tin
            </div>

            <div className="small opacity-75 mb-2">
              <i className="bi bi-geo-alt me-2"></i>
              123 Nguyễn Huệ, TP. Hồ Chí Minh
            </div>

            <div className="small opacity-75 mb-2">
              <i className="bi bi-clock me-2"></i>
              Giờ làm việc: 08:00 – 21:30 (Thứ 2 – Chủ Nhật)
            </div>

            <div className="small opacity-75">
              <i className="bi bi-telephone me-2"></i>
              Hotline: 1900 1234
            </div>
          </div>

          {/* Cột 3 */}
          <div className="col-lg-3">
            <div className="fw-semibold mb-3">Kết nối với SmartHub</div>

            <div className="d-flex gap-3">
              <a className="text-white" href="#"><i className="bi bi-facebook"></i></a>
              <a className="text-white" href="#"><i className="bi bi-instagram"></i></a>
              <a className="text-white" href="#"><i className="bi bi-youtube"></i></a>
              <a className="text-white" href="#"><i className="bi bi-tiktok"></i></a>
              <a className="text-white" href="#"><i className="bi bi-twitter-x"></i></a>
            </div>

            <div className="small opacity-75 mt-3">
              © 2025 SmartHub. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}