import { TriangleAlert } from "lucide-react";
import Modal from "./Modal";

function ConfirmDeleteModal({ nome, onClose, onConfirm }) {
  return (
    <Modal onClose={onClose} headerTone="red" title="Excluir Funcionário" width={420}>
      <div className="confirm-body">
        <TriangleAlert size={20} className="confirm-icon" />
        <p className="confirm-text">
          Tem certeza que deseja excluir <strong>{nome}</strong>? Esta ação não pode ser
          desfeita.
        </p>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Excluir
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
