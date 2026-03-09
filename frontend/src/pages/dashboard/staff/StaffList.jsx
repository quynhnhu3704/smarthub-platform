// src/pages/dashboard/staff/StaffList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const staffPerPage = 10;

  const fetchStaff = async (page = currentPage, key = keyword) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/staff?keyword=${key}&limit=${staffPerPage}&page=${page}`, { headers: { Authorization: `Bearer ${token}` } });
      setStaff(data.staff || []);
      setTotalPages(data.totalPages || 1);
      setTotalStaff(data.totalStaff || 0);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { setCurrentPage(1); }, [keyword]);
  useEffect(() => { fetchStaff(currentPage); }, [currentPage, keyword]);

  const handleSearch = (e) => { e.preventDefault(); setCurrentPage(1); fetchStaff(1, keyword); };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa nhân viên?",
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
      await axios.delete(`/api/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchStaff(currentPage);
      await Swal.fire({ icon: "success", title: "Đã xóa", text: "Nhân viên đã được xóa thành công.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch {
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
    <div className="container-fluid py-4" style={{ width: "97.5%" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold mb-1">Danh sách nhân viên</h2><div className="text-muted fs-6">Tổng cộng: <strong>{totalStaff.toLocaleString()}</strong> nhân viên</div></div>
        <Link to="/dashboard/staff/create" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"><i className="bi bi-folder-plus"></i> Thêm mới</Link>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <form className="input-group" onSubmit={handleSearch}>
                <input type="text" className="form-control" placeholder="Tìm theo tên nhân viên..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
            </div>
            <div className="col-lg-8 col-md-6 d-flex align-items-center justify-content-end">
              <button className="btn btn-outline-secondary" onClick={() => { setKeyword(""); setCurrentPage(1); }}>
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
                <thead><tr><th colSpan="8"><div className="placeholder-glow"><div className="placeholder col-12 bg-secondary rounded" style={{ height: "40px" }}></div></div></th></tr></thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-8 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Chưa có nhân viên nào</h5>
              <p className="text-muted">Hãy thêm nhân viên mới để bắt đầu.</p>
              <Link to="/dashboard/staff/create" className="btn btn-primary mt-3">Thêm nhân viên ngay</Link>
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
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, index) => (
                    <tr key={s._id}>
                      <td className="text-center fw-bold">{(currentPage - 1) * staffPerPage + index + 1}</td>
                      <td className="fw-medium">{s.name}</td>
                      <td className="text-center">{s.username}</td>
                      <td className="text-center">{s.email}</td>
                      <td className="text-center">{s.phone || "-"}</td>
                      <td className="text-center"><span className="badge rounded-pill bg-secondary-subtle text-secondary fw-bold">{s.role}</span></td>
                      <td className="text-center text-muted">{new Date(s.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" }).replace("thg", "Thg")}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/dashboard/staff/edit/${s._id}`} className="btn btn-sm btn-warning d-flex align-items-center gap-1 rounded-pill" title="Sửa nhân viên"><i className="bi bi-pencil-square"></i></Link>
                          <button onClick={() => handleDelete(s._id)} className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill" title="Xóa nhân viên"><i className="bi bi-trash"></i></button>
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
          <nav aria-label="Staff pagination">
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

export default StaffList;