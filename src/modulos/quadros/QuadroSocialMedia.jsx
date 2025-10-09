import QuadroKanban from "./QuadroKanban";

export default function QuadroSocialMedia() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    postarFeedbacks: { nome: "Postar feedback", tipoCard: "compacto" },
    postadoFinalizar: { nome: "Postado, finalizar", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Social Media"
      turno="socialmedia"
      colunas={colunas}
    />
  );
}
