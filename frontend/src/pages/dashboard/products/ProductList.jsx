// src/pages/dashboard/products/ProductList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

  const fetchProducts = async (page = currentPage, key = keyword, brand = selectedBrand, price = priceRange, sort = sortOrder) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/products", { params: { keyword: key, brand, priceRange: price, sortOrder: sort, limit: productsPerPage, page } });
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
      setBrands(data.brands || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { setCurrentPage(1); }, [selectedBrand, priceRange, sortOrder, keyword]);
  useEffect(() => { fetchProducts(currentPage); }, [currentPage, selectedBrand, priceRange, sortOrder, keyword]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-3 mt-4" },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts(currentPage);
      await Swal.fire({ icon: "success", title: "Đã xóa", text: "Sản phẩm đã được xóa thành công.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Xóa thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 3) {
      pages.push("...");
    }
    for (let i = Math.max(end + 1, totalPages - 2); i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container-fluid py-4" style={{ width: "97.5%", minHeight:"67.5vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold mb-1">Danh sách sản phẩm</h2><div className="text-muted fs-6">Tổng cộng: <strong>{totalProducts.toLocaleString()}</strong> sản phẩm</div></div>
        <Link to="/dashboard/products/create" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"><i className="bi bi-folder-plus"></i> Thêm mới</Link>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <form className="input-group" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchProducts(1); }}>
                <input type="text" className="form-control" placeholder="Tìm theo tên sản phẩm..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <select className="form-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Tất cả thương hiệu</option>
                {brands.map((brand) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
              </select>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <select className="form-select" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">Tất cả mức giá</option>
                <option value="low">Dưới 5 triệu</option>
                <option value="mid">5 - 15 triệu</option>
                <option value="high">Trên 15 triệu</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6">
              <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Sắp xếp mặc định</option>
                <option value="asc">Giá: Thấp → Cao</option>
                <option value="desc">Giá: Cao → Thấp</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6 d-flex align-items-center">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setKeyword(""); setSelectedBrand(""); setPriceRange(""); setSortOrder(""); setCurrentPage(1); }}>
                <i className="bi bi-arrow-repeat me-1"></i>Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden rounded-3">
        <div className="card-body p-0 position-relative">
          {loading ? (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead><tr><th colSpan="10"><div className="placeholder-glow"><div className="placeholder col-12 bg-secondary rounded" style={{ height: "40px" }}></div></div></th></tr></thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-8 bg-secondary rounded"></div></td>
                      <td><div className="placeholder rounded" style={{ width: "60px", height: "60px" }}></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-8 bg-secondary rounded"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Chưa có sản phẩm nào</h5>
              <p className="text-muted">Hãy thêm sản phẩm mới để bắt đầu.</p>
              <Link to="/dashboard/products/create" className="btn btn-primary mt-3">Thêm sản phẩm ngay</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-borderless table-hover mb-0 align-middle rounded-3">
                <thead className="table-light">
                  <tr className="text-center">
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Thương hiệu</th>
                    <th>Giá bán</th>
                    <th>Giá gốc</th>
                    <th>Tồn kho</th>
                    <th>Đánh giá</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p._id}>
                      <td className="text-center fw-bold">{(currentPage - 1) * productsPerPage + index + 1}</td>
                      <td className="fw-medium" title={p.product_name}>{p.product_name}</td>
                      <td className="text-center"><img src={p.image_url} alt={p.product_name} className="rounded object-fit-cover" style={{ width: "50px", height: "50px" }} /></td>
                      <td className="text-center">{p.brand?.name || "-"}</td>
                      <td className="text-end fw-semibold text-primary">{p.price?.toLocaleString("vi-VN")} ₫</td>
                      <td className="text-end text-muted">{p.original_price ? `${p.original_price.toLocaleString("vi-VN")} ₫` : "-"}</td>
                      <td className="text-center"><span className={`badge rounded-pill px-3 py-2 fw-bold ${p.stock > 10 ? "bg-success-subtle text-success" : p.stock > 0 ? "bg-warning-subtle text-warning" : "bg-danger-subtle text-danger"}`}>{p.stock}</span></td>
                      <td className="text-center">
                        <span className="text-warning" style={{ fontSize: "0.85em "}}>
                          {Array.from({ length: 5 }, (_, i) => {
                            const rating = p.rating_value || 0
                            if (rating >= i + 1) return <i key={i} className="bi bi-star-fill"></i>
                            if (rating >= i + 0.5) return <i key={i} className="bi bi-star-half"></i>
                            return <i key={i} className="bi bi-star"></i>
                          })}
                        </span> <small className="text-muted">({p.rating_count || 0})</small>
                      </td>
                      <td className="text-center text-muted">{new Date(p.createdAt).toISOString().split("T")[0]}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/dashboard/products/edit/${p._id}`} className="btn btn-sm btn-warning d-flex align-items-center gap-1 rounded-pill" title="Sửa sản phẩm"><i className="bi bi-pencil-square"></i></Link>
                          <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill" title="Xóa sản phẩm"><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && !loading && (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <nav aria-label="Product pagination">
            <ul className="pagination pagination-lg mb-0 shadow-sm">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}><i className="bi bi-caret-left-fill"></i></button>
              </li>
              {getPageNumbers().map((pageNum, idx) => (
                <li key={idx} className={`page-item ${pageNum === currentPage ? "active" : ""} ${pageNum === "..." ? "disabled" : ""}`}>
                  {pageNum === "..." ? <span className="page-link">...</span> : <button className="page-link fw-semibold" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>}
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}><i className="bi bi-caret-right-fill"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
    </div>
  );
}

export default ProductList;