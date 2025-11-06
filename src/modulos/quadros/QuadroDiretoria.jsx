import QuadroKanban from "./QuadroKanban";

export default function QuadroDiretoria() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Diretoria"
      turno="diretoria"
      colunas={colunas}
    />
  );
}
