import QuadroKanban from "./QuadroKanban";

export default function QuadroComercial() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Comercial"
      turno="comercial"
      colunas={colunas}
    />
  );
}
