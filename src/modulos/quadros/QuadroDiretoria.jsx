import QuadroKanban from "./QuadroKanban";

export default function QuadroDiretoria() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Diretoria"
      turno="diretoria"
      colunas={colunas}
    />
  );
}
