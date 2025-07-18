import QuadroKanban from "./QuadroKanban";

export default function QuadroWebmaster() {
  const colunas = {
    backlog: { nome: "Backlog", tipoCard: "normal" },
    comprarDominio: { nome: "Comprar Domínio", tipoCard: "normal" },
    apontarDns: { nome: "Apontar DNS", tipoCard: "normal" },
    criarEmailBlog: { nome: "Criar Email Blog", tipoCard: "normal" },
    deploy: { nome: "Deploy", tipoCard: "normal" },
    aguardandoTerceiros: { nome: "Aguardando", tipoCard: "superCompacto" },
  };

  return (
    <QuadroKanban
      titulo="Quadro Webmaster"
      turno="webmaster"
      colunas={colunas}
    />
  );
}
