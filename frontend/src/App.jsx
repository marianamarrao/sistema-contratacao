import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Sidebar from "./components/Sidebar";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {activePage === "dashboard" ? <Dashboard /> : <Funcionarios />}
    </div>
  );
}

export default App;
