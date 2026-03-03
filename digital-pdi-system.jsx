import { useState } from "react";

const initialPDIs = [
  { id: "12345", product: "AKAT Gate", category: "Gates", date: "2025-08-03", inspector: "John Doe", status: "Pending" },
  { id: "12346", product: "BHEL Valve", category: "Valves", date: "2025-08-04", inspector: "Jane Smith", status: "Submitted" },
  { id: "12347", product: "L&T Transformer", category: "Transformers", date: "2025-08-05", inspector: "Mike Johnson", status: "Reviewed" },
  { id: "12348", product: "Siemens Switch", category: "Switches", date: "2025-08-06", inspector: "Sarah Wilson", status: "Pending" },
  { id: "12349", product: "ABB Circuit Breaker", category: "Circuit Breakers", date: "2025-08-07", inspector: "Tom Brown", status: "Pending" },
];

const bugReports = [
  { id: "BUG-001", title: "Status not updating after submission", severity: "High", reporter: "Jane Smith", date: "2025-08-02", status: "Open" },
  { id: "BUG-002", title: "Date filter not working correctly", severity: "Medium", reporter: "John Doe", date: "2025-08-03", status: "In Progress" },
  { id: "BUG-003", title: "PDF export missing inspector name", severity: "Low", reporter: "Mike Johnson", date: "2025-08-04", status: "Resolved" },
];

const statusColors = {
  Pending: { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  Submitted: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  Reviewed: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  Completed: { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
};

const severityColors = {
  High: { bg: "#FEF2F2", text: "#DC2626", dot: "#EF4444" },
  Medium: { bg: "#FFFBEB", text: "#D97706", dot: "#F59E0B" },
  Low: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
};

const bugStatusColors = {
  Open: { bg: "#FEF2F2", text: "#DC2626" },
  "In Progress": { bg: "#FFF7ED", text: "#C2410C" },
  Resolved: { bg: "#F0FDF4", text: "#15803D" },
};

const dashboardStats = [
  { label: "Total PDIs", value: 5, icon: "📋", color: "#3B82F6" },
  { label: "Pending", value: 3, icon: "⏳", color: "#F97316" },
  { label: "Submitted", value: 1, icon: "📤", color: "#3B82F6" },
  { label: "Reviewed", value: 1, icon: "✅", color: "#22C55E" },
];

function Badge({ status, colorMap }) {
  const c = colorMap[status] || { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot || c.text, display: "inline-block" }} />
      {status}
    </span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("pdi");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [pdis, setPdis] = useState(initialPDIs);
  const [selectedPDI, setSelectedPDI] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = pdis.filter(p => {
    const matchSearch = p.product.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search) || p.inspector.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleSelect(pdi) {
    if (pdi.status === "Reviewed") return;
    setSelectedPDI(pdi);
    setShowModal(true);
  }

  function handleSubmitInspection() {
    setPdis(prev => prev.map(p =>
      p.id === selectedPDI.id ? { ...p, status: "Submitted" } : p
    ));
    setShowModal(false);
    setSelectedPDI(null);
  }

  const tabs = [
    { id: "pdi", label: "PDI Management", icon: "🔍" },
    { id: "bugs", label: "Bug Tracker", icon: "🐛" },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1E293B", color: "white", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>Digital PDI System</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>Pre-Dispatch Inspection Management</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#334155", borderRadius: 8, padding: "7px 14px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>I</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Inspector</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Field Agent</div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "10px 18px", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
                background: "transparent",
                color: activeTab === tab.id ? "#3B82F6" : "#94A3B8",
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: 14, display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s"
              }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>

        {/* PDI Management Tab */}
        {activeTab === "pdi" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: 0 }}>PDI Selection & Filters</h2>
              <p style={{ color: "#64748B", fontSize: 14, margin: "4px 0 0" }}>Search and filter PDIs to begin inspection process</p>
            </div>

            {/* Search + Filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 16 }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by PDI ID, product, or inspector..."
                  style={{
                    width: "100%", padding: "10px 12px 10px 38px", border: "1px solid #E2E8F0",
                    borderRadius: 8, fontSize: 14, background: "white", outline: "none", boxSizing: "border-box",
                    color: "#1E293B"
                  }}
                />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
                padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
                fontSize: 14, background: "white", color: "#1E293B", outline: "none", cursor: "pointer"
              }}>
                <option>All</option>
                <option>Pending</option>
                <option>Submitted</option>
                <option>Reviewed</option>
                <option>Completed</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1E293B" }}>Available PDIs</h3>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: "#94A3B8" }}>Select a PDI to begin the inspection process</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["PDI ID", "Product Name", "Category", "Date", "Inspector", "Status", "Action"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pdi, i) => (
                    <tr key={pdi.id} style={{ borderTop: "1px solid #F1F5F9", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600, color: "#3B82F6" }}>{pdi.id}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#1E293B", fontWeight: 500 }}>{pdi.product}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#64748B" }}>{pdi.category}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#64748B" }}>{pdi.date}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#64748B" }}>{pdi.inspector}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <Badge status={pdi.status} colorMap={statusColors} />
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        {pdi.status === "Reviewed" ? (
                          <span style={{ fontSize: 13, color: "#94A3B8", fontStyle: "italic" }}>Completed</span>
                        ) : (
                          <button onClick={() => handleSelect(pdi)} style={{
                            padding: "6px 16px", background: "#3B82F6", color: "white",
                            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600
                          }}>Select</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No PDIs match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bug Tracker Tab */}
        {activeTab === "bugs" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: 0 }}>Bug Tracker</h2>
              <p style={{ color: "#64748B", fontSize: 14, margin: "4px 0 0" }}>Track and manage system issues and bug reports</p>
            </div>
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Bug ID", "Title", "Severity", "Reporter", "Date", "Status"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bugReports.map((bug, i) => (
                    <tr key={bug.id} style={{ borderTop: "1px solid #F1F5F9", background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600, color: "#3B82F6" }}>{bug.id}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#1E293B", fontWeight: 500 }}>{bug.title}</td>
                      <td style={{ padding: "13px 16px" }}><Badge status={bug.severity} colorMap={severityColors} /></td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#64748B" }}>{bug.reporter}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#64748B" }}>{bug.date}</td>
                      <td style={{ padding: "13px 16px" }}><Badge status={bug.status} colorMap={bugStatusColors} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: 0 }}>Dashboard</h2>
              <p style={{ color: "#64748B", fontSize: 14, margin: "4px 0 0" }}>Overview of PDI inspection activity</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {dashboardStats.map(stat => (
                <div key={stat.label} style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>{stat.label}</div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{stat.value}</div>
                    </div>
                    <div style={{ fontSize: 26 }}>{stat.icon}</div>
                  </div>
                  <div style={{ height: 4, background: "#F1F5F9", borderRadius: 2, marginTop: 12 }}>
                    <div style={{ height: "100%", width: `${(stat.value / 5) * 100}%`, background: stat.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#1E293B" }}>PDI Status Distribution</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Pending", count: pdis.filter(p => p.status === "Pending").length, color: "#F97316" },
                  { label: "Submitted", count: pdis.filter(p => p.status === "Submitted").length, color: "#3B82F6" },
                  { label: "Reviewed", count: pdis.filter(p => p.status === "Reviewed").length, color: "#22C55E" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 90, fontSize: 13, color: "#64748B" }}>{row.label}</div>
                    <div style={{ flex: 1, height: 10, background: "#F1F5F9", borderRadius: 5 }}>
                      <div style={{ height: "100%", width: `${(row.count / pdis.length) * 100}%`, background: row.color, borderRadius: 5, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ width: 20, fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{row.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPDI && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#1E293B" }}>Begin Inspection</h2>
            <p style={{ margin: "0 0 24px", color: "#64748B", fontSize: 14 }}>You are about to start the inspection for:</p>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 18px", marginBottom: 24 }}>
              {[
                ["PDI ID", selectedPDI.id],
                ["Product", selectedPDI.product],
                ["Category", selectedPDI.category],
                ["Inspector", selectedPDI.inspector],
                ["Date", selectedPDI.date],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
                  <span style={{ color: "#64748B" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "#1E293B" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "10px 0", border: "1px solid #E2E8F0", borderRadius: 8,
                background: "white", color: "#64748B", cursor: "pointer", fontSize: 14, fontWeight: 600
              }}>Cancel</button>
              <button onClick={handleSubmitInspection} style={{
                flex: 1, padding: "10px 0", border: "none", borderRadius: 8,
                background: "#3B82F6", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600
              }}>Submit Inspection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
