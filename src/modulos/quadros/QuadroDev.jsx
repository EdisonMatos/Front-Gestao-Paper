import QuadroKanban from "./QuadroKanban";

export default function QuadroDev() {
  const colunas = {
    backlog: "Backlog",
    pausadas: "Pausadas",
    urgentes: "Urgentes",
    emProgresso: "Em Progresso",
    emRevisao: "Em revisão",
  };

  return (
    <QuadroKanban
      titulo="Quadro Desenvolvimento"
      turno="dev"
      colunas={colunas}
    />
  );
}
