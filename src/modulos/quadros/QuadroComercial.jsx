import QuadroKanban from "./QuadroKanban";

export default function QuadroComercial() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
    finalizar: { nome: "Adicionar data conclusão", tipoCard: "superCompacto" },
    semFbFinalizar: {
      nome: "Sem feedback, finalizar",
      tipoCard: "superCompacto",
    },
  };

  return (
    <QuadroKanban
      titulo="Quadro Comercial"
      turno="comercial"
      colunas={colunas}
    />
  );
}
