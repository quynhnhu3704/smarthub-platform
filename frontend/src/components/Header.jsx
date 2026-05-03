// src/components/Header.jsx
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasSurvey, setHasSurvey] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("/api/brands")
        setBrands(res.data.brands)
      } catch (err) {
        console.error(err)
      }
    }

    const checkSurvey = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setHasSurvey(false)
          return
        }

        const res = await axios.get("/api/surveys/me", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.data.survey) {
          setHasSurvey(true)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchBrands()
    checkSurvey()
  }, [token])

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"))
    }

    window.addEventListener("storage", handleStorage)

    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token")

      if (!token) {
        setHasSurvey(false)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleSubmitSurvey = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const brands = form.getAll("brands")
    const ram = form.get("ram")?.split("-")
    const storage = form.get("storage")?.split("-")
    const price = form.get("price")?.split("-")
    const battery = form.get("battery")?.split("-")
    const screen = form.get("screen")?.split("-")
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token")
      await axios.post(
        "/api/surveys",
        {
          brands,
          price_min: Number(price?.[0]),
          price_max: Number(price?.[1]),
          ram_min: Number(ram?.[0]),
          ram_max: Number(ram?.[1]),
          storage_min: Number(storage?.[0]),
          storage_max: Number(storage?.[1]),
          battery_min: Number(battery?.[0]),
          battery_max: Number(battery?.[1]),
          screen_min: Number(screen?.[0]),
          screen_max: Number(screen?.[1])
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess("Gửi khảo sát thành công. Cảm ơn bạn!")
      setHasSurvey(true)

      setTimeout(() => {
        setShowSurvey(false)
        setSuccess("")
      }, 1500)
    } catch {
      setError("Bạn cần đăng nhập để gửi khảo sát")
    } finally {
      setLoading(false)
    }
  }

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
                {!hasSurvey && (
                  <button className="btn btn-warning fw-semibold" onClick={() => setShowSurvey(true)}><i className="bi bi-clipboard-data me-2"></i>Khảo sát ngay</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {showSurvey && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" style={{ display: "block" }} onClick={() => setShowSurvey(false)}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden position-relative">
                {loading && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2 rounded">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <div className="modal-header bg-primary text-white border-0 rounded-top-4" style={{ padding: "1em 2.525em" }}>
                  <div>
                    <h5 className="modal-title fw-bold fs-4 mb-1">Khảo sát nhu cầu điện thoại của bạn</h5>
                    <span className="badge rounded-pill bg-white text-dark small fw-normal">Chỉ mất 30 giây để giúp chúng tôi gợi ý sản phẩm phù hợp hơn.</span>
                  </div>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowSurvey(false)}></button>
                </div>
                <form id="surveyForm" className="modal-body pt-4 px-4 px-md-5" onSubmit={handleSubmitSurvey}>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-tags me-3 text-primary"></i>Bạn đang quan tâm đến thương hiệu điện thoại nào?</label>
                    <small className="d-block text-primary mb-3">Bạn có thể chọn nhiều thương hiệu</small>
                    <div className="row g-3">
                      {brands.map((brand) => (
                        <div className="col-12 col-md-3" key={brand._id}>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="brands" value={brand._id} />
                            <label className="form-check-label">{brand.name}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-cash-stack me-3 text-primary"></i>Khoảng giá bạn mong muốn là bao nhiêu?</label>
                    <small className="d-block text-primary mb-3">Chọn mức giá phù hợp với ngân sách của bạn</small>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="price" value="0-5000000" />
                        <label className="form-check-label">Dưới 5 triệu đồng</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="price" value="5000000-15000000" />
                        <label className="form-check-label">Từ 5 đến 15 triệu đồng</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="price" value="15000000-99999999" />
                        <label className="form-check-label">Trên 15 triệu đồng</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-memory me-3 text-primary"></i>Bạn mong muốn điện thoại có dung lượng RAM bao nhiêu?</label>
                    <small className="d-block text-primary mb-3">Chọn mức RAM phù hợp với nhu cầu sử dụng của bạn</small>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="ram" value="0-4" />
                        <label className="form-check-label">Dưới 4 GB<small className="text-muted ms-3">phù hợp nhu cầu cơ bản</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="ram" value="4-8" />
                        <label className="form-check-label">Từ 6 đến 8 GB<small className="text-muted ms-3">đáp ứng hầu hết nhu cầu sử dụng</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="ram" value="8-12" />
                        <label className="form-check-label">Từ 8 đến 12 GB<small className="text-muted ms-3">chạy đa nhiệm và game mượt hơn</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="ram" value="12-24" />
                        <label className="form-check-label">Trên 12 GB<small className="text-muted ms-3">hiệu năng cao cho nhu cầu nặng</small></label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-hdd-stack me-3 text-primary"></i>Bạn cần dung lượng bộ nhớ trong (lưu trữ) bao nhiêu?</label>
                    <small className="d-block text-primary mb-3">Chọn dung lượng lưu trữ phù hợp với nhu cầu của bạn</small>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="storage" value="0-64" />
                        <label className="form-check-label">Dưới 64 GB<small className="text-muted ms-3">phù hợp nhu cầu cơ bản</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="storage" value="64-128" />
                        <label className="form-check-label">Từ 64 đến 128 GB<small className="text-muted ms-3">đủ dùng cho đa số người dùng</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="storage" value="128-256" />
                        <label className="form-check-label">Từ 128 đến 256 GB<small className="text-muted ms-3">lưu được nhiều ứng dụng và hình ảnh</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="storage" value="256-512" />
                        <label className="form-check-label">Từ 256 đến 512 GB<small className="text-muted ms-3">phù hợp người lưu nhiều dữ liệu</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="storage" value="512-2048" />
                        <label className="form-check-label">Trên 1 TB<small className="text-muted ms-3">dung lượng rất lớn cho nhu cầu cao</small></label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-battery-charging me-3 text-primary"></i>Bạn mong muốn điện thoại có dung lượng pin như thế nào?</label>
                    <small className="d-block text-primary mb-3">Chọn mức dung lượng pin bạn cảm thấy phù hợp</small>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="battery" value="0-4000" />
                        <label className="form-check-label">Dưới 4000 mAh<small className="text-muted ms-3">dùng nhẹ khoảng nửa ngày đến 1 ngày</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="battery" value="4000-5000" />
                        <label className="form-check-label">Từ 4000 đến 5000 mAh<small className="text-muted ms-3">dùng khoảng 1 ngày</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="battery" value="5000-10000" />
                        <label className="form-check-label">Trên 5000 mAh<small className="text-muted ms-3">có thể dùng 1.5 – 2 ngày</small></label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-semibold fs-5 mb-2 d-block"><i className="bi bi-aspect-ratio-fill me-3 text-primary"></i>Bạn thích kích thước màn hình điện thoại ra sao?</label>
                    <small className="d-block text-primary mb-3">Chọn kích thước màn hình phù hợp với thói quen sử dụng của bạn</small>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="screen" value="0-6.4" />
                        <label className="form-check-label">Dưới 6.4 inch<small className="text-muted ms-3">nhỏ gọn</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="screen" value="6.4-6.7" />
                        <label className="form-check-label">Từ 6.4 đến 6.7 inch<small className="text-muted ms-3">tiêu chuẩn</small></label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="screen" value="6.7-10" />
                        <label className="form-check-label">Trên 6.7 inch<small className="text-muted ms-3">màn hình lớn</small></label>
                      </div>
                    </div>
                  </div>
                  <p className="text-primary text-center">Cảm ơn bạn đã dành thời gian phản hồi!</p>
                </form>
                <div className="modal-footer border-0 px-4 px-md-5 pb-4 pt-2 flex-column">
                  {error && <div className="alert alert-danger w-100 mb-3">{error}</div>}
                  {success && <div className="alert alert-success w-100 mb-3">{success}</div>}
                  <div className="row w-100">
                    <div className="col-6 ps-0">
                      <button type="reset" form="surveyForm" className="btn btn-outline-secondary fw-semibold w-100">Đặt lại</button>
                    </div>
                    <div className="col-6 pe-0">
                      <button type="submit" form="surveyForm" className="btn btn-primary fw-semibold w-100" disabled={loading}><i className="bi bi-send me-2"></i>
                        {loading ? "Đang gửi..." : "Gửi phản hồi"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}