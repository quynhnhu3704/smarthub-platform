// src/pages/dashboard/staff/StaffEdit.jsx
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getStaffById, updateStaff } from "../../../services/userService"

function StaffEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", password: "" })

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const data = await getStaffById(id)
        setForm({ name: data.name || "", username: data.username || "", email: data.email || "", phone: data.phone || "", password: "" })
      } catch (err) {
        setError("Không tải được thông tin nhân viên.")
      } finally {
        setLoading(false)
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

  return (
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={() => navigate(-1)}>← Quay lại</button>

      <div className="container d-flex justify-content-center align-items-center mb-5">
        <div className="card-na border-0" style={{ maxWidth: "32rem", width: "100%" }}>
          <div className="card-body p-4">

            <h3 className="text-center mb-4 fw-bold text-primary">Cập nhật nhân viên</h3>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-medium">Tên nhân viên <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Username <span className="text-danger">*</span></label>
                <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Mật khẩu mới</label>
                <span className="text-warning fst-italic ms-2" style={{ fontSize: "0.85em" }}>(Không bắt buộc)</span>
                <div className="input-group">
                  <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={form.password} onChange={handleChange} />
                  <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                </div>

                <div className="col-6 mb-2">
                  <button type="reset" className="btn btn-outline-secondary w-100" onClick={() => setForm({ ...form, password: "" })}>Đặt lại</button>
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