import React from "react";
import { ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getInitials } from "../utils/initials";

const candidatos = [
  {
    id: 1,
    nome: "Marcelo Modolo",
    cargo: "Desenvolvedor Backend",
    status: "Aprovado",
  },
  {
    id: 2,
    nome: "Myrna Yoshimoto",
    cargo: "Cientista de Dados",
    status: "Reprovado",
  },
  {
    id: 3,
    nome: "Marcelo Grilo",
    cargo: "Cientista de Dados",
    status: "Contratado",
  },
  {
    id: 4,
    nome: "Mariana",
    cargo: "Editora",
    status: "Em Análise",
  },
];

const statusConfig = [
  { label: "Reprovado", color: "FF383C" },
  { label: "Em Análise", color: "EDD661" },
  { label: "Aprovado", color: "169A47" },
  { label: "Contratado", color: "61ACED" },
];

const departamentos = [
  { nome: "Tecnologia", valor: 3 },
  { nome: "Infraestrutura", valor: 3 },
  { nome: "Compliance", valor: 3 },
  { nome: "Outro", valor: 3 },
];

function Dashboard() {
  const totalCandidatos = candidatos.length;

  const stats = statusConfig.map((status) => {
    const quantidade = candidatos.filter(
      (candidato) => candidato.status === status.label
    ).length;

    return {
      label: status.label,
      value: quantidade,
      color: status.color,
      barColor: status.color,
    };
  });

  const maxDepartamento = Math.max(
    ...departamentos.map((departamento) => departamento.valor)
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="breadcrumb">PicPay – Sistema de Contratação</div>
        <h1 className="page-title">Dashboard</h1>

        <div className="banner">
          <div>
            <h2 className="banner-title">Painel de Candidatos</h2>
            <p className="banner-subtitle">
              Gerencie todo o processo seletivo.
            </p>
          </div>

          <div>
            <div className="banner-count">{totalCandidatos}</div>
            <div className="banner-count-label">
              candidatos cadastrados
            </div>
          </div>
        </div>

        <div className="stat-cards">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              barColor={stat.barColor}
              total={totalCandidatos}
            />
          ))}
        </div>

        <div className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Últimos Candidatos</h3>

              <button className="panel-link">
                Ver todos
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="candidate-list">
              {candidatos.map((candidato) => (
                <div key={candidato.id} className="candidate-row">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {getInitials(candidato.nome)}
                    </div>

                    <div>
                      <div className="candidate-name">
                        {candidato.nome}
                      </div>
                      <div className="candidate-role">
                        {candidato.cargo}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={candidato.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Distribuição por Departamento</h3>

            <div className="dept-list">
              {departamentos.map((departamento) => (
                <div key={departamento.nome}>
                  <div className="dept-row-header">
                    <span className="dept-name">
                      {departamento.nome}
                    </span>
                    <span className="dept-value">
                      {departamento.valor}
                    </span>
                  </div>

                  <div className="dept-bar-track">
                    <div
                      className="dept-bar-fill"
                      style={{
                        width: `${
                          (departamento.valor / maxDepartamento) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;