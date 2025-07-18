import QuadroKanban from "./QuadroKanban";

export default function QuadroWebmaster() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    aguardandoTerceiros: { nome: "Aguardando", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Webmaster"
      turno="webmaster"
      colunas={colunas}
    />
  );
}
