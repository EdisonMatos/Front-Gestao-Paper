import { useEffect, useState } from "react";
import CardServico from "../quadros/CardServico";

const setores = [
  "suporte",
  "dev",
  "webmaster",
  "trafego",
  "socialmedia",
  "feedbacks",
  "comercial",
  "financeiro",
  "diretoria",
];

export default function DashboardTarefasEmProgresso() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      try {
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
  }, []);

  // Agrupa os serviços em progresso por setor
  const servicosPorSetor = setores.reduce((acc, setor) => {
    acc[setor] = servicos.filter(
      (s) => s.posicaoNoQuadro === "emProgresso" && s.turnoDaVez === setor
    );
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-text">
        Tarefas em Progresso por Setor
      </h2>

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
                <th className="px-4 py-2 text-left bg-containers text-text">
                  Tarefas em Progresso
                </th>
              </tr>
            </thead>
            <tbody>
              {setores.map((setor) => {
                const servicosEmProgresso = servicosPorSetor[setor];

                return (
                  <tr key={setor} className="border-t border-border">
                    <td className="px-4 py-2 font-medium capitalize text-text bg-background">
                      {setor}
                    </td>
                    <td className="px-4 py-2 bg-background">
                      {servicosEmProgresso.length > 0 ? (
                        servicosEmProgresso.map((servico) => (
                          <div className="bg-containers w-[375px] px-2 pt-2 pb-[2px] rounded-2xl">
                            <CardServico
                              key={servico.id}
                              servico={servico}
                              provided={{
                                innerRef: null,
                                draggableProps: {},
                                dragHandleProps: {},
                              }}
                              snapshot={{ isDragging: false }}
                              turno={servico.turnoDaVez}
                              modoCard="compacto"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="p-1 italic text-center text-text/50 bg-containers rounded-xl">
                          Sem tarefa em progresso
                        </p>
                      )}
                    </td>
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
