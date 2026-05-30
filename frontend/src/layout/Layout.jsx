import { useEffect, useState, useContext } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import { AuthContext } from "../context/AuthContext"

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // THÊM ĐOẠN NÀY
  const { user } = useContext(AuthContext)
  
  const isAdmin =
    user && ["owner", "staff"].includes(user.role)

  // Load trạng thái từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen")
    if (saved === "true") setSidebarOpen(true)
  }, [])

  // Lưu trạng thái
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen)
  }, [sidebarOpen])

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="d-flex">
        {isAdmin && <Sidebar open={sidebarOpen} />}
        
        <div
          id="mainContent"
          className={`flex-grow-1 ${
            isAdmin && sidebarOpen ? "shifted" : ""
          }`}
        >
          {children}
          <Footer />
        </div>
      </div>
    </>
  )
}