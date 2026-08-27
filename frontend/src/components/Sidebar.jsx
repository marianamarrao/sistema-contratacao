import { Home, Users } from "lucide-react";

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </button>
  );
}

function Sidebar({ activePage = "dashboard", onNavigate = () => {} }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">P</div>

        <div>
          <div className="sidebar-brand-name">PicPay - RH</div>
          <div className="sidebar-brand-sub">Contratação</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          active={activePage === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        <SidebarItem
          icon={Users}
          label="Funcionários"
          active={activePage === "funcionarios"}
          onClick={() => onNavigate("funcionarios")}
        />
      </nav>
    </aside>
  );
}

export default Sidebar;
