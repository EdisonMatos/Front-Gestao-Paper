import QuadroKanban from "./QuadroKanban";

export default function QuadroFeedbacks() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    solicitado: { nome: "Solicitado", tipoCard: "superCompacto" },
    emMaos: { nome: "Em mãos", tipoCard: "superCompacto" },
    postado: { nome: "Postado / Descartado", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Feedbacks"
      turno="feedbacks"
      colunas={colunas}
    />
  );
}
