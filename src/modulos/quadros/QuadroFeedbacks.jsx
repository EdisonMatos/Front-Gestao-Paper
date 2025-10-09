import QuadroKanban from "./QuadroKanban";

export default function QuadroFeedbacks() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    semNecessidadeFeedbackFinalizar: {
      nome: "Não pedir fb, finalizar",
      tipoCard: "normal",
    },
    //  finalizar: { nome: "Adicionar data conclusão", tipoCard: "superCompacto" },
    solicitado: {
      nome: "Solicitado e data conclusão",
      tipoCard: "compacto",
    },
    emMaos: { nome: "Recebidos, direcionar social", tipoCard: "superCompacto" },
    naoRecebidoFinalizar: {
      nome: "Não recebido ou ignorado, finalizar",
      tipoCard: "superCompacto",
    },
  };

  return (
    <QuadroKanban
      titulo="Quadro Feedbacks"
      turno="feedbacks"
      colunas={colunas}
    />
  );
}
