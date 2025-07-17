import QuadroKanban from "./QuadroKanban";

export default function QuadroFeedbacks() {
  const colunas = {
    backlog: "Backlog",
    solicitado: "Solicitado",
    emMaos: "Em mãos",
    postado: "Postado",
    finalizado: "Finalizado",
  };

  return (
    <QuadroKanban
      titulo="Quadro Feedbacks"
      turno="feedbacks"
      colunas={colunas}
    />
  );
}
