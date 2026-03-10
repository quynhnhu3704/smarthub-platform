// src/pages/dashboard/staff/StaffEdit.jsx
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getStaffById, updateStaff } from "../../../services/userService"

function StaffEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", password: "", status:"active" })

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setFetching(true)
        const data = await getStaffById(id)
        setForm({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          status: data.status || "active"
        })
      } catch (err) {
        setError("Không tải được thông tin nhân viên.")
      } finally {
        setFetching(false)
      }
    }
    fetchStaff()
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      const payload = { ...form }
      if (!payload.password) delete payload.password
      await updateStaff(id, payload)
      setSuccess("Cập nhật nhân viên thành công. Đang chuyển trang...")
      setTimeout(() => navigate("/dashboard/staff"), 1500)
    } catch (err) {
      setError(err.message || "Cập nhật nhân viên thất bại.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-center mt-5" style={{ minHeight:"60vh" }}>Đang tải...</div>

  return (
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={() => navigate(-1)}><i className="bi bi-arrow-left"></i> Quay lại</button>

      <div className="container d-flex justify-content-center align-items-center mb-5 position-relative">
        <div className="card-na border-0" style={{ maxWidth: "32rem", width: "100%" }}>
          <div className="card-body p-4 position-relative">
            <h3 className="text-center mb-4 fw-bold text-primary">Cập nhật nhân viên</h3>

            {loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2 rounded">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            )}

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-medium">Tên nhân viên <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Username <span className="text-danger">*</span></label>
                <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Mật khẩu mới</label>
                <span className="text-warning fst-italic ms-2" style={{ fontSize: "0.85em" }}>(Không bắt buộc)</span>

                <div className="input-group">
                  <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={form.password} onChange={handleChange} disabled={loading}/>
                  <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Trạng thái</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange} disabled={loading}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                </div>

                <div className="col-6 mb-2">
                  <button type="reset" className="btn btn-outline-secondary w-100" onClick={() => setForm({ ...form, password: "" })} disabled={loading}>Đặt lại</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default StaffEdit