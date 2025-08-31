import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Check } from "lucide-react";

export default function MenuItemPrazos({
  label,
  Icon,
  abaAtiva,
  setAbaAtiva,
  allowedRoles = [],
}) {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("setor");
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return null;
  }

  useEffect(() => {
    async function carregarServicos() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://backend-gestao-paper.onrender.com/servicos"
        );
        setServicos(data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    }

    carregarServicos();
    const interval = setInterval(carregarServicos, 300000); // atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  function calcularDiasRestantes(dataAlvo) {
    if (!dataAlvo) return null;
    const hoje = new Date();
    const prazo = new Date(dataAlvo);
    const diff = prazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const servicosAtivos = servicos.filter(
    (s) => !s.dataConclusao && s.posicaoNoQuadro !== "ausentes"
  );

  const count = servicosAtivos.filter((s) => {
    const diasProjeto = calcularDiasRestantes(s.dataPrazoProjeto);
    const diasTarefa = calcularDiasRestantes(s.dataProximoPrazo);
    return diasProjeto === 0 || diasTarefa === 0;
  }).length;

  return (
    <li>
      <button
        onClick={() => setAbaAtiva("prazos")}
        className={`flex justify-between items-center p-2 w-full rounded-lg group ${
          abaAtiva === "prazos"
            ? "text-white bg-background"
            : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
        }`}
      >
        <div className="flex">
          <Icon
            className={`${
              abaAtiva === "prazos" ? "text-links" : "text-white/50"
            }`}
          />
          <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
        </div>

        <div>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white/10 ms-3" />
          ) : count > 0 ? (
            <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium bg-red-100 rounded-full text-links ms-3 dark:bg-inputBg dark:text-links">
              {count}
            </span>
          ) : (
            <Check className="w-5 h-5 text-links ms-3" />
          )}
        </div>
      </button>
    </li>
  );
}
