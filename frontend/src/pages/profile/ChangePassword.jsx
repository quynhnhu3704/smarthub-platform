// src/pages/profile/ChangePassword.jsx
import { useState } from "react"
import { changePassword } from "../../services/userService"
import { useNavigate } from "react-router-dom"

export default function ChangePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      setLoading(true)
      const data = await changePassword(form)
      setSuccess(data.message)
      setTimeout(() => {
        localStorage.removeItem("token")
        navigate("/login")
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={() => navigate(-1)}>← Quay lại</button>
      <div className="container d-flex justify-content-center align-items-center mb-5">
        <div className="card-na border-0" style={{ maxWidth:"32rem", width:"100%" }}>
          <div className="card-body p-4">
            <h3 className="text-center mb-3 fw-bold text-primary">Đổi mật khẩu</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-medium">Mật khẩu hiện tại</label>
                <div className="input-group">
                  <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" value={form.currentPassword} onChange={handleChange} className="form-control" required />
                  <span className="input-group-text" style={{ cursor:"pointer" }} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <i className={`bi ${showCurrentPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Mật khẩu mới</label>
                <div className="input-group">
                  <input type={showNewPassword ? "text" : "password"} name="newPassword" value={form.newPassword} onChange={handleChange} className="form-control" required />
                  <span className="input-group-text" style={{ cursor:"pointer" }} onClick={() => setShowNewPassword(!showNewPassword)}>
                    <i className={`bi ${showNewPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Xác nhận mật khẩu mới</label>
                <div className="input-group">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-control" required />
                  <span className="input-group-text" style={{ cursor:"pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Đang xử lý..." : "Lưu"}</button>
                </div>
                <div className="col-6">
                  <button type="reset" className="btn btn-outline-secondary w-100">Đặt lại</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}