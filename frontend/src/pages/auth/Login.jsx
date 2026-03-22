// src/pages/Login.jsx
import { useState, useContext, useEffect } from "react"
import { loginUser, googleLogin } from "../../services/authService"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // 1. Callback Google
  const handleGoogleResponse = async (credentialResponse) => {
    try {
      const tokenGoogle = credentialResponse.credential
      const decoded = jwtDecode(tokenGoogle)
      const res = await googleLogin({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        username: decoded.email.split("@")[0] // username tạm
      })
      login(res)
      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Đăng nhập Google thất bại")
    }
  }

  // 2. Init GSI
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "815992651519-ga9uip1o5qgl4484ecp98n91demj2dmq.apps.googleusercontent.com",
        callback: handleGoogleResponse, // callback khi login thành công
      })
      // Tạo nút Google Sign-In (ẩn form, dùng riêng cho popup)
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"), // div target
        { 
          theme: "outline", // "outline" | "filled_blue" | "filled_black"
          size: "large", // "small" | "medium" | "large"
          width: "100%",
          // width: "400",  // <--- Đặt là "400" (đây là chiều rộng tối đa Google cho phép)
          type: "icon",       // "icon" | "standard"
          text: "signup_with",    // "signin_with" | "signup_with" | "continue_with" | "signin"
          shape: "pill",          // "rectangular" | "pill" | "circle" | "square"
        }
      )
    }
  }, [])

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

          {/* Google button + divider - decor đẹp */}
          <div className="mb-4">
            <div id="google-signin-button" className="mx-auto" style={{ width: "100%", display: "flex", justifyContent: "center" }}></div>
            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1 border-secondary" />
              <span className="px-3 text-muted small fw-medium">Hoặc đăng nhập bằng</span>
              <hr className="flex-grow-1 border-secondary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} spellCheck="false">
            <div className="mb-3">
              <label className="form-label fw-medium">Tên đăng nhập <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-medium">Mật khẩu <span className="text-danger">*</span></label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </span>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

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