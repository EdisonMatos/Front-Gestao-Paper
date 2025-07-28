// components/QuadroKanbanRotinas.jsx
import { useEffect, useState } from "react";
import SkeletonCard from "../quadros/SkeletonCard";
import AddNovaRotina from "./AddNovaRotina";

export default function QuadroKanbanRotinas({ titulo, setor, colunas }) {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [descricaoExpandida, setDescricaoExpandida] = useState({});
  const [rotinasConcluidas, setRotinasConcluidas] = useState({});
  const [foraDoPrazo, setForaDoPrazo] = useState({});
  const [horasConclusao, setHorasConclusao] = useState({});
  const [horasLimite, setHorasLimite] = useState({});

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

  function isDataDessaSemana(dateStr) {
    const date = new Date(dateStr);
    const hoje = new Date();

    // Ajusta para o início da semana (segunda-feira)
    const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const diffSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
    const primeiroDiaDaSemana = new Date(hoje);
    primeiroDiaDaSemana.setDate(hoje.getDate() + diffSegunda);
    primeiroDiaDaSemana.setHours(0, 0, 0, 0);

    const ultimoDiaDaSemana = new Date(primeiroDiaDaSemana);
    ultimoDiaDaSemana.setDate(primeiroDiaDaSemana.getDate() + 6);
    ultimoDiaDaSemana.setHours(23, 59, 59, 999);

    return date >= primeiroDiaDaSemana && date <= ultimoDiaDaSemana;
  }

  function calcularStatus(rotina, horario) {
    const registroAtual = rotina.registros
      ?.filter((reg) => isDataDessaSemana(reg.dataConclusao))
      .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao))[0];

    if (!registroAtual) return "pendente";

    const [hora, minuto] = horario.split(":").map(Number);
    const dataLimite = new Date();
    dataLimite.setHours(hora, minuto, 0, 0);
    dataLimite.setTime(dataLimite.getTime() + rotina.janela * 60000);

    const dataConclusao = new Date(registroAtual.dataConclusao);

    if (dataConclusao <= dataLimite) return "concluida";
    return "atrasada";
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
        const [hora, minuto] = h.split(":").map(Number);
        const horarioRotina = new Date();
        horarioRotina.setHours(hora, minuto, 0, 0);
        const fimDaJanela = new Date(
          horarioRotina.getTime() + r.janela * 60000
        );
        const limite = fimDaJanela
          .toTimeString()
          .split(":")
          .slice(0, 2)
          .join(":");

        expandida.push({
          ...r,
          horario: h,
          id: `${r.id}-${h}`,
          limite,
          statusCalculado: calcularStatus(r, h),
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

  function calcularStatus(rotina, horario) {
    const registroAtual = rotina.registros
      ?.filter((reg) => isDataDessaSemana(reg.dataConclusao))
      .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao))[0];

    if (!registroAtual) return "pendente";

    const dataConclusao = new Date(registroAtual.dataConclusao);

    const [hora, minuto] = horario.split(":").map(Number);

    const dataLimite = new Date(dataConclusao);
    dataLimite.setHours(hora, minuto, 0, 0);
    dataLimite.setTime(dataLimite.getTime() + rotina.janela * 60000);

    if (dataConclusao <= dataLimite) return "concluida";
    return "atrasada";
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
                    className={`p-3 mb-3 border-l-4 shadow bg-background rounded-xl relative group transition-opacity duration-300
                    ${
                      card.statusCalculado === "concluida"
                        ? "border-green-500"
                        : card.statusCalculado === "atrasada"
                        ? "border-red-500"
                        : "border-black"
                    }`}
                  >
                    <button
                      onClick={() => toggleConclusao(card)}
                      disabled={rotinasConcluidas[card.id]}
                      className={`absolute flex items-center justify-center w-4 h-4 transition-transform duration-200 bg-white border-2 border-gray-400 rounded-full top-2 left-2 group-hover:scale-125 ${
                        rotinasConcluidas[card.id] ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {rotinasConcluidas[card.id] && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>

                    <p className="pl-6 font-medium text-text">{card.nome}</p>

                    {!descricaoExpandida[card.id] ? (
                      <button
                        onClick={() => toggleDescricao(card.id)}
                        className="pl-6 mt-1 text-sm text-links/50 hover:underline"
                      >
                        Instruções
                      </button>
                    ) : (
                      <div className="pl-6 mt-2">
                        <p className="text-sm text-text/80">{card.descricao}</p>
                        <button
                          onClick={() => toggleDescricao(card.id)}
                          className="mt-1 text-sm text-links/50 hover:underline"
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
                          <span className="text-red-500">(fora do prazo)</span>
                        )}
                      </p>
                    )}
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
