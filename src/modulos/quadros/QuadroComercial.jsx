import QuadroKanban from "./QuadroKanban";

export default function QuadroComercial() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Comercial"
      turno="comercial"
      colunas={colunas}
    />
  );
}
