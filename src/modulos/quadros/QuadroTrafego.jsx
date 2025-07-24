import QuadroKanban from "./QuadroKanban";

export default function QuadroTrafego() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Tráfego Pago"
      turno="trafego"
      colunas={colunas}
    />
  );
}
