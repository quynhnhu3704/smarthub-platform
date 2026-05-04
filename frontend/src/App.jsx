// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import ScrollToTop from "./components/ScrollToTop";

import ProductCatalog from "./pages/shop/ProductCatalog"
import ProductDetail from "./pages/shop/ProductDetail"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import Profile from "./pages/profile/Profile"
import ChangePassword from "./pages/profile/ChangePassword"

import ProductList from "./pages/dashboard/products/ProductList"
import ProductCreate from "./pages/dashboard/products/ProductCreate"
import ProductEdit from "./pages/dashboard/products/ProductEdit"

import CustomerList from "./pages/dashboard/customers/CustomerList"
import CustomerCreate from "./pages/dashboard/customers/CustomerCreate"
import CustomerEdit from "./pages/dashboard/customers/CustomerEdit"

import StaffList from "./pages/dashboard/staff/StaffList"
import StaffCreate from "./pages/dashboard/staff/StaffCreate"
import StaffEdit from "./pages/dashboard/staff/StaffEdit"

import BrandList from "./pages/dashboard/brands/BrandList"
import BrandCreate from "./pages/dashboard/brands/BrandCreate"
import BrandEdit from "./pages/dashboard/brands/BrandEdit"

import OrderList from "./pages/dashboard/orders/OrderList"

import Cart from "./pages/cart/Cart"
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/payment/Payment";
import MyOrders from "./pages/my-orders/MyOrders";

import Chatbot from "./components/chatbot/Chatbot"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/dashboard/products" element={<ProductList />} />
          <Route path="/dashboard/products/create" element={<ProductCreate />} />
          <Route path="/dashboard/products/edit/:id" element={<ProductEdit />} />

          <Route path="/dashboard/customers" element={<CustomerList />} />
          <Route path="/dashboard/customers/create" element={<CustomerCreate />} />
          <Route path="/dashboard/customers/edit/:id" element={<CustomerEdit />} />

          <Route path="/dashboard/staff" element={<StaffList />} />
          <Route path="/dashboard/staff/create" element={<StaffCreate />} />
          <Route path="/dashboard/staff/edit/:id" element={<StaffEdit />} />

          <Route path="/dashboard/brands" element={<BrandList />} />
          <Route path="/dashboard/brands/create" element={<BrandCreate />} />
          <Route path="/dashboard/brands/edit/:id" element={<BrandEdit />} />

          <Route path="/dashboard/orders" element={<OrderList />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/my-orders" element={<MyOrders />} />

        </Routes>

        <Chatbot />

      </Layout>
    </BrowserRouter>
  )
}

export default App