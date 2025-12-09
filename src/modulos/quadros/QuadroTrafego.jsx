import QuadroKanban from "./QuadroKanban";

export default function QuadroTrafego() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    aguardarRelatorio: {
      nome: "Aguardar data pra envio relatório",
      tipoCard: "normal",
    },
    aguardandoCliente: { nome: "Aguardando Diretoria", tipoCard: "compacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Tráfego Pago"
      turno="trafego"
      colunas={colunas}
    />
  );
}
