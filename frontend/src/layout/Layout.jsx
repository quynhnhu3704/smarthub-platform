import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        <Sidebar open={sidebarOpen} />
        
        <div
          id="mainContent"
          className={`flex-grow-1 ${sidebarOpen ? "shifted" : ""}`}
        >
          {children}
          <Footer />
        </div>
      </div>
    </>
  )
}