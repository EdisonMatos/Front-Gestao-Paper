import QuadroKanban from "./QuadroKanban";

export default function QuadroSocialMedia() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Social Media"
      turno="socialmedia"
      colunas={colunas}
    />
  );
}
