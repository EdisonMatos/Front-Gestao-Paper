import QuadroKanban from "./QuadroKanban";

export default function QuadroTrafego() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    emProgresso: { nome: "Em progresso", tipoCard: "normal" },
    aguardandoCliente: { nome: "Aguardando Cliente", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Tráfego Pago"
      turno="trafego"
      colunas={colunas}
    />
  );
}
