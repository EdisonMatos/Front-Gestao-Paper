import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function MenuItemMeta({
  meta = 2,
  turno = "progresso",
  label = "Em Progresso",
  Icon,
  abaAtiva,
  setAbaAtiva,
}) {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      try {
        setCarregando(true);
        const res = await fetch(
          "https://backend-gestao-paper.onrender.com/servicos"
        );
        const data = await res.json();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarServicos();
    const intervalo = setInterval(carregarServicos, 300000);
    return () => clearInterval(intervalo);
  }, []);

  const tarefas = servicos.filter((s) => s.posicaoNoQuadro === "emProgresso");
  const count = tarefas.length;

  // Lógica dinâmica baseada na meta
  let badgeValue = 0;
  if (count < meta) {
    badgeValue = meta - count; // falta para bater a meta
  } else if (count === meta) {
    badgeValue = 0; // meta atingida
  } else {
    badgeValue = -(count - meta); // excedente como negativo
  }

  return (
    <button
      onClick={() => setAbaAtiva(turno)}
      className={`flex justify-between items-center p-2 w-full rounded-lg group ${
        abaAtiva === turno
          ? "text-white bg-background"
          : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
      }`}
    >
      <div className="flex">
        {Icon && (
          <Icon
            className={`${abaAtiva === turno ? "text-links" : "text-white/50"}`}
          />
        )}
        <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
      </div>
      <div>
        {carregando ? (
          <Loader2 className="w-5 h-5 animate-spin text-white/10 ms-3" />
        ) : count === meta ? (
          <Check className="w-5 h-5 text-links ms-3" />
        ) : (
          badgeValue !== 0 && (
            <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full ms-3 dark:bg-inputBg dark:text-red-500">
              {badgeValue}
            </span>
          )
        )}
      </div>
    </button>
  );
}
