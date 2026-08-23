import { Home, Users, Plus } from "lucide-react";

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <button className={`sidebar-item ${active ? "active" : ""}`}>
      <Icon size={18} strokeWidth={2} />
      {label}
    </button>
  );
}

function Sidebar() {
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
        <SidebarItem icon={Home} label="Dashboard" active />
        <SidebarItem icon={Users} label="Funcionários" />
        <SidebarItem icon={Plus} label="Novo candidato" />
      </nav>
    </aside>
  );
}

export default Sidebar;
