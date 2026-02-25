// src/pages/Login.jsx
import { useState, useContext } from "react"
import { loginUser } from "../../services/authService"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await loginUser(form)
      login(data)
      setSuccess("Đăng nhập thành công! Đang chuyển hướng...")
      setError("")
      setTimeout(() => navigate("/"), 1200)
    } catch (err) {
      setError(err.message)
      setSuccess("")
    }
  }

  const handleReset = () => {
    setForm({ username: "", password: "" })
    setError("")
    setSuccess("")
  }

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card-na border-0" style={{ maxWidth: "26.25em", width: "100%" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Đăng nhập</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} spellCheck="false">
            <div className="mb-3">
              <label className="form-label fw-medium">Tên đăng nhập <span className="text-danger">*</span></label>
              <input type="text" className="form-control" placeholder="vd: owner / staff1" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            
            <div className="mb-5">
              <label className="form-label fw-medium">Mật khẩu <span className="text-danger">*</span></label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="vd: 123456" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>Đặt lại</button>
              </div>
            </div>

            <div className="text-center mt-4 small">
              Bạn chưa có tài khoản?{" "}
              <span className="text-primary fw-semibold" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>Đăng ký ngay</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}