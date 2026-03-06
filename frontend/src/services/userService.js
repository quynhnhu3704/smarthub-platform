// services/userService.js
// Lấy thông tin cá nhân
export const getProfile = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/users/profile`, {
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

  const res = await fetch(`/api/users/profile`, {
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

  const res = await fetch(`/api/users/change-password`, {
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

// Tạo khách hàng (owner)
export const createCustomer=async(data)=>{
  const token=localStorage.getItem("token")

  const res = await fetch(`/api/customers`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify(data)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

// Lấy thông tin khách hàng theo ID (owner)
export const getCustomerById = async (id) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw new Error("Failed to fetch customer")
  return res.json()
}

// Cập nhật khách hàng (owner)
export const updateCustomer = async (id, data) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error("Failed to update customer")
  return res.json()
}

// Tạo nhân viên (owner)
export const createStaff = async (data) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/staff`, {
    method: "POST",
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

// Lấy thông tin nhân viên theo ID (owner)
export const getStaffById = async (id) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw new Error("Failed to fetch staff")
  return res.json()
}

// Cập nhật nhân viên (owner)
export const updateStaff = async (id, data) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/staff/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) throw new Error("Failed to update staff")
  return res.json()
}

// Xóa nhân viên (owner)
export const deleteStaff = async (id) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`/api/staff/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw new Error("Failed to delete staff")
  return res.json()
}