// services/productService.js
export const getProducts = async (page = 1, limit = 10, keyword = "", brand = "", priceRange = "", sortOrder = "") => {
  const params = new URLSearchParams({ page, limit, keyword, brand, priceRange, sortOrder })
  const res = await fetch(`/api/products?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export const getProductById = async (id) => {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error("Failed to fetch product")
  return res.json()
}