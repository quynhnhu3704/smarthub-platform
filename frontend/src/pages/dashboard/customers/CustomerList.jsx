// src/pages/dashboard/customers/CustomerList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const customersPerPage = 20;

  const fetchCustomers = async (page = currentPage, key = keyword) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/customers?keyword=${key}&limit=${customersPerPage}&page=${page}`, { headers: { Authorization: `Bearer ${token}` } });
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setTotalCustomers(data.totalCustomers || 0);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { setCurrentPage(1); }, [keyword]);
  useEffect(() => { fetchCustomers(currentPage); }, [currentPage, keyword]);

  const handleSearch = (e) => { e.preventDefault(); setCurrentPage(1); fetchCustomers(1, keyword); };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xoá khách hàng?",
      text: "Hành động này không thể hoàn tác.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá ngay",
      cancelButtonText: "Huỷ",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-3 mt-4" },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/customers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCustomers(currentPage);
      await Swal.fire({ icon: "success", title: "Đã xoá", text: "khách hàng đã được xoá.", timer: 1300, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch {
      Swal.fire({ icon: "error", title: "Xoá thất bại", text: "Vui lòng thử lại.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
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
        <div><h2 className="fw-bold mb-1">Danh sách khách hàng</h2><div className="text-muted fs-6">Tổng cộng: <strong>{totalCustomers.toLocaleString("vi-VN")}</strong> khách hàng</div></div>
        <Link to="/dashboard/customers/create" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"><i className="bi bi-folder-plus"></i> Thêm mới</Link>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <form className="input-group" onSubmit={handleSearch}>
                <input type="text" className="form-control" placeholder="Tìm theo tên khách hàng..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-6 d-flex align-items-center ms-auto">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setKeyword(""); setCurrentPage(1); }}>
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
                <thead><tr><th colSpan="9"><div className="placeholder-glow"><div className="placeholder col-12 bg-secondary rounded" style={{ height: "40px" }}></div></div></th></tr></thead>
                <tbody>
                  {[...Array(customersPerPage)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-8 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Chưa có khách hàng nào</h5>
              <p className="text-muted">Hãy thêm khách hàng mới để bắt đầu.</p>
              <Link to="/dashboard/customers/create" className="btn btn-primary mt-3">Thêm khách hàng ngay</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-borderless table-hover mb-0 align-middle rounded-3">
                <thead className="table-light">
                  <tr className="text-center">
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, index) => (
                    <tr key={c._id}>
                      <td className="text-center fw-bold text-dark" style={{ fontSize: "0.95em"}}>{(currentPage - 1) * customersPerPage + index + 1}</td>
                      <td className="fw-medium text-dark" style={{ fontSize: "0.95em"}}>{c.name}</td>
                      <td className="text-center text-dark" style={{ fontSize: "0.95em"}}>{c.username}</td>
                      <td className="text-center text-dark" style={{ fontSize: "0.95em"}}>{c.email}</td>
                      <td className="text-center text-dark" style={{ fontSize: "0.95em" }}>
                        {c.phone
                          ? c.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
                          : "-"}
                      </td>
                      <td className="text-center text-dark"><span className="badge rounded-pill bg-secondary-subtle text-secondary fw-bold">{c.role}</span></td>
                      <td className="text-center text-dark">
                        {c.status === "active"
                          ? <span className="badge rounded-pill bg-success-subtle text-success">active</span>
                          : <span className="badge rounded-pill bg-danger-subtle text-danger">inactive</span>}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/dashboard/customers/edit/${c._id}`} className="btn btn-sm btn-warning d-flex align-items-center gap-1 rounded-pill" title="Sửa khách hàng"><i className="bi bi-pencil-square"></i></Link>
                          <button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill" title="Xoá khách hàng"><i className="bi bi-trash"></i></button>
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
          <nav aria-label="Customer pagination">
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

export default CustomerList;