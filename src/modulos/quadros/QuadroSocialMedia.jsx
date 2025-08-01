import QuadroKanban from "./QuadroKanban";

export default function QuadroSocialMedia() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    postarFeedbacks: { nome: "Postar feedback", tipoCard: "compacto" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    postado: { nome: "Postado", tipoCard: "compacto" },
    semFbFinalizar: {
      nome: "Sem feedback, finalizar",
      tipoCard: "superCompacto",
    },
  };

  return (
    <QuadroKanban
      titulo="Quadro Social Media"
      turno="socialmedia"
      colunas={colunas}
    />
  );
}
