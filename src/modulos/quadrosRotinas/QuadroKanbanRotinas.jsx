// components/QuadroKanbanRotinas.jsx
import { useEffect, useState } from "react";
import SkeletonCard from "../quadros/SkeletonCard";
import AddNovaRotina from "./AddNovaRotina";

export default function QuadroKanbanRotinas({ titulo, setor, colunas }) {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [descricaoExpandida, setDescricaoExpandida] = useState({});

  useEffect(() => {
    fetchRotinas();
  }, [setor]);

  async function fetchRotinas() {
    try {
      const res = await fetch(
        "https://backend-gestao-paper.onrender.com/rotinas"
      );
      const data = await res.json();
      const filtradas = data.filter((r) => r.setor === setor);
      setRotinas(filtradas);
    } catch (error) {
      console.error("Erro ao buscar rotinas:", error);
    } finally {
      setCarregando(false);
    }
  }

  function filtrarPorDia(dia) {
    const doDia = rotinas.filter((r) => {
      const dias = r.diaDaSemana
        .toLowerCase()
        .split(",")
        .map((d) => d.trim());
      return dias.includes(dia) || dias.includes("todos");
    });

    const expandida = [];
    doDia.forEach((r) => {
      const horarios = r.horario
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);
      horarios.forEach((h) => {
        expandida.push({
          ...r,
          horario: h,
          id: `${r.id}-${h}`,
        });
      });
    });

    expandida.sort((a, b) => {
      const [hA, mA] = a.horario.split(":").map(Number);
      const [hB, mB] = b.horario.split(":").map(Number);
      return hA !== hB ? hA - hB : mA - mB;
    });

    return expandida;
  }

  function toggleDescricao(id) {
    setDescricaoExpandida((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-text">{titulo}</h2>

      {/* CRUD Separado */}
      <AddNovaRotina setor={setor} onAtualizarRotinas={fetchRotinas} />

      {/* Quadro Kanban */}
      <div className="relative flex gap-4 py-4 overflow-x-auto">
        {Object.entries(colunas).map(([key, config]) => {
          const cards = filtrarPorDia(key);

          return (
            <div
              key={key}
              className="min-w-[235px] w-[235px] bg-containers p-3 rounded-2xl shadow-md"
            >
              <div className="flex items-center justify-between px-2 py-4 mb-2 text-left text-text">
                <span>{config.nome}</span>
                <span className="w-8 px-2 py-2 text-sm text-center text-text rounded-xl bg-background">
                  {cards.length}
                </span>
              </div>

              {carregando ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : cards.length > 0 ? (
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 mb-3 border-l-4 shadow border-links bg-background rounded-xl"
                  >
                    <p className="font-medium text-text">{card.nome}</p>

                    {!descricaoExpandida[card.id] ? (
                      <button
                        onClick={() => toggleDescricao(card.id)}
                        className="mt-1 text-sm text-links/50 hover:underline"
                      >
                        Instruções
                      </button>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-text/80">{card.descricao}</p>
                        <button
                          onClick={() => toggleDescricao(card.id)}
                          className="mt-1 text-sm text-links/50 hover:underline"
                        >
                          Ocultar instruções
                        </button>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                      ⏰ {card.horario} - ({card.complexidade})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Sem rotinas</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
