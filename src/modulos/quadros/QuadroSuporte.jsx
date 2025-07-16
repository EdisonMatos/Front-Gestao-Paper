import QuadroKanban from "./QuadroKanban";

export default function QuadroSuporte() {
  const colunas = {
    backlog: "Backlog",
    pausadas: "Pausadas",
    urgentes: "Urgentes",
    emProgresso: "Em Progresso",
    concluido: "Concluído",
  };

  return (
    <QuadroKanban titulo="Quadro Suporte" turno="suporte" colunas={colunas} />
  );
}
