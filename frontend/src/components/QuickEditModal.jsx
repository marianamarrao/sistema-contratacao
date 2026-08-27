import { useState } from "react";
import Modal from "./Modal";

const STATUS_OPTIONS = ["Em Análise", "Aprovado", "Reprovado", "Contratado"];

function QuickEditModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState({
    cargo: initialData?.cargo ?? "",
    departamento: initialData?.departamento ?? "",
    status: initialData?.status ?? "Em Análise",
    salario: initialData?.salario ?? "",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      salario: Number(form.salario) || 0,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} headerTone="blue" title="Editar Funcionário Parcialmente" width={420}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid form-grid-single">
          <div className="form-group">
            <label className="form-label" htmlFor="q-cargo">
              Cargo
            </label>
            <input
              id="q-cargo"
              className="form-input"
              value={form.cargo}
              onChange={handleChange("cargo")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="q-departamento">
              Departamento
            </label>
            <input
              id="q-departamento"
              className="form-input"
              value={form.departamento}
              onChange={handleChange("departamento")}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="q-status">
              Status
            </label>
            <select
              id="q-status"
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

          <div className="form-group">
            <label className="form-label" htmlFor="q-salario">
              Salário(R$)
            </label>
            <input
              id="q-salario"
              type="number"
              min="0"
              className="form-input"
              value={form.salario}
              onChange={handleChange("salario")}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-blue">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default QuickEditModal;
