export const statusStyles = {
    Aprovado: {
      bg: "#DCFCE7",
      color: "#16A34A",
    },
  
    Reprovado: {
      bg: "#FEE2E2",
      color: "#DC2626",
    },
  
    Contratado: {
      bg: "#DBEAFE",
      color: "#2563EB",
    },
  
    "Em Análise": {
      bg: "#FEF9C3",
      color: "#A16207",
    },
};
  
export function getStatusStyle(status) {
    return statusStyles[status];
}