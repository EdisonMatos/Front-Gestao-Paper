import QuadroKanban from "./QuadroKanban";

export default function QuadroDiretoria() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    finalizar: { nome: "Adicionar data conclusão", tipoCard: "superCompacto" },
    semFbFinalizar: {
      nome: "Sem feedback, finalizar",
      tipoCard: "superCompacto",
    },
  };

  return (
    <QuadroKanban
      titulo="Quadro Diretoria"
      turno="diretoria"
      colunas={colunas}
    />
  );
}
