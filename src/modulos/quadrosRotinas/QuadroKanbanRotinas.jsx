// components/QuadroKanbanRotinas.jsx
import { useEffect, useState } from "react";
import SkeletonCard from "../quadros/SkeletonCard";
import AddNovaRotina from "./AddNovaRotina";

export default function QuadroKanbanRotinas({ titulo, setor, colunas }) {
  const [rotinas, setRotinas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [descricaoExpandida, setDescricaoExpandida] = useState({});
  const [rotinasConcluidas, setRotinasConcluidas] = useState({});
  const [foraDoPrazo, setForaDoPrazo] = useState({});
  const [horasConclusao, setHorasConclusao] = useState({});
  const [horasLimite, setHorasLimite] = useState({});
  const [cardsExpandidos, setCardsExpandidos] = useState({});

  useEffect(() => {
    fetchRotinas();
  }, [setor]);

  async function fetchRotinas() {
    setCarregando(true);
    try {
      const res = await fetch(
        `https://backend-gestao-paper.onrender.com/rotinas/kanban?setor=${setor}`
      );
      const data = await res.json();
      setRotinas(data);
    } catch (error) {
      console.error("Erro ao buscar rotinas:", error);
    } finally {
      setCarregando(false);
    }
  }

  function toggleDescricao(id) {
    setDescricaoExpandida((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function toggleCardExpandido(id) {
    setCardsExpandidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function toggleConclusao(card) {
    if (rotinasConcluidas[card.id]) return;

    const agora = new Date();

    const [hora, minuto] = card.horario.split(":").map(Number);
    const horarioRotina = new Date();
    horarioRotina.setHours(hora, minuto, 0, 0);

    const fimDaJanela = new Date(horarioRotina.getTime() + card.janela * 60000);
    const dentroDoPrazo = agora <= fimDaJanela;

    let comentario = "Concluído";
    if (!dentroDoPrazo) {
      const justificativa = window.prompt(
        "Tarefa fora do prazo. Informe a justificativa:"
      );
      if (!justificativa || justificativa.trim() === "") {
        return;
      }
      comentario = justificativa;
    }

    try {
      await fetch("https://backend-gestao-paper.onrender.com/registros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataConclusao: agora,
          comentario,
          feitoPor: setor,
          rotinaId: card.id.split("-")[0],
        }),
      });

      setRotinasConcluidas((prev) => ({
        ...prev,
        [card.id]: true,
      }));

      const horaConclusao = agora
        .toTimeString()
        .split(":")
        .slice(0, 2)
        .join(":");

      setHorasConclusao((prev) => ({
        ...prev,
        [card.id]: horaConclusao,
      }));

      setHorasLimite((prev) => ({
        ...prev,
        [card.id]: card.limite,
      }));

      if (!dentroDoPrazo) {
        setForaDoPrazo((prev) => ({
          ...prev,
          [card.id]: true,
        }));
      }
    } catch (error) {
      console.error("Erro ao registrar conclusão:", error);
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-text">{titulo}</h2>

      {/* CRUD Separado */}
      <AddNovaRotina setor={setor} onAtualizarRotinas={fetchRotinas} />

      {/* Quadro Kanban */}
      <div className="relative flex gap-4 py-4 overflow-x-auto">
        {Object.entries(colunas).map(([key, config]) => {
          const cards = rotinas[key] || [];

          return (
            <div
              key={key}
              className="min-w-[235px] w-[235px] bg-containers p-3 rounded-2xl shadow-md flex flex-col gap-2"
            >
              <div className="flex items-center justify-between px-2 py-2 text-left text-text">
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
                    onClick={() => toggleCardExpandido(card.id)}
                    className={`p-3 border-l-4 shadow bg-background rounded-xl relative group transition-all duration-300 cursor-pointer
                    ${
                      card.statusCalculado === "concluida"
                        ? "border-links"
                        : card.statusCalculado === "atrasada"
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConclusao(card);
                        }}
                        disabled={rotinasConcluidas[card.id]}
                        className={`flex items-center justify-center w-4 h-4 mt-1 transition-transform duration-200 bg-white border-2 border-gray-400 rounded-full top-2 left-2 group-hover:scale-125 ${
                          rotinasConcluidas[card.id] ? "cursor-not-allowed" : ""
                        }`}
                      >
                        {rotinasConcluidas[card.id] && (
                          <div className="w-2 h-2 rounded-full bg-links"></div>
                        )}
                      </button>

                      <p className="font-medium text-text">{card.nome}</p>
                    </div>

                    {cardsExpandidos[card.id] && (
                      <>
                        {!descricaoExpandida[card.id] ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescricao(card.id);
                            }}
                            className="pl-6 mt-1 text-sm text-links hover:underline"
                          >
                            Instruções
                          </button>
                        ) : (
                          <div className="pl-6 mt-2">
                            <p className="text-sm text-text/80">
                              {card.descricao}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescricao(card.id);
                              }}
                              className="mt-1 text-sm text-links hover:underline"
                            >
                              Ocultar instruções
                            </button>
                          </div>
                        )}

                        <p className="pl-6 mt-2 text-xs text-text">
                          ⏰ Horário: {card.horario} - ({card.complexidade})
                        </p>

                        <p className="pl-6 text-xs text-text">
                          🕓 Prazo: {card.limite}
                        </p>

                        {horasConclusao[card.id] && (
                          <p className="pl-6 mt-1 text-xs text-gray-500">
                            ✅ {horasConclusao[card.id]}{" "}
                            {foraDoPrazo[card.id] && (
                              <span className="text-red-500">
                                (fora do prazo)
                              </span>
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="ml-2 text-sm text-gray-600">Sem rotinas</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
