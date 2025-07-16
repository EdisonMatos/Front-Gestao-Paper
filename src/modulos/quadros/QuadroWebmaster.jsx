import QuadroKanban from "./QuadroKanban";

export default function QuadroWebmaster() {
  const colunas = {
    backlog: "Backlog",
    comprarDominio: "Comprar Domínio",
    apontarDns: "Apontar DNS",
    criarEmailBlog: "Criar Email Blog",
    deploy: "Deploy",
    concluido: "Concluído",
  };

  return (
    <QuadroKanban
      titulo="Quadro Webmaster"
      turno="webmaster"
      colunas={colunas}
    />
  );
}
