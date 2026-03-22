// src/components/Navbar.jsx
import { useContext, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext)
  const { cartCount } = useContext(CartContext)
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false) // kiểm soát dropdown lịch sử

  // === PHẦN LỊCH SỬ TÌM KIẾM ===
  const [searchHistory, setSearchHistory] = useState([]) // dữ liệu từ backend

  // === PHẦN XU HƯỚNG TÌM KIẾM ===
  const [trendingKeywords, setTrendingKeywords] = useState([]) // dữ liệu từ backend

  // Chỗ này gọi API lấy lịch sử tìm kiếm và xu hướng
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/search-history", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        const data = await res.json()
        setSearchHistory((data.history || []).slice(0, 5))
      } catch (err) { console.error("Lỗi lấy lịch sử", err) }
    }

    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/trending-keywords")
        const data = await res.json()
        setTrendingKeywords((data.trending || []).slice(0, 10))
      } catch (err) { console.error("Lỗi trending", err) }
    }

    if (user) fetchHistory()
    fetchTrending()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => { document.removeEventListener("mousedown", handleClickOutside) }
  }, [])

  const saveSearch = async (kw) => {
    try {
      if (!user) return
      await fetch("/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ keyword: kw })
      })
    } catch (err) { console.error("Lỗi lưu search", err) }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const k = keyword.trim()

    if (!k) {
      navigate("/products")
      return
    }

    const normalized = k.toLowerCase() // ADDED: chuẩn hóa keyword

    try {
      await saveSearch(normalized)

      setSearchHistory(prev => {
        const filtered = prev.filter(i => i.keyword !== normalized)
        return [{ keyword: normalized }, ...filtered].slice(0, 5)
      })

      // ===== cập nhật trending ngay lập tức =====
      // setTrendingKeywords(prev => {
      //   const filtered = prev.filter(i => i !== normalized)
      //   return [normalized, ...filtered].slice(0, 6)
      // })

      // gọi lại trending từ server (đã sort theo count)
      const resTrending = await fetch("/api/trending-keywords")
      const dataTrending = await resTrending.json()
      setTrendingKeywords((dataTrending.trending || []).slice(0, 10))
    } catch (err) { console.error("Lỗi lưu search", err) }

    navigate(`/products?keyword=${encodeURIComponent(normalized)}`)
    setShowDropdown(false)
  }

  // Xóa 1 lịch sử tìm kiếm
  const handleDeleteHistoryItem = async (kw) => {
    try {
      await fetch(`/api/search-history/${kw}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
    } catch (err) { console.error(err) }

    setSearchHistory(prev => prev.filter(item => item.keyword !== kw))
  }

  // Xóa toàn bộ lịch sử
  const handleClearAllHistory = async () => {
    try {
      await fetch("/api/search-history", { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
    } catch (err) { console.error(err) }

    setSearchHistory([])
  }

  const handleSelectHistory = async (kw) => {
    const normalized = kw.toLowerCase()

    // log search event (không tăng stats và history)
    try {
      await fetch("/api/search-event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ keyword: normalized })
      })
    } catch (err) { console.error("Lỗi log search event", err) }

    setKeyword(normalized)
    navigate(`/products?keyword=${encodeURIComponent(normalized)}`)
    setShowDropdown(false)
  }

  // Chọn xu hướng tìm kiếm
  const handleSelectTrending = async (kw) => {
    const normalized = kw.toLowerCase()

    await saveSearch(normalized)

    // cập nhật lịch sử ngay lập tức
    setSearchHistory(prev => {
      const filtered = prev.filter(i => i.keyword !== normalized)
      return [{ keyword: normalized }, ...filtered].slice(0, 5)
    })

    // cập nhật trending ngay lập tức
    // setTrendingKeywords(prev => {
    //   const filtered = prev.filter(i => i !== normalized)
    //   return [normalized, ...filtered].slice(0, 6)
    // })

    const resTrending = await fetch("/api/trending-keywords")
    const dataTrending = await resTrending.json()
    setTrendingKeywords((dataTrending.trending || []).slice(0, 10))

    setKeyword(normalized)
    navigate(`/products?keyword=${encodeURIComponent(normalized)}`)
    setShowDropdown(false)
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Huỷ",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-2 mt-4" },
      buttonsStyling: false
    })

    if (!result.isConfirmed) return

    logout()
    navigate("/")

    await Swal.fire({
      icon: "success",
      title: "Đã đăng xuất",
      text: "Bạn đã đăng xuất khỏi hệ thống.",
      timer: 1000,
      showConfirmButton: false,
      customClass: { popup: "na-swal-popup" }
    })
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid px-5">
        <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>&#9776;</button>
        <Link className="navbar-brand fw-bold ms-3 text-primary" to="/"><i className="bi bi-skype me-2 fs-4"></i>SmartHub</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">

            <li className="nav-item me-5 position-relative">
              <form className="d-flex" onSubmit={handleSearch} onFocus={() => setShowDropdown(true)} ref={searchInputRef}>
                <input className="form-control me-2" type="text" placeholder="Tìm theo tên sản phẩm..." style={{ width: "500px" }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>

                {/* Dropdown lịch sử + xu hướng */}
                {showDropdown && (
                  <div className="position-absolute top-100 start-0 w-100 bg-white shadow rounded mt-1" style={{ zIndex: 1000 }} ref={dropdownRef}>

                    {/* Lịch sử tìm kiếm */}
                    {searchHistory.length > 0 && (
                      <>
                        <div className="p-3 pb-0 d-flex justify-content-between align-items-center">
                          <strong>Lịch sử tìm kiếm</strong>
                          <button type="button" className="btn btn-sm btn-link text-danger" onClick={handleClearAllHistory}>Xóa tất cả</button>
                        </div>

                        {searchHistory.map((item, idx) => (
                          <button key={idx} type="button" className="d-flex justify-content-between align-items-center px-3 py-1 hover-bg-light w-100 text-start border-0 bg-transparent" onClick={() => handleSelectHistory(item.keyword)}>
                            <div className="d-flex align-items-center gap-2 flex-grow-1">
                              <i className="bi bi-clock-history text-muted"></i>
                              <small className="text-dark">{item.keyword}</small>
                            </div>
                            <button type="button" className="btn btn-sm btn-link text-muted" onClick={(e) => {
                                e.stopPropagation()  // ← ngăn click lan ra button cha
                                handleDeleteHistoryItem(item.keyword)
                              }}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </button>
                        ))}
                      </>
                    )}

                    {/* Xu hướng tìm kiếm */}
                    <div className="p-3 pb-0"><strong>Xu hướng tìm kiếm</strong></div>

                    <div className="p-3 d-flex flex-wrap gap-2">
                      {trendingKeywords.map((kw, idx) => (
                        <button key={idx} type="button" className="btn btn-sm btn-outline-secondary rounded-pill d-flex align-items-center gap-2" onClick={() => handleSelectTrending(kw)}><i className="bi bi-search"></i>{kw}</button>
                      ))}
                    </div>

                  </div>
                )}
              </form>
            </li>

            <li className="nav-item mx-1"><Link className="nav-link" to="/">Trang chủ</Link></li>
            <li className="nav-item mx-1"><a className="nav-link" href="#products">Sản phẩm</a></li>

            <li className="nav-item position-relative mx-1">
              <Link className="nav-link" to="/cart">
                <i className="bi bi-cart3 fs-5"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.75rem" }}>{cartCount}</span>
                )}
              </Link>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-lg-3">
                <button className="btn btn-primary dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown"><i className="bi bi-person-circle me-2"></i>{user.username}</button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                  <li><Link className="dropdown-item" to="/change-password">Đổi mật khẩu</Link></li>
                  <li><Link className="dropdown-item" to="/my-orders">Đơn hàng của tôi</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</button>
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