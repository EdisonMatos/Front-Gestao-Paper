import QuadroKanban from "./QuadroKanban";

export default function QuadroMarketing() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Marketing"
      turno="marketing"
      colunas={colunas}
    />
  );
}
