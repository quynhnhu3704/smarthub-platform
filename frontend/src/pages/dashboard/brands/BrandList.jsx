// src/pages/dashboard/brands/BrandList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function BrandList() {
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const brandsPerPage = 10;

  const fetchBrands = async (page = currentPage, key = keyword, sort = sortOrder) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/brands", { params: { keyword: key, sortOrder: sort, limit: brandsPerPage, page } });
      setBrands(data.brands || []);
      setTotalPages(data.totalPages || 1);
      setTotalBrands(data.totalBrands || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [keyword, sortOrder]);
  useEffect(() => { fetchBrands(currentPage); }, [currentPage, keyword, sortOrder]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa thương hiệu?",
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
      await axios.delete(`/api/brands/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBrands(currentPage);
      await Swal.fire({ icon: "success", title: "Đã xóa", text: "Thương hiệu đã được xóa.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
    }
  };

  const handleActivate = async (id) => {
    const result = await Swal.fire({
      title: "Khôi phục?",
      text: "Thương hiệu sẽ hoạt động lại.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-success", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-3 mt-4" },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/brands/${id}`, { status: "active" }, { headers: { Authorization: `Bearer ${token}` } });
      fetchBrands(currentPage);
      await Swal.fire({ icon: "success", title: "Đã khôi phục", text: "Thương hiệu đã hoạt động.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 3) pages.push("...");
    for (let i = Math.max(end + 1, totalPages - 2); i <= totalPages; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="container-fluid py-4" style={{ width: "97.5%", minHeight:"67.5vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Danh sách thương hiệu</h2>
          <div className="text-muted fs-6">Tổng cộng: <strong>{totalBrands.toLocaleString()}</strong> thương hiệu</div>
        </div>
        <Link to="/dashboard/brands/create" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"><i className="bi bi-folder-plus"></i> Thêm mới</Link>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <form className="input-group" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchBrands(1); }}>
                <input type="text" className="form-control" placeholder="Tìm theo tên thương hiệu..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6">
              <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Sắp xếp mặc định</option>
                <option value="az">Tên: A → Z</option>
                <option value="za">Tên: Z → A</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6 d-flex align-items-center ms-auto">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setKeyword(""); setSortOrder(""); setCurrentPage(1); }}>
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
                <thead>
                  <tr>
                    <th colSpan="5">
                      <div className="placeholder-glow">
                        <div className="placeholder col-12 bg-secondary rounded" style={{ height: "40px" }}></div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(brandsPerPage)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-8 bg-secondary rounded"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Chưa có thương hiệu nào</h5>
              <p className="text-muted">Hãy thêm thương hiệu mới để bắt đầu.</p>
              <Link to="/dashboard/brands/create" className="btn btn-primary mt-3">Thêm thương hiệu ngay</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-borderless table-hover mb-0 align-middle rounded-3">
                <thead className="table-light">
                  <tr className="text-center">
                    <th>STT</th>
                    <th>Tên thương hiệu</th>
                    <th>Số sản phẩm</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((b, index) => (
                    <tr key={b._id}>
                      <td className="text-center fw-bold text-dark" style={{ fontSize: "0.95em"}}>{(currentPage - 1) * brandsPerPage + index + 1}</td>
                      <td className="text-center fw-medium text-dark" style={{ fontSize: "0.95em"}}>{b.name}</td>
                      <td className="text-center"><span className="badge bg-secondary-subtle text-secondary rounded-pill" style={{ width: "3.25em" }}>{b.productCount}</span></td>
                      <td className="text-center">
                        {b.status === "active"
                          ? <span className="badge rounded-pill bg-success-subtle text-success">active</span>
                          : <span className="badge rounded-pill bg-danger-subtle text-danger">inactive</span>}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/dashboard/brands/edit/${b._id}`} className="btn btn-sm btn-warning d-flex align-items-center gap-1 rounded-pill"><i className="bi bi-pencil-square"></i></Link>
                          <button onClick={() => handleDelete(b._id)} className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill"><i className="bi bi-trash"></i></button>
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

      {!loading && (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <nav>
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

export default BrandList;