import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const USUARIOS_API_URL = "https://backend-gestao-paper.onrender.com/usuarios";
const REGISTROS_API_URL =
  "https://backend-gestao-paper.onrender.com/registrosusuarios";

// Componente para exibir texto truncado com opção de "ver mais"
const TruncatedText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= 50) {
    return <>{text || "-"}</>;
  }

  return (
    <span>
      {isExpanded ? text : `${text.substring(0, 50)}... `}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-xs text-blue-400 hover:underline"
      >
        (ver {isExpanded ? "menos" : "mais"})
      </button>
    </span>
  );
};

export default function AnaliseDesempenho() {
  const [registros, setRegistros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: "",
    natureza: "Positiva",
    tipo: "Técnica",
    subtipo: "Desconhecimento",
    descricao: "",
    data: new Date().toISOString().split("T")[0],
  });
  const [editingRegistroId, setEditingRegistroId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [registrosRes, usuariosRes] = await Promise.all([
        fetch(REGISTROS_API_URL),
        fetch(USUARIOS_API_URL),
      ]);

      if (!registrosRes.ok || !usuariosRes.ok) {
        throw new Error("Falha ao carregar dados do servidor.");
      }

      const registrosData = await registrosRes.json();
      const usuariosData = await usuariosRes.json();

      setRegistros(
        registrosData.sort(
          (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
        )
      );
      setUsuarios(usuariosData);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      usuarioId: "",
      natureza: "Positiva",
      tipo: "Técnica",
      subtipo: "Desconhecimento",
      descricao: "",
      data: new Date().toISOString().split("T")[0],
    });
    setEditingRegistroId(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usuarioId) {
      toast.warn("Por favor, selecione um usuário.");
      return;
    }

    const url = editingRegistroId
      ? `${REGISTROS_API_URL}/${editingRegistroId}`
      : REGISTROS_API_URL;
    const method = editingRegistroId ? "PUT" : "POST";

    const toastId = toast.loading(
      editingRegistroId ? "Atualizando registro..." : "Criando novo registro..."
    );

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          data: formData.data ? new Date(formData.data) : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha ao salvar o registro.");
      }

      toast.update(toastId, {
        render: `Registro ${
          editingRegistroId ? "atualizado" : "criado"
        } com sucesso!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      resetForm();
      fetchData();
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Ocorreu um erro ao salvar.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao salvar registro:", error);
    }
  };

  const handleEdit = (registro) => {
    setEditingRegistroId(registro.id);
    setFormData({
      usuarioId: registro.usuarioId,
      natureza: registro.natureza || "Positiva",
      tipo: registro.tipo || "Técnica",
      subtipo: registro.subtipo || "Desconhecimento",
      descricao: registro.descricao || "",
      data: registro.data
        ? new Date(registro.data).toISOString().split("T")[0]
        : "",
    });
    setIsFormVisible(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) {
      return;
    }

    const toastId = toast.loading("Excluindo registro...");
    try {
      const res = await fetch(`${REGISTROS_API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Falha ao excluir o registro.");
      }
      toast.update(toastId, {
        render: "Registro excluído com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      fetchData();
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao excluir.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Erro ao excluir:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    // Adiciona o fuso horário para corrigir a data
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(
      "pt-BR"
    );
  };

  // Agrupa e ordena os registros
  const groupedAndSortedRegistros = registros.reduce((acc, registro) => {
    const userId = registro.usuarioId;
    if (!userId) return acc;

    if (!acc[userId]) {
      acc[userId] = {
        Positiva: [],
        Negativa: [],
      };
    }

    const natureza = registro.natureza || "Negativa";
    if (natureza === "Positiva") {
      acc[userId].Positiva.push(registro);
    } else {
      acc[userId].Negativa.push(registro);
    }

    return acc;
  }, {});

  // Ordena os arrays dentro do objeto agrupado
  Object.keys(groupedAndSortedRegistros).forEach((userId) => {
    const userRegistros = groupedAndSortedRegistros[userId];
    const sortFn = (a, b) => {
      const tipoCompare = (a.tipo || "").localeCompare(b.tipo || "");
      if (tipoCompare !== 0) return tipoCompare;
      return (a.descricao || "").localeCompare(b.descricao || "");
    };

    userRegistros.Positiva.sort(sortFn);
    userRegistros.Negativa.sort(sortFn);
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text">Análise de Desempenho</h2>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="px-4 py-2 text-black transition rounded bg-buttonsHover hover:bg-buttons"
          >
            Adicionar Registro
          </button>
        )}
      </div>

      {/* Formulário de Adicionar/Editar */}
      {isFormVisible && (
        <div className="border-border border-[1px] p-4 rounded-xl mb-6">
          <h3 className="mb-3 text-xl font-semibold text-text">
            {editingRegistroId ? "Editar Registro" : "Adicionar Novo Registro"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {/* Coluna 1 */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Usuário
                </label>
                <select
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background border-border"
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Natureza
                </label>
                <select
                  name="natureza"
                  value={formData.natureza}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background border-border"
                >
                  <option value="Positiva">Positiva</option>
                  <option value="Negativa">Negativa</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background border-border"
                />
              </div>
            </div>
            {/* Coluna 2 */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background border-border"
                >
                  <option>Técnica</option>
                  <option>Comportamento</option>
                  <option>Cultura</option>
                  <option>Processo</option>
                  <option>Conhecimento</option>
                  <option>Atenção</option>
                  <option>Memória</option>
                  <option>Determinação</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Subtipo
                </label>
                <select
                  name="subtipo"
                  value={formData.subtipo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-background border-border"
                >
                  <option>-</option>
                </select>
              </div>
            </div>
            {/* Coluna 3 e Botões */}
            <div className="flex flex-col">
              <label className="block mb-1 text-sm font-medium">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows="4"
                className="flex-grow w-full p-2 border rounded-md bg-background border-border"
              ></textarea>
              <div className="flex items-end mt-4 space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-black transition rounded bg-buttonsHover hover:bg-buttons disabled:bg-gray-500"
                >
                  {editingRegistroId
                    ? "Salvar Alterações"
                    : "Adicionar Registro"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-white transition bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Registros */}
      <div className="rounded-xl">
        {loading ? (
          <p>Carregando registros...</p>
        ) : Object.keys(groupedAndSortedRegistros).length > 0 ? (
          <div className="space-y-8">
            {Object.keys(groupedAndSortedRegistros).map((userId) => {
              const userName =
                usuarios.find((u) => u.id === userId)?.nome ||
                "Usuário Desconhecido";
              const { Positiva, Negativa } = groupedAndSortedRegistros[userId];

              return (
                <div
                  key={userId}
                  className="border-border border-[1px] p-6 rounded-2xl"
                >
                  <h4 className="mb-4 text-2xl font-bold text-text">
                    {userName}
                  </h4>

                  {Positiva.length > 0 && (
                    <div className="">
                      <h5 className="mb-2 text-lg font-semibold text-green-400">
                        Positiva
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                          <thead className="bg-containers text-text">
                            <tr>
                              <th className="px-4 py-3 w-[100px]">Natureza</th>
                              <th className="px-4 py-3 w-[200px]">Tipo</th>
                              <th className="px-4 py-3 w-[150px]">Subtipo</th>
                              <th className="px-4 py-3 w-[600px]">Descrição</th>
                              <th className="px-4 py-3 w-[100px]">Data</th>
                              <th className="px-4 py-3 text-center w-[100px]">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-background">
                            {Positiva.map((reg) => (
                              <tr
                                key={reg.id}
                                className="border-t border-border hover:bg-containers/20"
                              >
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold capitalize rounded-full bg-green-500/20 text-green-300`}
                                  >
                                    {reg.natureza}
                                  </span>
                                </td>
                                <td className="px-4 py-3">{reg.tipo}</td>
                                <td className="px-4 py-3">{reg.subtipo}</td>
                                <td className="px-4 py-3">
                                  <TruncatedText text={reg.descricao} />
                                </td>
                                <td className="px-4 py-3">
                                  {formatDate(reg.data)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleEdit(reg)}
                                      className="p-1 text-blue-400 hover:text-blue-300"
                                      title="Editar"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(reg.id)}
                                      className="p-1 text-red-500 hover:text-red-400"
                                      title="Excluir"
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
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {Negativa.length > 0 && (
                    <div>
                      <h5 className="mb-2 text-lg font-semibold text-red-400">
                        Negativa
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                          <thead className="bg-containers text-text">
                            <tr>
                              <th className="px-4 py-3 w-[100px]">Natureza</th>
                              <th className="px-4 py-3 w-[200px]">Tipo</th>
                              <th className="px-4 py-3 w-[150px]">Subtipo</th>
                              <th className="px-4 py-3 w-[600px]">Descrição</th>
                              <th className="px-4 py-3 w-[100px]">Data</th>
                              <th className="px-4 py-3 text-center w-[100px]">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-background">
                            {Negativa.map((reg) => (
                              <tr
                                key={reg.id}
                                className="border-t border-border hover:bg-containers/20"
                              >
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold capitalize rounded-full bg-red-500/20 text-red-300`}
                                  >
                                    {reg.natureza}
                                  </span>
                                </td>
                                <td className="px-4 py-3">{reg.tipo}</td>
                                <td className="px-4 py-3">{reg.subtipo}</td>
                                <td className="px-4 py-3">
                                  <TruncatedText text={reg.descricao} />
                                </td>
                                <td className="px-4 py-3">
                                  {formatDate(reg.data)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleEdit(reg)}
                                      className="p-1 text-blue-400 hover:text-blue-300"
                                      title="Editar"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(reg.id)}
                                      className="p-1 text-red-500 hover:text-red-400"
                                      title="Excluir"
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
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Nenhum registro de desempenho encontrado.</p>
        )}
      </div>
    </div>
  );
}
