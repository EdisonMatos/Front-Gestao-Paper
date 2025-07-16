import QuadroKanban from "./QuadroKanban";

export default function QuadroFeedbacks() {
  const colunas = {
    backlog: "Backlog",
    solicitado: "Solicitado",
    emMaos: "Em mãos",
    postado: "Postado",
    concluido: "Concluído",
  };

  return (
    <QuadroKanban
      titulo="Quadro Feedbacks"
      turno="feedbacks"
      colunas={colunas}
    />
  );
}
