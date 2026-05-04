// src/services/orderService.js
export const createOrder = async (data, token) => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // QUAN TRỌNG
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Create order failed");
  }

  return res.json();
};

// ✅ THÊM ĐOẠN NÀY
export const getMyOrders = async (token) => {
  const res = await fetch("/api/orders/my-orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Get my orders failed");
  }

  return res.json();
};