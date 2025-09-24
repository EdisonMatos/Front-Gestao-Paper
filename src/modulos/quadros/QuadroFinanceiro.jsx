import QuadroKanban from "./QuadroKanban";

export default function QuadroFinanceiro() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    suspenso: { nome: "Suspensos", tipoCard: "compacto" },
    enviadoComercial: { nome: "Enviado pro Comercial", tipoCard: "compacto" },

    aguardandoClienteAss: {
      nome: "Aguardando Assinatura",
      tipoCard: "normal",
    },
    emAtrasoAss: { nome: "Em Atraso Assinatura", tipoCard: "normal" },
    aguardandoClienteAqui: {
      nome: "Aguardando Aquisição",
      tipoCard: "normal",
    },
    emAtrasoAqui: { nome: "Em Atraso Aquisição", tipoCard: "normal" },
    pagarComissao: { nome: "Fila de Pgto Comissão", tipoCard: "normal" },
    pgtoPendente: {
      nome: "Tem saldo a pagar",
      tipoCard: "normal",
    },
    pgtoNaConclusaoAtrasado: {
      nome: "Concluiu e não pagou ainda",
      tipoCard: "normal",
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
