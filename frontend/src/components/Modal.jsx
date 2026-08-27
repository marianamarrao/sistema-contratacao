import { X } from "lucide-react";

function Modal({ onClose, headerTone = "neutral", title, children, width = 480 }) {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div className="modal-card" style={{ maxWidth: width }}>
        <div className={`modal-header modal-header-${headerTone}`}>
          <h2 className={`modal-title modal-title-${headerTone}`}>{title}</h2>

          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
