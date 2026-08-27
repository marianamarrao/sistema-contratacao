import { useMemo, useState } from "react";
import { Search, Plus, Pencil, SquarePen, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import FuncionarioFormModal from "../components/FuncionarioFormModal";
import QuickEditModal from "../components/QuickEditModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getInitials } from "../utils/initials";

const AVATAR_PALETTE = [
  { bg: "#DCFCE7", color: "#16A34A" },
  { bg: "#FEF9C3", color: "#A16207" },
  { bg: "#FCE7F3", color: "#DB2777" },
  { bg: "#DBEAFE", color: "#2563EB" },
];

const INITIAL_FUNCIONARIOS = [
  {
    id: 1,
    nome: "Marcelo Modolo",
    email: "marcelo.modolo@aura.com.br",
    cargo: "Engenheiro DevOps",
    departamento: "Infraestrutura",
    telefone: "(11) 98765-4321",
    cidade: "São Paulo",
    salario: 15000,
    status: "Aprovado",
  },
  {
    id: 2,
    nome: "Myrna Yoshimoto",
    email: "myrna.yoshimoto@aura.com.br",
    cargo: "Engenheira DevOps",
    departamento: "Infraestrutura",
    telefone: "(11) 98765-4322",
    cidade: "São Paulo",
    salario: 15000,
    status: "Reprovado",
  },
  {
    id: 3,
    nome: "Marcelo Grilo",
    email: "marcelo.grilo@aura.com.br",
    cargo: "Engenheiro de Software",
    departamento: "Tecnologia",
    telefone: "11 965810-2222",
    cidade: "São Paulo",
    salario: 22222,
    status: "Contratado",
  },
  {
    id: 4,
    nome: "Mariana Alves",
    email: "mariana.alves@aura.com.br",
    cargo: "Editora",
    departamento: "Compliance",
    telefone: "(11) 98765-4324",
    cidade: "São Paulo",
    salario: 8500,
    status: "Em Análise",
  },
  {
    id: 5,
    nome: "Marcos Prado",
    email: "marcos.prado@aura.com.br",
    cargo: "Engenheiro DevOps",
    departamento: "Infraestrutura",
    telefone: "(11) 98765-4325",
    cidade: "São Paulo",
    salario: 15000,
    status: "Aprovado",
  },
];

const STATUS_FILTERS = ["Todos os status", "Em Análise", "Aprovado", "Reprovado", "Contratado"];
const PAGE_SIZE = 5;

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState(INITIAL_FUNCIONARIOS);
  const [busca, setBusca] = useState("");
  const [buscaId, setBuscaId] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos os status");
  const [departamentoFiltro, setDepartamentoFiltro] = useState("Todos os departamentos");
  const [page, setPage] = useState(1);

  const [modalAberto, setModalAberto] = useState(null); // "cadastrar" | "editar" | "editarParcial" | "excluir"
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  const departamentos = useMemo(() => {
    const unicos = new Set(funcionarios.map((f) => f.departamento).filter(Boolean));
    return ["Todos os departamentos", ...unicos];
  }, [funcionarios]);

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter((f) => {
      const termo = busca.trim().toLowerCase();
      const combinaTermo =
        !termo ||
        f.nome.toLowerCase().includes(termo) ||
        f.cargo.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo);

      const combinaId = !buscaId.trim() || String(f.id) === buscaId.trim();
      const combinaStatus = statusFiltro === "Todos os status" || f.status === statusFiltro;
      const combinaDepartamento =
        departamentoFiltro === "Todos os departamentos" || f.departamento === departamentoFiltro;

      return combinaTermo && combinaId && combinaStatus && combinaDepartamento;
    });
  }, [funcionarios, busca, buscaId, statusFiltro, departamentoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(funcionariosFiltrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(page, totalPaginas);
  const funcionariosPagina = funcionariosFiltrados.slice(
    (paginaAtual - 1) * PAGE_SIZE,
    paginaAtual * PAGE_SIZE
  );

  const abrirCadastrar = () => {
    setFuncionarioSelecionado(null);
    setModalAberto("cadastrar");
  };

  const abrirEditar = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalAberto("editar");
  };

  const abrirEditarParcial = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalAberto("editarParcial");
  };

  const abrirExcluir = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalAberto("excluir");
  };

  const fecharModal = () => {
    setModalAberto(null);
    setFuncionarioSelecionado(null);
  };

  const handleCadastrar = (dados) => {
    setFuncionarios((prev) => [
      ...prev,
      { ...dados, id: Math.max(0, ...prev.map((f) => f.id)) + 1 },
    ]);
  };

  const handleSalvarEdicao = (dados) => {
    setFuncionarios((prev) =>
      prev.map((f) => (f.id === funcionarioSelecionado.id ? { ...f, ...dados } : f))
    );
  };

  const handleSalvarParcial = (dados) => {
    setFuncionarios((prev) =>
      prev.map((f) => (f.id === funcionarioSelecionado.id ? { ...f, ...dados } : f))
    );
  };

  const handleExcluir = () => {
    setFuncionarios((prev) => prev.filter((f) => f.id !== funcionarioSelecionado.id));
  };

  return (
    <main className="main-content">
      <div className="breadcrumb">PicPay – Sitema de Contratação</div>
      <h1 className="page-title">Funcionários</h1>

      <div className="funcionarios-toolbar">
        <div className="search-input">
          <Search size={16} className="search-icon" />
          <input
            placeholder="Buscar por nome, cargo ou email"
            value={busca}
            onChange={(event) => {
              setBusca(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="filter-select"
          value={statusFiltro}
          onChange={(event) => {
            setStatusFiltro(event.target.value);
            setPage(1);
          }}
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={departamentoFiltro}
          onChange={(event) => {
            setDepartamentoFiltro(event.target.value);
            setPage(1);
          }}
        >
          {departamentos.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <input
          className="filter-id-input"
          placeholder="ID: Ex: 1"
          value={buscaId}
          onChange={(event) => {
            setBuscaId(event.target.value);
            setPage(1);
          }}
        />

        <button type="button" className="btn btn-primary btn-new" onClick={abrirCadastrar}>
          <Plus size={16} />
          Novo Funcionário
        </button>
      </div>

      <div className="panel funcionarios-panel">
        <table className="funcionarios-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Cargo/Departamento</th>
              <th>Contato</th>
              <th>Cidade</th>
              <th>Salário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {funcionariosPagina.map((funcionario, index) => {
              const avatar = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

              return (
                <tr key={funcionario.id}>
                  <td>
                    <div className="candidate-info">
                      <div
                        className="candidate-avatar"
                        style={{ background: avatar.bg, color: avatar.color }}
                      >
                        {getInitials(funcionario.nome)}
                      </div>

                      <div>
                        <div className="candidate-name">{funcionario.nome}</div>
                        <div className="candidate-role">ID #{funcionario.id}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="table-primary-text">{funcionario.cargo}</div>
                    <div className="table-secondary-text">{funcionario.departamento}</div>
                  </td>

                  <td>
                    <div className="table-link-text">{funcionario.email}</div>
                    <div className="table-secondary-text">{funcionario.telefone}</div>
                  </td>

                  <td className="table-primary-text">{funcionario.cidade}</td>

                  <td className="table-primary-text">
                    {funcionario.salario.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      maximumFractionDigits: 0,
                    })}
                  </td>

                  <td>
                    <StatusBadge status={funcionario.status} />
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        title="Editar funcionário"
                        onClick={() => abrirEditar(funcionario)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        className="icon-btn"
                        title="Editar parcialmente"
                        onClick={() => abrirEditarParcial(funcionario)}
                      >
                        <SquarePen size={15} />
                      </button>

                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        title="Excluir funcionário"
                        onClick={() => abrirExcluir(funcionario)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {funcionariosPagina.length === 0 && (
              <tr>
                <td colSpan={7} className="table-empty">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-label">
          Página {paginaAtual} de {totalPaginas}
        </span>

        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn"
            disabled={paginaAtual === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          <span className="pagination-current">{paginaAtual}</span>

          <button
            type="button"
            className="pagination-btn"
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {modalAberto === "cadastrar" && (
        <FuncionarioFormModal mode="create" onClose={fecharModal} onSubmit={handleCadastrar} />
      )}

      {modalAberto === "editar" && funcionarioSelecionado && (
        <FuncionarioFormModal
          mode="edit"
          initialData={funcionarioSelecionado}
          onClose={fecharModal}
          onSubmit={handleSalvarEdicao}
        />
      )}

      {modalAberto === "editarParcial" && funcionarioSelecionado && (
        <QuickEditModal
          initialData={funcionarioSelecionado}
          onClose={fecharModal}
          onSubmit={handleSalvarParcial}
        />
      )}

      {modalAberto === "excluir" && funcionarioSelecionado && (
        <ConfirmDeleteModal
          nome={funcionarioSelecionado.nome}
          onClose={fecharModal}
          onConfirm={handleExcluir}
        />
      )}
    </main>
  );
}

export default Funcionarios;
