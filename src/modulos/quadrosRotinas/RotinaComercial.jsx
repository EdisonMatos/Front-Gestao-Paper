// components/RotinaSuporte.jsx
import QuadroKanbanRotinas from "./QuadroKanbanRotinas";

export default function RotinaComercial() {
  const colunas = {
    segunda: { nome: "Segunda", tipoCard: "rotina" },
    terca: { nome: "Terça", tipoCard: "rotina" },
    quarta: { nome: "Quarta", tipoCard: "rotina" },
    quinta: { nome: "Quinta", tipoCard: "rotina" },
    sexta: { nome: "Sexta", tipoCard: "rotina" },
  };

  return (
    <QuadroKanbanRotinas
      titulo="Rotinas Comercial"
      setor="comercial"
      colunas={colunas}
    />
  );
}
