import QuadroKanban from "./QuadroKanban";

export default function QuadroDev() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em Progresso", tipoCard: "normal" },
    emRevisao: { nome: "Em revisão", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Desenvolvimento"
      turno="dev"
      colunas={colunas}
    />
  );
}
