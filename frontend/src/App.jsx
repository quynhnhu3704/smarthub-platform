// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"

import ProductCatalog from "./pages/shop/ProductCatalog"
import ProductDetail from "./pages/shop/ProductDetail"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import ProductList from "./pages/dashboard/products/ProductList"
import ProductCreate from "./pages/dashboard/products/ProductCreate"
import ProductEdit from "./pages/dashboard/products/ProductEdit"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard/products" element={<ProductList />} />
          <Route path="/dashboard/products/create" element={<ProductCreate />} />
          <Route path="/dashboard/products/edit/:id" element={<ProductEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App