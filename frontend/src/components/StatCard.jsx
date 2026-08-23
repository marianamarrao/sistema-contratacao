function StatCard({ label, value, total, color, barColor }) {
    const porcentagem = total ? Math.round((value / total) * 100) : 0;
  
    return (
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-dot" style={{ backgroundColor: `#${color}` }} />
          <span className="stat-label">{label}</span>
        </div>
  
        <div className="stat-value" style={{ color: `#${color}` }}>
          {value}
        </div>
  
        <div className="stat-bar-track">
          <div
            className="stat-bar-fill"
            style={{
              width: `${porcentagem}%`,
              backgroundColor: `#${barColor}`,
            }}
          />
        </div>
  
        <div className="stat-percent">{porcentagem}% do total</div>
      </div>
    );
  }
  
  export default StatCard;