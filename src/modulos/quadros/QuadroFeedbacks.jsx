import QuadroKanban from "./QuadroKanban";

export default function QuadroFeedbacks() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    finalizar: { nome: "Adicionar data conclusão", tipoCard: "superCompacto" },
    solicitado: { nome: "Solicitado", tipoCard: "superCompacto" },
    emMaos: { nome: "Recebidos, direcionar social", tipoCard: "superCompacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Feedbacks"
      turno="feedbacks"
      colunas={colunas}
    />
  );
}
