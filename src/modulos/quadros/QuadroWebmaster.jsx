import QuadroKanban from "./QuadroKanban";

export default function QuadroWebmaster() {
  const colunas = {
    backlog: "Backlog",
    pausadas: "Pausadas",
    urgentes: "Urgentes",
    emProgresso: "Em Progresso",
    concluido: "Concluído",
  };

  return (
    <QuadroKanban
      titulo="Quadro Webmaster"
      turno="webmaster"
      colunas={colunas}
    />
  );
}
