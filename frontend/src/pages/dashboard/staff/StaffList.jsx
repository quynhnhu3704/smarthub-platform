// src/pages/dashboard/staff/StaffList.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

function StaffList() {
  const [staff, setStaff] = useState([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStaff, setTotalStaff] = useState(0)
  const staffPerPage = 10

  const fetchStaff = async (page = currentPage, key = keyword) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.get(`/api/staff?keyword=${key}&limit=${staffPerPage}&page=${page}`, { headers: { Authorization: `Bearer ${token}` } })
      setStaff(data.staff || [])
      setTotalPages(data.totalPages || 1)
      setTotalStaff(data.totalStaff || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStaff(currentPage) }, [currentPage])

  const handleSearch = (e) => { e.preventDefault(); setCurrentPage(1); fetchStaff(1, keyword) }

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Xoá nhân viên?", text: "Hành động này không thể hoàn tác.", icon: "warning", showCancelButton: true, confirmButtonText: "Xoá ngay", cancelButtonText: "Huỷ", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-2 mt-4" }, buttonsStyling: false })
    if (!result.isConfirmed) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchStaff(currentPage)
      await Swal.fire({ icon: "success", title: "Đã xoá", text: "Nhân viên đã được xoá.", timer: 1300, showConfirmButton: false, customClass: { popup: "na-swal-popup" } })
    } catch {
      Swal.fire({ icon: "error", title: "Xoá thất bại", text: "Vui lòng thử lại.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false })
    }
  }

  return (
    <>
      <div className="text-center my-4">
        <h2 className="fw-bold mb-1">Danh sách nhân viên</h2>
        <div className="text-muted">{totalStaff} nhân viên</div>
      </div>

      <div className="d-flex mx-auto justify-content-between align-items-center" style={{ width: "95%" }}>
        <Link to="/dashboard/staff/create" className="btn btn-primary fw-semibold"><i className="bi bi-person-add me-1"></i> Thêm nhân viên</Link>
        <form className="d-flex" onSubmit={handleSearch}>
          <input className="form-control me-2" type="text" placeholder="Tìm nhân viên..." style={{ width: "220px" }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <div className="table-responsive position-relative" style={{ width: "95%" }}>
          {loading && <div className="position-absolute top-0 end-0 p-2"><div className="spinner-border spinner-border-sm text-primary"></div></div>}
          <table className="table table-striped table-hover table-borderless align-middle" style={{ fontSize: "0.9em" }}>
            <thead className="text-center">
              <tr>
                <th>STT</th><th>Họ tên</th><th>Username</th><th>Email</th><th>Điện thoại</th><th>Vai trò</th><th>Ngày tạo</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((c, index) => (
                  <tr key={c._id}>
                    <td className="text-center"><strong>{(currentPage - 1) * staffPerPage + index + 1}</strong></td>
                    <td>{c.name}</td>
                    <td className="text-center">{c.username}</td>
                    <td className="text-center">{c.email}</td>
                    <td className="text-center">{c.phone}</td>
                    <td className="text-center"><span className="badge bg-primary">{c.role}</span></td>
                    <td className="text-center">{new Date(c.createdAt).toLocaleString("sv-SE").replace("T"," ")}</td>
                    <td className="text-center">
                      <Link to={`/dashboard/staff/edit/${c._id}`} className="btn btn-sm btn-warning"><i className="bi bi-pencil-square"></i> Sửa</Link>&nbsp;
                      <button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-danger"><i className="bi bi-trash"></i> Xoá</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8"><h6 className="text-center text-muted">Chưa có nhân viên nào.</h6></td></tr>
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

      <style>{`th, td { max-width: 14em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`}</style>
    </>
  )
}

export default StaffList