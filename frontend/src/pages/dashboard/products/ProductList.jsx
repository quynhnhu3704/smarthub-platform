// src/pages/dashboard/products/ProductList.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

function ProductList() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const productsPerPage = 10

  const fetchProducts = async (page = currentPage, key = keyword, brand = selectedBrand, price = priceRange, sort = sortOrder) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/products?keyword=${key}&brand=${brand}&priceRange=${price}&sort=${sort}&limit=${productsPerPage}&page=${page}`)
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
      setTotalProducts(data.totalProducts || 0)
      setBrands(data.brands || [])
    } catch (error) { console.error(error) }
    setLoading(false)
  }

  useEffect(() => { setCurrentPage(1) }, [selectedBrand, priceRange, sortOrder])
  useEffect(() => { fetchProducts(currentPage) }, [currentPage, selectedBrand, priceRange, sortOrder])

  const handleSearch = (e) => { e.preventDefault(); setCurrentPage(1); fetchProducts(1, keyword) }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xoá sản phẩm?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá ngay",
      cancelButtonText: "Huỷ",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-2 mt-4" },
      buttonsStyling: false
    })
    if (!result.isConfirmed) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchProducts(currentPage)
      await Swal.fire({ icon: "success", title: "Đã xoá", text: "Sản phẩm đã được xoá.", timer: 1300, showConfirmButton: false, customClass: { popup: "na-swal-popup" } })
    } catch {
      Swal.fire({ icon: "error", title: "Xoá thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false })
    }
  }

  return (
    <>
      <div className="text-center my-4">
        <h2 className="fw-bold mb-1">Danh sách sản phẩm</h2>
        <div className="text-muted">{totalProducts} sản phẩm</div>
      </div>

      <div className="d-flex mx-auto justify-content-between align-items-center" style={{ width: "95%" }}>
        <Link to="/dashboard/products/create" className="btn btn-primary fw-semibold">
          <i className="bi bi-database-add me-1"></i> Thêm sản phẩm
        </Link>
        <form className="d-flex" onSubmit={handleSearch}>
          <input className="form-control me-2" type="text" placeholder="Tìm kiếm sản phẩm..." style={{ width: "220px" }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <div className="d-flex mx-auto justify-content-end gap-2 my-4" style={{ width: "95%" }}>
        <select className="form-select" style={{ width: "200px" }} value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
          <option value="">Tất cả brand</option>
          {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select className="form-select" style={{ width: "200px" }} value={priceRange} onChange={e => setPriceRange(e.target.value)}>
          <option value="">Tất cả giá</option>
          <option value="low">Dưới 5 triệu</option>
          <option value="mid">5 - 15 triệu</option>
          <option value="high">Trên 15 triệu</option>
        </select>
        <select className="form-select" style={{ width: "200px" }} value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="">Sắp xếp</option>
          <option value="asc">Giá: Thấp → Cao</option>
          <option value="desc">Giá: Cao → Thấp</option>
        </select>
      </div>

      <div className="d-flex justify-content-center">
        <div className="table-responsive position-relative" style={{ width: "95%" }}>
          {loading && <div className="position-absolute top-0 end-0 p-2"><div className="spinner-border spinner-border-sm text-primary" role="status"></div></div>}
          <table className="table table-striped table-hover table-borderless align-middle" style={{ fontSize: "0.85em" }}>
            <thead className="text-center">
              <tr>
                <th>STT</th><th>Tên sản phẩm</th><th>Hình ảnh</th><th>Thương hiệu</th><th>Giá</th><th>Giá gốc</th><th>Tồn kho</th><th>RAM</th><th>Bộ nhớ</th><th>Pin</th><th>Đánh giá</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p, index) => (
                  <tr key={p._id}>
                    <td className="text-center"><strong>{(currentPage - 1) * productsPerPage + index + 1}</strong></td>
                    <td title={p.product_name}>{p.product_name}</td>
                    <td><img src={p.image_url} width="40" height="40" className="rounded d-block mx-auto" alt="" /></td>
                    <td className="text-center">{p.brand}</td>
                    <td className="text-end">{p.price?.toLocaleString()} ₫</td>
                    <td className="text-end">{p.original_price?.toLocaleString()} ₫</td>
                    <td className="text-center">{p.stock}</td>
                    <td className="text-center">{p.ram} GB</td>
                    <td className="text-center">{p.storage} GB</td>
                    <td className="text-center">{p.battery} mAh</td>
                    <td className="text-center">{p.rating_value} ({p.rating_count})</td>
                    <td className="text-center">
                      <Link to={`/dashboard/products/edit/${p._id}`} className="btn btn-sm btn-warning" style={{ fontSize: "0.95em" }}>
                        <i className="bi bi-pencil-square"></i> Sửa
                      </Link>&nbsp;
                      <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger" style={{ fontSize: "0.95em" }}>
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="12"><h5 className="text-center text-muted">Hiện chưa có sản phẩm nào.</h5></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-center my-5">
        <nav>
          <ul className="pagination pagination-lg shadow-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link rounded-start" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>←</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link fw-semibold" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link rounded-end" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>→</button>
            </li>
          </ul>
        </nav>
      </div>

      <style>{`th, td { max-width: 12.5em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`}</style>
    </>
  )
}

export default ProductList