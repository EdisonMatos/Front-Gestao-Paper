import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AddNovoServico from "./AddNovoServico"; // import novo componente
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState(null);

  const fetchServicos = async () => {
    const loadingToast = toast.loading("Carregando serviços...");
    try {
      const res = await axios.get(API_URL);
      setServicos(res.data);
      toast.update(loadingToast, {
        render: "Serviços carregados com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: "Erro ao carregar serviços.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const servicosFiltrados = servicos.filter(
    (s) =>
      s.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      s.cliente?.empresa?.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEdit = (servico) => {
    setServicoParaEditar(servico);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir este serviço?")) {
      const loadingToast = toast.loading("Excluindo serviço...");
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.update(loadingToast, {
          render: "Serviço excluído com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        fetchServicos();
      } catch (err) {
        toast.update(loadingToast, {
          render: "Erro ao excluir serviço.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const resetForm = () => {
    setServicoParaEditar(null);
    setShowForm(false);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "-";

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-bold">Gestão de Serviços</h2>

      <input
        type="text"
        placeholder="Pesquisar por serviço ou empresa..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/2"
      />

      {!showForm && (
        <button
          onClick={() => {
            setServicoParaEditar(null);
            setShowForm(true);
          }}
          className="px-4 py-2 mb-4 text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Adicionar novo serviço
        </button>
      )}

      {showForm && (
        <AddNovoServico
          servicoParaEditar={servicoParaEditar}
          onSalvo={() => {
            resetForm();
            fetchServicos();
          }}
          onCancelar={resetForm}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">Empresa</th>
              <th className="p-2 border">Turno</th>
              <th className="p-2 border">Doc</th>
              <th className="p-2 border">Prévia</th>
              <th className="p-2 border">Datas</th>
              <th className="p-2 border">Comentário</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicosFiltrados.map((servico) => (
              <tr key={servico.id} className="hover:bg-gray-50">
                <td className="p-2 border">{servico.nome}</td>
                <td className="p-2 border">
                  {servico.cliente?.empresa || "Sem cliente"}
                </td>
                <td className="p-2 border">{servico.turnoDaVez}</td>
                <td className="p-2 border">
                  <a
                    href={servico.linkDoc}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Doc
                  </a>
                </td>
                <td className="p-2 border">
                  <a
                    href={servico.linkPreviaVercel}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Prévia
                  </a>
                </td>
                <td className="p-2 text-xs border">
                  <div>
                    <strong>Contratação:</strong>{" "}
                    {formatDate(servico.dataContratacao)}
                  </div>
                  <div>
                    <strong>Infos Coletadas:</strong>{" "}
                    {formatDate(servico.dataInfosColetadas)}
                  </div>
                  <div>
                    <strong>Doc Pronto:</strong>{" "}
                    {formatDate(servico.dataDocPronto)}
                  </div>
                  <div>
                    <strong>Prévia Enviada:</strong>{" "}
                    {formatDate(servico.dataEnvioPrevia)}
                  </div>
                  <div>
                    <strong>Conclusão:</strong>{" "}
                    {formatDate(servico.dataConclusao)}
                  </div>
                  <div>
                    <strong>Próximo Prazo:</strong>{" "}
                    {formatDate(servico.dataProximoPrazo)}
                  </div>
                </td>
                <td className="p-2 text-xs text-gray-600 border">
                  {servico.comentariosTexto}
                </td>
                <td className="p-2 space-x-2 border">
                  <button
                    onClick={() => handleEdit(servico)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(servico.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {servicosFiltrados.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
