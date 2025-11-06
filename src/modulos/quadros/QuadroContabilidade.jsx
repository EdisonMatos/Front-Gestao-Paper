import QuadroKanban from "./QuadroKanban";

export default function QuadroContabilidade() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Contabilidade"
      turno="contabilidade"
      colunas={colunas}
    />
  );
}
