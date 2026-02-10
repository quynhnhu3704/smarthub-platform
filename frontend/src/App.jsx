import Navbar from './components/Navbar'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Header />

      <main className="container my-5">
        <div className="card card-na p-4">
          <h4>Dashboard</h4>
          <p>Chỗ này sau gắn API, bảng thiết bị, thống kê…</p>
        </div>
      </main>

      <Footer />
    </>
  )
}
