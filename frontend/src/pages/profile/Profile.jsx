// src/pages/profile/Profile.jsx
import { useEffect, useState, useContext } from "react"
import { getProfile, updateProfile } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"

export default function Profile() {
  const { login } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ username: "", name: "", email: "", phone: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const roleMap = { owner: "Chủ cửa hàng", staff: "Nhân viên", customer: "Khách hàng" }
  const getRoleLabel = (role) => roleMap[role] || role

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile()
        setUser(data)
        setForm({ username: data.username, name: data.name, email: data.email, phone: data.phone })
      } catch (err) { setError(err.message) }
    }
    fetchData()
  }, [])

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }) }

  const handleReset = () => { setForm({ username: user.username, name: user.name, email: user.email, phone: user.phone }); setError(""); setSuccess("") }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      const data = await updateProfile(form)
      setUser(data.user)
      login({ token: localStorage.getItem("token"), user: data.user })
      setEditing(false)
      setSuccess("Cập nhật thành công")
    } catch (err) { setError(err.message) }
  }

  if (!user) return <div className="text-center mt-5">Loading...</div>

  return (
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={() => editing ? setEditing(false) : window.history.back()}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="container d-flex justify-content-center align-items-center mb-5">
        <div className="card-na border-0" style={{ maxWidth: "32rem", width: "100%" }}>
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">{editing ? "Chỉnh sửa hồ sơ" : "Thông tin cá nhân"}</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {!editing ? (
              <>
                <div className="mb-3">
                  <label className="form-label fw-medium">Tên đăng nhập</label>
                  <input type="text" className="form-control" value={user.username} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ tên</label>
                  <input type="text" className="form-control" value={user.name} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Vai trò</label>
                  <input type="text" className="form-control" value={getRoleLabel(user.role)} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Số điện thoại</label>
                  <input type="tel" className="form-control" value={user.phone} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Email</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                </div>

                <div className="text-center mb-2">
                  <button type="button" onClick={() => setEditing(true)} className="btn btn-outline-primary fw-semibold">
                    <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} spellCheck="false">
                <div className="mb-3">
                  <label className="form-label fw-medium">Tên đăng nhập <span className="text-danger">*</span></label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Họ tên <span className="text-danger">*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Vai trò</label>
                  <input type="text" className="form-control" value={getRoleLabel(user.role)} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
                </div>

                <div className="row">
                  <div className="col-6 mb-2">
                    <button type="submit" className="btn btn-primary w-100">Lưu</button>
                  </div>
                  <div className="col-6 mb-2">
                    <button type="button" onClick={handleReset} className="btn btn-outline-secondary w-100">Đặt lại</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}