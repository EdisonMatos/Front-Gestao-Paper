import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function QuadroDashboardPrazos({ titulo, setor }) {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      setLoading(true);
      try {
        const res = await fetch(
          "https://backend-gestao-paper.onrender.com/servicos"
        );
        const data = await res.json();
        setServicos(data);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarServicos();
    const intervalo = setInterval(carregarServicos, 300000); // 5min
    return () => clearInterval(intervalo);
  }, []);

  function calcularDiasRestantes(dataPrazo) {
    if (!dataPrazo) return null;
    const hoje = new Date();
    const prazo = new Date(dataPrazo);
    prazo.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    const diff = prazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // filtra só o setor específico
  const servicosSetor = servicos.filter(
    (s) => s.turnoDaVez === setor && !s.dataConclusao
  );

  // agrupa serviços
  const atrasados = [];
  const hoje = [];
  const amanha = [];
  const demais = [];

  servicosSetor.forEach((s) => {
    const dias = calcularDiasRestantes(s.dataProximoPrazo);
    if (dias === null) return; // sem prazo definido

    if (dias < 0) {
      atrasados.push(s);
    } else if (dias === 0) {
      hoje.push(s);
    } else if (dias === 1) {
      amanha.push(s);
    } else {
      demais.push(s);
    }
  });

  const cards = [
    {
      titulo: "Em atraso",
      cor: "bg-black text-red-800",
      lista: atrasados,
    },
    { titulo: "Pra hoje", cor: "bg-black text-links", lista: hoje },
    { titulo: "Pra amanhã", cor: "bg-black text-text", lista: amanha },
    {
      titulo: "Demais prazos",
      cor: "bg-black text-text",
      lista: demais,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-text">{titulo}</h2>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {cards.map((c) => (
            <div
              key={c.titulo}
              className="p-4 shadow bg-inputBg rounded-2xl flex-1 max-w-[300px]"
            >
              <div className="w-full my-4 font-semibold text-center ">
                {c.titulo}
              </div>
              <div className="flex items-center justify-center mb-2">
                <span
                  className={`text-[60px] bg-black font-bold ${
                    c.lista.length === 0 ? "text-text/20" : c.cor
                  } w-full text-center px-2 py-1 rounded-xl`}
                >
                  {c.lista.length}
                </span>
              </div>
              <ul className="mt-6 space-y-1 text-sm">
                {c.lista.length === 0 ? (
                  <li className="text-gray-400">Nenhum serviço</li>
                ) : (
                  c.lista.map((s) => {
                    const dias = calcularDiasRestantes(s.dataProximoPrazo);
                    return (
                      <li key={s.id} className="p-4 rounded-lg bg-background">
                        <div className="font-medium">{s.nome}</div>
                        {s.cliente?.empresa && (
                          <div className="text-sm text-gray-500">
                            {s.cliente.empresa}
                          </div>
                        )}
                        {c.titulo === "Em atraso" && (
                          <div className="text-xs text-red-500">
                            Atrasado {Math.abs(dias)} dias
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
