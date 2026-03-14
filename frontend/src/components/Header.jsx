// // src/components/Header.jsx
// import { Link } from "react-router-dom"

// export default function Header() {
//   return (
//     <header className="hero py-5 py-lg-6" style={{ height: "40vh" }}>
//       <div className="container position-relative" style={{ zIndex: 2 }}>
//         <div className="row align-items-center">
//           <div className="text-white">
//             <span className="badge badge-na rounded-pill px-3 py-2 mb-3">SmartHub • Hệ thống bán điện thoại chính hãng</span>

//             <h1 className="display-5 fw-extrabold">Công nghệ đỉnh cao – Giá tốt mỗi ngày</h1>

//             <p className="lead opacity-75">SmartHub cung cấp điện thoại chính hãng, bảo hành uy tín, hỗ trợ trả góp và giao hàng toàn quốc nhanh chóng.</p>

//             <div className="d-flex gap-3 flex-wrap">
//               <a href="#products" className="btn btn-light fw-semibold"><i className="bi bi-phone me-2"></i>Xem sản phẩm</a>
//               <Link to="/cart" className="btn btn-outline-light fw-semibold"><i className="bi bi-cart-check me-2"></i>Xem giỏ hàng</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


// src/components/Header.jsx
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Header() {

  const [showSurvey, setShowSurvey] = useState(false)

  return (
    <>
      <header className="hero py-5 py-lg-6" style={{ height: "40vh" }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="text-white">
              <span className="badge badge-na rounded-pill px-3 py-2 mb-3">SmartHub • Hệ thống bán điện thoại chính hãng</span>

              <h1 className="display-5 fw-extrabold">Công nghệ đỉnh cao – Giá tốt mỗi ngày</h1>

              <p className="lead opacity-75">SmartHub cung cấp điện thoại chính hãng, bảo hành uy tín, hỗ trợ trả góp và giao hàng toàn quốc nhanh chóng.</p>

              <div className="d-flex gap-3 flex-wrap">
                <a href="#products" className="btn btn-light fw-semibold"><i className="bi bi-phone me-2"></i>Xem sản phẩm</a>
                <Link to="/cart" className="btn btn-outline-light fw-semibold"><i className="bi bi-cart-check me-2"></i>Xem giỏ hàng</Link>
                <button className="btn btn-warning fw-semibold" onClick={() => setShowSurvey(true)}>
                  <i className="bi bi-bar-chart me-2"></i>Khảo sát nhu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showSurvey && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Khảo sát nhu cầu khách hàng</h5>
                <button className="btn-close" onClick={() => setShowSurvey(false)}></button>
              </div>

              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Bạn quan tâm hãng nào?</label>
                  <select className="form-select">
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Xiaomi</option>
                    <option>Oppo</option>
                    <option>Realme</option>
                    {/* lấy từ collection brands trong db ra */}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Khoảng giá mong muốn</label>
                  <select className="form-select">
                    <option>Dưới 5 triệu</option>
                    <option>5 – 15 triệu</option>
                    <option>Trên 15 triệu</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Chức năng bạn ưu tiên</label>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="form-check-label">Camera</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="form-check-label">Pin lâu</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="form-check-label">Hiệu năng mạnh</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="form-check-label">Màn hình đẹp</label>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSurvey(false)}>Đóng</button>
                <button className="btn btn-primary">Gửi khảo sát</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}