import QuadroKanban from "./QuadroKanban";

export default function QuadroFinanceiro() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    suspenso: { nome: "Suspensos", tipoCard: "compacto" },
    // emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    enviadoComercial: { nome: "Enviado pro Comercial", tipoCard: "compacto" },

    aguardandoClienteAss: {
      nome: "Aguardando Assinatura",
      tipoCard: "compacto",
    },
    emAtrasoAss: { nome: "Em Atraso Assinatura", tipoCard: "compacto" },
    aguardandoClienteAqui: {
      nome: "Aguardando Aquisição",
      tipoCard: "compacto",
    },
    emAtrasoAqui: { nome: "Em Atraso Aquisição", tipoCard: "compacto" },
    pagarComissao: { nome: "Fila de Pgto Comissão", tipoCard: "compacto" },
    pgtoPendente: {
      nome: "Pagamento Pendente",
      tipoCard: "compacto",
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
