// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import ProductList from "./pages/products/ProductList"
import ProductDetail from "./pages/products/ProductDetail"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProductManagement from "./pages/admin/ProductManagement"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/products" element={<ProductManagement />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App