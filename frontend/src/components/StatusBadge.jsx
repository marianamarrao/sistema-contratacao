import { getStatusStyle } from "../utils/status";

function StatusBadge({ status }) {
  const statusStyle = getStatusStyle(status);

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: statusStyle.bg,
        color: statusStyle.color,
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
