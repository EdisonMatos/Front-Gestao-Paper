import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // ou qualquer ícone de seta

export default function AcordionDepartamentos({ titulo, children }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center gap-2 pl-6 pr-4 py-2 text-left w-full text-2xl font-bold text-text font-mainFont hover:bg-muted transition-colors"
      >
        {aberto ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        {titulo}
      </button>

      {aberto && (
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          {children}
        </div>
      )}
    </div>
  );
}
