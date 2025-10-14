import QuadroKanban from "./QuadroKanban";

export default function QuadroSuporte() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emAtendimento: { nome: "Em Atendimento", tipoCard: "compacto" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
    resgate: { nome: "Resgates", tipoCard: "normal" },
    ausentes: { nome: "Ausentes", tipoCard: "superCompacto" },
  };

  return (
    <QuadroKanban titulo="Quadro Suporte" turno="suporte" colunas={colunas} />
  );
}
