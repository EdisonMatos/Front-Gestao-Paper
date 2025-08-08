import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // ou qualquer ícone de seta

export default function AcordionDepartamentos({ titulo, children }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center gap-2 py-2 pl-6 pr-4 text-xl font-bold text-left transition-colors  text-white font-mainFont hover:bg-buttonsHover hover:text-black bg-neutral-900  rounded-md min-w-[300px] desktop1:min-w-[450px]"
      >
        {aberto ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        {titulo}
      </button>

      {aberto && (
        <div className="my-6 overflow-x-auto border border-border rounded-xl w-fit">
          {children}
        </div>
      )}
    </div>
  );
}
