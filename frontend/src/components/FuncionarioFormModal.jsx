import { useState } from "react";
import Modal from "./Modal";

const STATUS_OPTIONS = ["Em Análise", "Aprovado", "Reprovado", "Contratado"];

const emptyForm = {
  nome: "",
  email: "",
  cargo: "",
  departamento: "",
  telefone: "",
  cidade: "",
  salario: "",
  status: "Em Análise",
};

function FuncionarioFormModal({ mode = "create", initialData, onClose, onSubmit }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialData }));

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const isValid = form.nome.trim() && form.email.trim() && form.cargo.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    onSubmit({
      ...form,
      salario: Number(form.salario) || 0,
    });
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      headerTone={isEdit ? "blue" : "green"}
      title={isEdit ? "Editar Funcionário" : "Cadastrar Funcionário"}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="nome">
              Nome *
            </label>
            <input
              id="nome"
              className="form-input"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange("nome")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cargo">
              Cargo *
            </label>
            <input
              id="cargo"
              className="form-input"
              placeholder="Ex: Engenheiro de Software"
              value={form.cargo}
              onChange={handleChange("cargo")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="departamento">
              Departamento
            </label>
            <input
              id="departamento"
              className="form-input"
              placeholder="Ex: Tecnologia"
              value={form.departamento}
              onChange={handleChange("departamento")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="telefone">
              Telefone
            </label>
            <input
              id="telefone"
              className="form-input"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange("telefone")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cidade">
              Cidade
            </label>
            <input
              id="cidade"
              className="form-input"
              placeholder="Ex: São Paulo"
              value={form.cidade}
              onChange={handleChange("cidade")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="salario">
              Salário(R$)
            </label>
            <input
              id="salario"
              type="number"
              min="0"
              className="form-input"
              placeholder="0"
              value={form.salario}
              onChange={handleChange("salario")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="form-input form-select"
              value={form.status}
              onChange={handleChange("status")}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={`btn ${isEdit ? "btn-blue" : "btn-primary"}`} disabled={!isValid}>
            {isEdit ? "Salvar" : "Cadastrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FuncionarioFormModal;
