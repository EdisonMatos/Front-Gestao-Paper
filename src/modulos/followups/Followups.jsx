import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SERVICOS_API_URL = "https://backend-gestao-paper.onrender.com/servicos";
const FOLLOWUPS_API_URL = "https://backend-gestao-paper.onrender.com/followups";
const COMENTARIOS_API_URL =
  "https://backend-gestao-paper.onrender.com/comentarios";

export default function Followups() {
  const [groupedFollowups, setGroupedFollowups] = useState({});
  const [allFollowups, setAllFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const role = localStorage.getItem("setor");

  // Função para buscar e agrupar os follow-ups
  const fetchFollowups = async () => {
    try {
      setLoading(true);
      // Busca os follow-ups e os serviços em paralelo para maior eficiência
      const [followupsRes, servicosRes] = await Promise.all([
        fetch(FOLLOWUPS_API_URL),
        fetch(SERVICOS_API_URL),
      ]);

      if (!followupsRes.ok || !servicosRes.ok) {
        throw new Error("Falha ao carregar dados do servidor.");
      }

      const followupsData = await followupsRes.json();
      const servicosData = await servicosRes.json();

      // Cria um mapa para acesso rápido aos dados completos do serviço pelo ID
      const servicosMap = new Map(servicosData.map((s) => [s.id, s]));

      // Combina os dados, garantindo que cada follow-up tenha os detalhes completos do serviço
      const enrichedFollowups = followupsData.map((f) => ({
        ...f,
        servico: servicosMap.get(f.servicoId) || f.servico, // Usa o serviço completo do mapa
      }));

      setAllFollowups(enrichedFollowups); // Guarda a lista completa

      const sortedData = enrichedFollowups.sort((a, b) => {
        if (a.status === "pendente" && b.status !== "pendente") return -1;
        if (a.status !== "pendente" && b.status === "pendente") return 1;
        return new Date(b.criadoEm) - new Date(a.criadoEm);
      });

      // Agrupa os follow-ups por setor
      const groups = sortedData.reduce((acc, followup) => {
        const setor = followup.setor || "indefinido";
        if (!acc[setor]) {
          acc[setor] = [];
        }
        acc[setor].push(followup);
        return acc;
      }, {});

      setGroupedFollowups(groups);
    } catch (error) {
      toast.error("Erro ao carregar os follow-ups.");
      console.error("Erro ao carregar os follow-ups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  // Função para gerar novos follow-ups
  const handleGenerateFollowups = async () => {
    setIsGenerating(true);
    const toastId = toast.loading(
      "Buscando serviços e follow-ups existentes..."
    );

    try {
      const [servicosRes, followupsRes] = await Promise.all([
        fetch(SERVICOS_API_URL),
        fetch(FOLLOWUPS_API_URL),
      ]);

      if (!servicosRes.ok || !followupsRes.ok) {
        throw new Error("Falha ao buscar dados iniciais.");
      }

      const servicos = await servicosRes.json();
      const existingFollowups = await followupsRes.json();

      const pendingFollowupServiceIds = new Set(
        existingFollowups
          .filter((f) => f.status === "pendente")
          .map((f) => f.servicoId)
      );

      const setoresExcluidos = [
        "diretoria",
        "feedbacks",
        "financeiro",
        "trafego",
      ];
      const servicosParaFollowup = servicos.filter(
        (s) =>
          !s.dataConclusao &&
          s.cliente &&
          !setoresExcluidos.includes(s.turnoDaVez) &&
          !pendingFollowupServiceIds.has(s.id)
      );

      if (servicosParaFollowup.length === 0) {
        toast.update(toastId, {
          render: "Nenhum novo serviço precisa de follow-up no momento.",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        setIsGenerating(false);
        return;
      }

      toast.update(toastId, {
        render: `Gerando ${servicosParaFollowup.length} novo(s) follow-up(s)...`,
      });

      const creationPromises = servicosParaFollowup.map(async (servico) => {
        const payload = {
          servicoId: servico.id,
          nomeServico:
            (servico.nome && servico.nome.trim()) || "Não especificado",
          setor:
            (servico.turnoDaVez && servico.turnoDaVez.trim()) || "Não definido",
          empresa:
            (servico.cliente.empresa && servico.cliente.empresa.trim()) ||
            "Não definida",
          representante:
            (servico.cliente.representante &&
              servico.cliente.representante.trim()) ||
            "Não definido",
          status: "pendente",
          comentario: "",
        };

        const res = await fetch(FOLLOWUPS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "Falha ao criar follow-up para o serviço:",
            servico.id,
            errorData
          );
          throw new Error(
            `Falha ao criar follow-up para o serviço ${servico.nome}`
          );
        }
        return res.json();
      });

      await Promise.all(creationPromises);
      toast.update(toastId, {
        render: "Follow-ups gerados com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchFollowups();
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao gerar os follow-ups.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao gerar follow-ups:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para concluir follow-up e adicionar comentário
  const handleMarkAsDone = async (followup) => {
    const comentario = prompt(
      "Por favor, adicione um comentário para este follow-up:"
    );

    if (comentario === null) {
      toast.info("Ação cancelada.", { autoClose: 1500 });
      return;
    }

    const toastId = toast.loading(
      "Registrando comentário e atualizando status..."
    );

    try {
      // 1. Criar o comentário para o serviço
      const dataConclusao = new Date();
      const dataFormatada = dataConclusao.toLocaleDateString("pt-BR");
      const textoComentario = `Follow up ${dataFormatada}: ${comentario}`;

      const nomeUsuario = localStorage.getItem("nome") || "Sistema";
      const setorUsuario = localStorage.getItem("setor") || "indefinido";

      const comentarioPayload = {
        servicoId: followup.servicoId,
        feitoPor: nomeUsuario,
        setor: setorUsuario,
        texto: textoComentario,
      };

      const commentRes = await fetch(COMENTARIOS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comentarioPayload),
      });

      if (!commentRes.ok) throw new Error("Falha ao registrar o comentário.");

      // 2. Atualizar o follow-up com o comentário
      const followupPayload = {
        ...followup,
        status: "feito",
        conclusao: dataConclusao.toISOString(),
        comentario: comentario, // Adiciona o comentário ao followup
      };

      const followupRes = await fetch(`${FOLLOWUPS_API_URL}/${followup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followupPayload),
      });

      if (!followupRes.ok) throw new Error("Falha ao atualizar o follow-up.");

      toast.update(toastId, {
        render: "Follow-up concluído com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchFollowups();
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Ocorreu um erro.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao concluir follow-up:", error);
    }
  };

  // Função para excluir um follow-up
  const handleDeleteFollowup = async (followupId) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este follow-up? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    const toastId = toast.loading("Excluindo follow-up...");

    try {
      const res = await fetch(`${FOLLOWUPS_API_URL}/${followupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Falha ao excluir o follow-up.");
      }

      toast.update(toastId, {
        render: "Follow-up excluído com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchFollowups(); // Atualiza a lista
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao excluir o follow-up.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao excluir follow-up:", error);
    }
  };

  // Função para finalizar (excluir) todos os follow-ups
  const handleFinalizeAllFollowups = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja finalizar e excluir TODOS os follow-ups? Esta ação limpará toda a lista."
      )
    ) {
      return;
    }

    setIsFinalizing(true);
    const toastId = toast.loading("Finalizando todos os follow-ups...");

    try {
      const deletionPromises = allFollowups.map((f) =>
        fetch(`${FOLLOWUPS_API_URL}/${f.id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletionPromises);

      // Checa se alguma requisição falhou
      if (results.some((res) => !res.ok)) {
        throw new Error("Falha ao excluir um ou mais follow-ups.");
      }

      toast.update(toastId, {
        render: "Todos os follow-ups foram finalizados com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      fetchFollowups(); // Atualiza a lista
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao finalizar os follow-ups.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao finalizar follow-ups:", error);
    } finally {
      setIsFinalizing(false);
    }
  };

  // Formata data e link do WhatsApp
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const generateWhatsAppLink = (phone) => {
    if (!phone || typeof phone !== "string") return null;
    const cleanedPhone = phone.replace(/\D/g, "");
    return `https://wa.me/55${cleanedPhone}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-2xl font-bold text-text">Gestão de Follow-ups</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateFollowups}
            disabled={isGenerating || allFollowups.length > 0}
            className="px-4 py-2 text-black transition rounded bg-buttonsHover hover:bg-buttons disabled:bg-gray-500 disabled:cursor-not-allowed"
            title={
              allFollowups.length > 0
                ? "Finalize os follow-ups existentes para poder gerar novos."
                : "Gerar novos follow-ups"
            }
          >
            {isGenerating ? "Gerando..." : "Gerar Follow-ups"}
          </button>
          {role === "diretoria" && (
            <button
              onClick={handleFinalizeAllFollowups}
              disabled={isFinalizing || allFollowups.length === 0}
              className="px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isFinalizing ? "Finalizando..." : "Finalizar Follow-ups"}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando follow-ups...</p>
      ) : Object.keys(groupedFollowups).length > 0 ? (
        <div className="space-y-6">
          {Object.keys(groupedFollowups).map((setor) => (
            <div
              key={setor}
              className="border-border border-[1px] p-4 rounded-xl"
            >
              <h3 className="mb-2 text-xl font-semibold capitalize text-text">
                {setor}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-containers text-text">
                    <tr>
                      <th className="px-4 py-3 w-[150px]">Serviço</th>
                      <th className="px-4 py-3 w-[250px]">Empresa</th>
                      <th className="px-4 py-3 w-[250px]">Representante</th>
                      <th className="px-4 py-3 w-[100px]">Status</th>
                      <th className="px-4 py-3 w-[150px]">Data de Conclusão</th>
                      <th className="px-4 py-3 w-[350px]">Comentário</th>
                      <th className="px-4 py-3 text-center w-[150px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background ">
                    {groupedFollowups[setor]
                      .sort((a, b) =>
                        a.nomeServico.localeCompare(b.nomeServico)
                      )
                      .map((f) => {
                        const whatsappLink = generateWhatsAppLink(
                          f.servico?.cliente?.telefone
                        );
                        return (
                          <tr
                            key={f.id}
                            className="border-t border-border hover:bg-containers/20"
                          >
                            <td className="px-4 py-3">{f.nomeServico}</td>
                            <td className="px-4 py-3">{f.empresa}</td>
                            <td className="px-4 py-3">
                              {whatsappLink ? (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline"
                                >
                                  {f.representante}
                                </a>
                              ) : (
                                f.representante
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-semibold capitalize rounded-full ${
                                  f.status === "pendente"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-green-500/20 text-green-300"
                                }`}
                              >
                                {f.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(f.conclusao)}
                            </td>
                            <td className="px-4 py-3">
                              {f.comentario && f.comentario.trim()
                                ? f.comentario.length > 50
                                  ? `${f.comentario.substring(0, 50)}...`
                                  : f.comentario
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center space-x-4">
                                <input
                                  type="checkbox"
                                  title="Finalizar follow-up"
                                  className="w-5 h-5 cursor-pointer accent-buttons"
                                  checked={f.status === "feito"}
                                  disabled={f.status === "feito"}
                                  onChange={() => handleMarkAsDone(f)}
                                />
                                {role === "diretoria" && (
                                  <button
                                    onClick={() => handleDeleteFollowup(f.id)}
                                    title="Excluir follow-up"
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      <path d="M10 11v6" />
                                      <path d="M14 11v6" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 border border-dashed rounded-md border-border">
          <p>Nenhum follow-up encontrado.</p>
          <p className="mt-1 text-xs">
            Clique em "Gerar Follow-ups" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
