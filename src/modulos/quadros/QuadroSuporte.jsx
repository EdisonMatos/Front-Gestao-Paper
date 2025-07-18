import QuadroKanban from "./QuadroKanban";

export default function QuadroSuporte() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emAtendimento: { nome: "Em Atendimento", tipoCard: "normal" },
    infoColetadas: { nome: "Info Coletadas", tipoCard: "normal" },
    gerandoDoc: { nome: "Gerando Doc", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
    revisar: { nome: "Revisar", tipoCard: "superCompacto" },
  };

  return (
    <QuadroKanban titulo="Quadro Suporte" turno="suporte" colunas={colunas} />
  );
}
