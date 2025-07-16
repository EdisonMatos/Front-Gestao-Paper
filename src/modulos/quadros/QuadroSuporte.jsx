import QuadroKanban from "./QuadroKanban";

export default function QuadroSuporte() {
  const colunas = {
    backlog: "Backlog",
    emAtendimento: "Em Atendimento",
    infoColetadas: "Info Coletadas",
    gerandoDoc: "Gerando Doc",
    revisar: "Revisar",
    concluido: "Concluído",
  };

  return (
    <QuadroKanban titulo="Quadro Suporte" turno="suporte" colunas={colunas} />
  );
}
