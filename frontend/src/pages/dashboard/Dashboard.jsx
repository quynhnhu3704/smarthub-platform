// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react"
import axios from "axios"

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = "#6f42c1", height = 40 }) {
  if (data.length < 2) return null
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const w = 110, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(" ")
  const filled = `0,${h} ${pts} ${w},${h}`
  const gId = `sg${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={filled} fill={`url(#${gId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimCounter({ to, duration = 1100, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [to, duration])
  return <>{prefix}{val.toLocaleString("vi-VN")}{suffix}</>
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const [hov, setHov] = useState(null)
  if (!data?.length) return <p style={{ color: "var(--na-muted)", fontSize: 13 }}>Không có dữ liệu</p>
  const slice = data.slice(-14)
  const max = Math.max(...slice.map(d => d.revenue))
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 130 }}>
      {slice.map((d, i) => {
        const pct = max ? (d.revenue / max) * 100 : 0
        const isH = hov === i
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {isH && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
                transform: "translateX(-50%)", background: "var(--na-ink)",
                color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 6,
                whiteSpace: "nowrap", zIndex: 10, boxShadow: "var(--shadow-soft)"
              }}>
                {(d.revenue / 1e6).toFixed(1)}M₫
              </div>
            )}
            <div style={{
              width: "100%", borderRadius: "5px 5px 0 0",
              background: isH
                ? "linear-gradient(180deg, var(--na-accent) 0%, var(--na-primary) 100%)"
                : "linear-gradient(180deg, var(--na-primary-2) 0%, var(--na-primary-3) 100%)",
              height: `${pct}%`, minHeight: 4,
              transition: `height 0.6s cubic-bezier(.34,1.56,.64,1) ${i * 25}ms, background 0.2s`,
              boxShadow: isH ? "0 0 14px rgba(111,66,193,.5)" : "none"
            }} />
            <div style={{ fontSize: 8, color: "var(--na-muted)", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 26 }}>
              {d._id.day}/{d._id.month}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 130 }) {
  const [hov, setHov] = useState(null)
  const colors = ["#6f42c1", "#b085f5", "#8c5fe0", "#c9a227", "#5936a3"]
  const total = segments.reduce((s, d) => s + d.value, 0)
  let cum = 0
  const r = 46, cx = 60, cy = 60, sw = 17
  const arcs = segments.map((seg, i) => {
    const ratio = seg.value / total
    const a1 = cum * 2 * Math.PI - Math.PI / 2
    const a2 = (cum + ratio) * 2 * Math.PI - Math.PI / 2
    cum += ratio
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${ratio > 0.5 ? 1 : 0} 1 ${x2} ${y2}`, color: colors[i % colors.length], ...seg }
  })
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill="none" stroke={arc.color}
          strokeWidth={hov === i ? sw + 4 : sw} strokeLinecap="round"
          style={{ cursor: "pointer", transition: "stroke-width 0.2s", filter: hov === i ? `drop-shadow(0 0 7px ${arc.color})` : "none" }}
          onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
      ))}
      <text x="60" y="56" textAnchor="middle" fill="var(--na-ink)" fontSize="13" fontWeight="800" fontFamily="Quicksand">
        {hov !== null ? `${Math.round((segments[hov].value / total) * 100)}%` : total}
      </text>
      <text x="60" y="70" textAnchor="middle" fill="var(--na-muted)" fontSize="9" fontFamily="Quicksand">
        {hov !== null ? segments[hov].label : "tổng"}
      </text>
    </svg>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color, sparkData, suffix = "", delay = 0 }) {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{
      background: "var(--na-card)", borderRadius: "1.25rem",
      boxShadow: "var(--shadow-soft)", padding: "22px 22px 18px",
      display: "flex", flexDirection: "column", gap: 10,
      position: "relative", overflow: "hidden",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      border: `1px solid ${color}22`
    }}>
      <div style={{
        position: "absolute", top: -24, right: -24, width: 100, height: 100,
        borderRadius: "50%", background: color, opacity: 0.09,
        filter: "blur(24px)", pointerEvents: "none"
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13,
          background: `${color}18`, border: `1.5px solid ${color}40`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
        }}>{icon}</div>
        <Sparkline data={sparkData || []} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 27, fontWeight: 800, color: "var(--na-ink)", letterSpacing: "-0.5px", lineHeight: 1.1, fontFamily: "Quicksand" }}>
          {vis ? <AnimCounter to={typeof value === "number" ? value : 0} suffix={suffix} /> : "0"}
        </div>
        <div style={{ fontSize: 12, color: "var(--na-muted)", marginTop: 3, fontWeight: 600 }}>{label}</div>
      </div>
      {sub && <div style={{ fontSize: 11, color: color, fontWeight: 700 }}>{sub}</div>}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--na-card)", borderRadius: "1.25rem",
      boxShadow: "var(--shadow-soft)", padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 16,
      border: "1px solid rgba(111,66,193,.1)", ...style
    }}>
      {children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState("overview")

  useEffect(() => {
    ;(async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setData(res.data)
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    })()
  }, [])

  const fmt = (v) => {
    if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
    return v?.toLocaleString("vi-VN") || "0"
  }

  if (loading) return (
    <div style={S.centerFull}>
      <div style={S.spinner} />
      <p style={{ color: "var(--na-muted)", fontSize: 13, letterSpacing: 2, marginTop: 16 }}>ĐANG TẢI...</p>
    </div>
  )

  if (error) return (
    <div style={S.centerFull}>
      <div style={{ background: "#fff0f0", border: "1px solid #f5c6cb", borderRadius: 16, padding: 28, color: "#842029", maxWidth: 400, textAlign: "center" }}>
        ⚠ {error}
      </div>
    </div>
  )

  const sparkRev = data.revenueByDate?.slice(-10).map(d => d.revenue) || []
  const sparkOrd = sparkRev.map(v => v / 1e5)
  const donutSegs = data.topKeywords?.map(k => ({ label: k.keyword, value: k.count })) || []
  const tabs = [
    { key: "overview",  label: "Tổng quan" },
    { key: "revenue",   label: "Doanh thu" },
    { key: "products",  label: "Sản phẩm" },
    { key: "keywords",  label: "Tìm kiếm" },
  ]
  const show = (k) => tab === "overview" || tab === k

  return (
    <div style={S.root}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      {/* ── Main ── */}
      <main style={S.main}>
        {/* Header */}
        <header style={S.header}>
          <div>
            <h1 style={S.heading}>Dashboard</h1>
            <p style={{ color: "var(--na-muted)", fontSize: 12, margin: 0 }}>
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={S.liveBadge}>● Live</span>
            <button style={S.btnOutline} onClick={() => window.location.reload()}>↻ Làm mới</button>
          </div>
        </header>

        {/* Tabs */}
        <div style={S.tabBar}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ ...S.tabBtn, ...(tab === t.key ? S.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* KPI cards */}
        {show("revenue") && (
          <div style={S.grid4}>
            <KpiCard icon="₫" label="Tổng doanh thu" value={data.overview.revenue}
              suffix=" ₫" color="#6f42c1" sparkData={sparkRev} delay={0}
              sub={`~${fmt(sparkRev.at(-1) || 0)} ngày gần nhất`} />
            <KpiCard icon="📦" label="Tổng đơn hàng" value={data.overview.orders}
              color="#5936a3" sparkData={sparkOrd} delay={80} sub="Tất cả trạng thái" />
            <KpiCard icon="👥" label="Khách hàng" value={data.overview.customers}
              color="#c9a227" sparkData={sparkOrd.map(v => v * 1.2)} delay={160} sub="Tài khoản đăng ký" />
            <KpiCard icon="🛍" label="Sản phẩm" value={data.overview.products}
              color="#8c5fe0" sparkData={sparkOrd.map(v => v * 0.8)} delay={240} sub="Đang kinh doanh" />
          </div>
        )}

        {/* Revenue chart + Donut */}
        {show("revenue") && (
          <div style={S.grid2}>
            <Card>
              <div style={S.cardHead}>
                <div>
                  <div style={S.cardTitle}>📈 Doanh thu 14 ngày gần nhất</div>
                  <div style={S.cardSub}>Đơn vị: VNĐ — hover để xem chi tiết</div>
                </div>
                <span style={S.pill}>{fmt(data.overview.revenue)} tổng</span>
              </div>
              <BarChart data={data.revenueByDate} />
            </Card>

            <Card>
              <div style={S.cardHead}>
                <div>
                  <div style={S.cardTitle}>🔍 Từ khoá tìm kiếm</div>
                  <div style={S.cardSub}>Phân bổ lượt tìm</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <DonutChart segments={donutSegs.length ? donutSegs : [{ label: "N/A", value: 1 }]} size={130} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                  {["#6f42c1","#b085f5","#8c5fe0","#c9a227","#5936a3"].map((c, i) => {
                    const k = data.topKeywords[i]; if (!k) return null
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 12, color: "var(--na-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.keyword}</span>
                        <span style={{ fontSize: 11, color: c, fontWeight: 800 }}>{k.count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Top products */}
        {show("products") && (
          <Card>
            <div style={S.cardHead}>
              <div>
                <div style={S.cardTitle}>🏆 Top sản phẩm bán chạy</div>
                <div style={S.cardSub}>5 sản phẩm có số lượng bán cao nhất</div>
              </div>
            </div>

            {/* <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 90px 130px", gap: 12, padding: "6px 12px", borderBottom: "2px solid var(--na-bg)" }}>
              {["#", "ID Sản phẩm", "Tên sản phẩm", "Đã bán", "Tỷ lệ"].map((h, i) => ( */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "50px 220px 1fr 90px 130px",
                gap: 12,
                padding: "6px 12px",
                borderBottom: "2px solid var(--na-bg)"
              }}>
                {["#", "Mã SP", "Tên sản phẩm", "Đã bán", "Tỷ lệ"].map((h, i) => (
                <div key={i} style={{ fontSize: 10, color: "var(--na-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
              ))}
            </div>

            {data.topProducts.map((p, i) => {
              const max = data.topProducts[0]?.totalSold || 1
              const pct = (p.totalSold / max) * 100
              const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"]
              return (
                <div key={p._id}
                  // style={{ display: "grid", gridTemplateColumns: "36px 1fr 90px 130px", gap: 12, padding: "13px 12px", borderRadius: 10, transition: "background 0.15s", cursor: "default" }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px 220px 1fr 90px 130px",
                    gap: 12,
                    padding: "13px 12px",
                    borderRadius: 10,
                    transition: "background 0.15s",
                    cursor: "default"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--na-bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 18 }}>{medals[i]}</div>
                  <div style={{ fontSize: 12, color: "var(--na-muted)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>{p._id}</div>
                  <div style={{
                    fontSize: 12,
                    color: "var(--na-ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {p.name || "Không có tên"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--na-ink)", display: "flex", alignItems: "center" }}>{p.totalSold.toLocaleString("vi-VN")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 99, background: "var(--na-bg)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, var(--na-primary), var(--na-accent))", borderRadius: 99, transition: "width 1.1s ease" }} />
                    </div>
                    <span style={{ fontSize: 10, color: "var(--na-muted)", minWidth: 32, textAlign: "right" }}>{Math.round(pct)}%</span>
                  </div>
                </div>
              )
            })}
          </Card>
        )}

        {/* Top keywords */}
        {show("keywords") && (
          <Card>
            <div style={S.cardHead}>
              <div>
                <div style={S.cardTitle}>💬 Từ khoá hot</div>
                <div style={S.cardSub}>Top từ khoá được tìm kiếm nhiều nhất</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {data.topKeywords.map((k, i) => {
                const colors = ["#6f42c1","#5936a3","#8c5fe0","#c9a227","#452783"]
                const isTop = i === 0
                return (
                  <div key={k._id} style={{
                    padding: "9px 20px", borderRadius: 99,
                    background: isTop ? "linear-gradient(135deg, var(--na-primary), var(--na-accent))" : "var(--na-bg)",
                    border: `1.5px solid ${colors[i]}${isTop ? "ff" : "55"}`,
                    color: isTop ? "#fff" : "var(--na-ink)",
                    fontSize: Math.max(14 - i * 1.5, 11), fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 8,
                    cursor: "default", transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: isTop ? "0 4px 14px rgba(111,66,193,.3)" : "none"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${colors[i]}40` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isTop ? "0 4px 14px rgba(111,66,193,.3)" : "none" }}>
                    {isTop && <span>🔥</span>}
                    <span>{k.keyword}</span>
                    <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 500 }}>{k.count} lượt</span>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&family=Aclonica&display=swap');
        :root {
          --na-primary: #6f42c1;
          --na-primary-2: #5936a3;
          --na-primary-3: #452783;
          --na-accent: #b085f5;
          --na-accent-strong: #8c5fe0;
          --na-ink: #2c1f4a;
          --na-muted: #7a6c9d;
          --na-bg: #f5f3fb;
          --na-card: #ffffff;
          --na-gold: #c9a227;
          --shadow-soft: 0 10px 30px rgba(111,66,193,.15);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--na-bg); }
        ::-webkit-scrollbar-thumb { background: var(--na-accent); border-radius: 99px; }
      `}</style>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: "100vh",
    background: "var(--na-bg)",
    display: "flex",
    fontFamily: "'Quicksand', Arial, sans-serif",
    color: "var(--na-ink)",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed", top: -180, left: -180, width: 520, height: 520,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(111,66,193,.18) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0
  },
  blob2: {
    position: "fixed", bottom: -200, right: -120, width: 460, height: 460,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(176,133,245,.15) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0
  },
  centerFull: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "var(--na-bg)", fontFamily: "'Quicksand', sans-serif"
  },
  spinner: {
    width: 40, height: 40, borderRadius: "50%",
    border: "3px solid rgba(111,66,193,.2)", borderTop: "3px solid var(--na-primary)",
    animation: "spin 0.8s linear infinite"
  },
  sidebar: {
    width: 220, flexShrink: 0,
    background: "#fff",
    borderRight: "1px solid rgba(111,66,193,.12)",
    boxShadow: "4px 0 24px rgba(111,66,193,.07)",
    display: "flex", flexDirection: "column", gap: 8,
    padding: "0 0 20px 0",
    position: "sticky", top: 0, height: "100vh", zIndex: 10
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "22px 20px 18px",
    borderBottom: "1px solid rgba(111,66,193,.1)",
    marginBottom: 10
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 11,
    background: "linear-gradient(135deg, var(--na-primary), var(--na-accent))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, color: "#fff", boxShadow: "0 4px 12px rgba(111,66,193,.35)"
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: "1.25rem",
    fontSize: 13, fontWeight: 700, color: "var(--na-muted)",
    cursor: "pointer", transition: "all 0.18s", userSelect: "none"
  },
  navActive: {
    background: "linear-gradient(90deg, rgba(111,66,193,.12), rgba(176,133,245,.06))",
    color: "var(--na-primary)",
    borderLeft: "3px solid var(--na-primary)",
    paddingLeft: 11,
  },
  main: {
    flex: 1, overflow: "auto",
    padding: "0 28px 48px 28px",
    display: "flex", flexDirection: "column", gap: 20,
    position: "relative", zIndex: 1
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "26px 0 4px",
    position: "sticky", top: 0,
    background: "linear-gradient(180deg, var(--na-bg) 65%, transparent)",
    zIndex: 5
  },
  heading: {
    fontSize: 28, fontWeight: 800, color: "var(--na-ink)",
    letterSpacing: "-0.4px", margin: 0, fontFamily: "'Quicksand', sans-serif"
  },
  liveBadge: {
    background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.4)",
    color: "#059669", fontSize: 11, fontWeight: 800,
    padding: "5px 12px", borderRadius: 99,
    animation: "pulse 2s ease-in-out infinite"
  },
  btnOutline: {
    background: "#fff", border: "1.5px solid rgba(111,66,193,.3)",
    color: "var(--na-primary)", fontSize: 12, fontWeight: 700,
    padding: "6px 14px", borderRadius: 10, cursor: "pointer",
    fontFamily: "'Quicksand', sans-serif",
    transition: "all 0.15s"
  },
  tabBar: {
    display: "flex", gap: 4,
    background: "#fff", border: "1px solid rgba(111,66,193,.15)",
    borderRadius: "1.25rem", padding: 4, width: "fit-content",
    boxShadow: "0 2px 12px rgba(111,66,193,.08)"
  },
  tabBtn: {
    padding: "7px 18px", borderRadius: "1rem", border: "none",
    background: "transparent", color: "var(--na-muted)", fontSize: 12,
    fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
    fontFamily: "'Quicksand', sans-serif"
  },
  tabActive: {
    background: "linear-gradient(135deg, var(--na-primary), var(--na-primary-2))",
    color: "#fff", boxShadow: "0 3px 12px rgba(111,66,193,.35)"
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: 16
  },
  grid2: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { fontSize: 15, fontWeight: 800, color: "var(--na-ink)" },
  cardSub: { fontSize: 11, color: "var(--na-muted)", marginTop: 2 },
  pill: {
    fontSize: 11, fontWeight: 800, color: "var(--na-primary)",
    background: "rgba(111,66,193,.1)", padding: "4px 12px", borderRadius: 99,
    border: "1px solid rgba(111,66,193,.2)"
  }
}