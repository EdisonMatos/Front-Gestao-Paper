import QuadroKanban from "./QuadroKanban";

export default function QuadroFinanceiro() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    // emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    enviadoComercial: { nome: "Enviado pro Comercial", tipoCard: "compacto" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
    pagarComissao: { nome: "Fila de Pgto Comissão", tipoCard: "compacto" },
    suspenso: { nome: "Suspensos", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Financeiro"
      turno="financeiro"
      colunas={colunas}
    />
  );
}
