import QuadroKanban from "./QuadroKanban";

export default function QuadroFinanceiro() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    // emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    enviadoComercial: { nome: "Enviado pro Comercial", tipoCard: "compacto" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
    pagarComissao: { nome: "Pagar comissão", tipoCard: "compacto" },
    comissaoPago: { nome: "Comissão paga", tipoCard: "compacto" },
    finalizar: { nome: "Adicionar data conclusão", tipoCard: "compacto" },
    semFbFinalizar: {
      nome: "Sem feedback, finalizar",
      tipoCard: "superCompacto",
    },
  };

  return (
    <QuadroKanban
      titulo="Quadro Financeiro"
      turno="financeiro"
      colunas={colunas}
    />
  );
}
