import { useEffect, useState } from "react";

const setores = [
  "dev",
  "suporte",
  "webmaster",
  "feedbacks",
  "comercial",
  "financeiro",
  "trafego",
  "marketing",
  "contabilidade",
  "socialmedia",
  "diretoria",
];

const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta"];

export default function DashboardResumoRotinas() {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("https://backend-gestao-paper.onrender.com/rotinas")
      .then((res) => res.json())
      .then(setRotinas)
      .catch((err) => console.error("Erro ao buscar rotinas:", err))
      .finally(() => setCarregando(false));
  }, []);

  function isDataDessaSemana(dateStr) {
    const date = new Date(dateStr);
    const hoje = new Date();

    // Ajusta para o início da semana (segunda-feira)
    const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const diffSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;

    const primeira = new Date(hoje);
    primeira.setDate(hoje.getDate() + diffSegunda);
    primeira.setHours(0, 0, 0, 0);

    const ultima = new Date(primeira);
    ultima.setDate(primeira.getDate() + 6);
    ultima.setHours(23, 59, 59, 999);

    return date >= primeira && date <= ultima;
  }

  function calcularStatus(rotina, horario) {
    const registrosSemana = rotina.registros
      ?.filter((r) => isDataDessaSemana(r.dataConclusao))
      .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao));

    const registroAtual = registrosSemana?.[0];
    if (!registroAtual) return "pendente";

    const dataConclusao = new Date(registroAtual.dataConclusao);
    const [hora, minuto] = horario.split(":").map(Number);

    const dataLimite = new Date(dataConclusao);
    dataLimite.setHours(hora, minuto, 0, 0);
    dataLimite.setTime(dataLimite.getTime() + rotina.janela * 60000);

    return dataConclusao <= dataLimite ? "concluida" : "atrasada";
  }

  function gerarResumoPorSetorEDia() {
    const resumo = {};

    setores.forEach((setor) => {
      resumo[setor] = {};
      diasDaSemana.forEach((dia) => {
        resumo[setor][dia] = {
          concluida: [],
          atrasada: [],
          pendente: [],
        };
      });
    });

    rotinas.forEach((rotina) => {
      const dias = rotina.diaDaSemana
        .toLowerCase()
        .split(",")
        .map((d) => d.trim());

      const diasAplicaveis = dias.includes("todos") ? diasDaSemana : dias;

      diasAplicaveis.forEach((dia) => {
        const horarios = rotina.horario
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean);

        horarios.forEach((horario) => {
          const status = calcularStatus(rotina, horario);
          if (resumo[rotina.setor] && resumo[rotina.setor][dia]) {
            resumo[rotina.setor][dia][status].push(rotina.nome);
          }
        });
      });
    });

    return resumo;
  }

  const resumo = gerarResumoPorSetorEDia();

  return (
    <div className="p-6 w-[1250px]">
      <h2 className="mb-4 text-2xl font-bold text-text">Resumo da Semana</h2>

      {carregando ? (
        <p className="text-gray-500">Carregando dados...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-containers text-text">
                  Setor
                </th>
                {diasDaSemana.map((dia) => (
                  <th
                    key={dia}
                    className="px-4 py-2 capitalize bg-containers text-text "
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {setores.map((setor) => {
                const infoSetor = resumo[setor];
                const temRotinas = diasDaSemana.some((dia) => {
                  const diaInfo = infoSetor[dia];
                  return (
                    diaInfo.concluida.length > 0 ||
                    diaInfo.atrasada.length > 0 ||
                    diaInfo.pendente.length > 0
                  );
                });

                if (!temRotinas) return null;

                return (
                  <tr key={setor} className="border-t border-border ">
                    <td className="px-4 py-2 font-medium capitalize text-text bg-background">
                      {setor}
                    </td>
                    {diasDaSemana.map((dia) => {
                      const info = resumo[setor][dia];

                      return (
                        <td
                          key={dia}
                          className="px-4 py-2 text-sm align-top text-text bg-background"
                        >
                          <ul className="space-y-1">
                            {info.concluida.map((nome, i) => (
                              <li key={`c-${i}`} className="text-links">
                                ✓ {nome}
                              </li>
                            ))}
                            {info.atrasada.map((nome, i) => (
                              <li key={`a-${i}`} className="text-red-500">
                                ⚠️ {nome}
                              </li>
                            ))}
                            {info.pendente.map((nome, i) => (
                              <li key={`p-${i}`} className="text-gray-400">
                                ◼️ {nome}
                              </li>
                            ))}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
