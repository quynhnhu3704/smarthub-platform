// src/services/brandService.js
export const getBrands = async () => {
  const res = await fetch("/api/brands")
  if (!res.ok) throw new Error("Failed to fetch brands")
  return res.json()
}

export const getBrandById = async (id) => {
  const res = await fetch(`/api/brands/${id}`)
  if (!res.ok) throw new Error("Failed to fetch brand")
  return res.json()
}