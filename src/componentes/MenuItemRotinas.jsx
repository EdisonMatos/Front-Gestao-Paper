import { useEffect, useState } from "react";
import { AlarmClockCheck } from "lucide-react";

export default function MenuItemRotinas({ abaAtiva, setAbaAtiva }) {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("https://backend-gestao-paper.onrender.com/rotinas")
      .then((res) => res.json())
      .then(setRotinas)
      .catch((err) => console.error("Erro ao buscar rotinas:", err))
      .finally(() => setCarregando(false));
  }, []);

  function isHoje(dateStr) {
    const date = new Date(dateStr);
    const hoje = new Date();
    return (
      date.getDate() === hoje.getDate() &&
      date.getMonth() === hoje.getMonth() &&
      date.getFullYear() === hoje.getFullYear()
    );
  }

  function calcularStatus(rotina, horario) {
    const registrosHoje = rotina.registros
      ?.filter((r) => isHoje(r.dataConclusao))
      .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao));

    const registroAtual = registrosHoje?.[0];
    if (!registroAtual) return "pendente";

    const dataConclusao = new Date(registroAtual.dataConclusao);
    const [hora, minuto] = horario.split(":").map(Number);

    const dataLimite = new Date(dataConclusao);
    dataLimite.setHours(hora, minuto, 0, 0);
    dataLimite.setTime(dataLimite.getTime() + rotina.janela * 60000);

    return dataConclusao <= dataLimite ? "concluida" : "atrasada";
  }

  // Conta quantas rotinas pendentes ou atrasadas existem hoje
  const rotinasNaoConcluidasHoje = rotinas.reduce((count, rotina) => {
    const dias = rotina.diaDaSemana
      .toLowerCase()
      .split(",")
      .map((d) => d.trim());
    const hoje = new Date();
    const diaSemana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ][hoje.getDay()];

    // Só considera rotinas do dia
    if (!dias.includes("todos") && !dias.includes(diaSemana)) {
      return count;
    }

    const horarios = rotina.horario
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    horarios.forEach((horario) => {
      const status = calcularStatus(rotina, horario);
      if (status === "pendente" || status === "atrasada") {
        count += 1;
      }
    });

    return count;
  }, 0);

  return (
    <button
      onClick={() => setAbaAtiva("rotinas")}
      className={`flex justify-between items-center p-2 w-full rounded-lg group ${
        abaAtiva === "rotinas"
          ? "text-white bg-background"
          : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
      }`}
    >
      <div className="flex">
        <AlarmClockCheck
          className={`${
            abaAtiva === "rotinas" ? "text-links" : "text-white/50"
          }`}
        />
        <span className="flex-1 ms-3 whitespace-nowrap">Rotinas</span>
      </div>
      <div>
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full ms-3 dark:bg-inputBg dark:text-links">
          {carregando ? "-" : rotinasNaoConcluidasHoje}
        </span>
      </div>
    </button>
  );
}
