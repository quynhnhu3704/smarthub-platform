// services/userService.js
const API_URL = "/api/users"

// Lấy thông tin cá nhân
export const getProfile = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

// Cập nhật thông tin cá nhân
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

// Đổi mật khẩu
export const changePassword = async (data) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}