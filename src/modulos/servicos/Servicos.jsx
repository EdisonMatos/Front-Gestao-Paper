import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    clienteId: "",
    linkDoc: "",
    linkPreviaVercel: "",
    turnoDaVez: "",
    comentariosTexto: "",
    dataContratacao: "",
    dataInfosColetadas: "",
    dataDocPronto: "",
    dataEnvioPrevia: "",
    dataConclusao: "",
    dataProximoPrazo: "",
  });

  const fetchServicos = async () => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      form.id ? "Atualizando serviço..." : "Adicionando serviço..."
    );
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, form);
        toast.update(loadingToast, {
          render: "Serviço atualizado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await axios.post(API_URL, form);
        toast.update(loadingToast, {
          render: "Serviço adicionado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      resetForm();
      fetchServicos();
    } catch (err) {
      toast.update(loadingToast, {
        render: "Erro ao salvar serviço.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (servico) => {
    setForm({
      id: servico.id,
      nome: servico.nome,
      clienteId: servico.clienteId,
      linkDoc: servico.linkDoc,
      linkPreviaVercel: servico.linkPreviaVercel,
      turnoDaVez: servico.turnoDaVez,
      comentariosTexto: servico.comentariosTexto,
      dataContratacao: servico.dataContratacao?.substring(0, 10) || "",
      dataInfosColetadas: servico.dataInfosColetadas?.substring(0, 10) || "",
      dataDocPronto: servico.dataDocPronto?.substring(0, 10) || "",
      dataEnvioPrevia: servico.dataEnvioPrevia?.substring(0, 10) || "",
      dataConclusao: servico.dataConclusao?.substring(0, 10) || "",
      dataProximoPrazo: servico.dataProximoPrazo?.substring(0, 10) || "",
    });
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
    setForm({
      id: null,
      nome: "",
      clienteId: "",
      linkDoc: "",
      linkPreviaVercel: "",
      turnoDaVez: "",
      comentariosTexto: "",
      dataContratacao: "",
      dataInfosColetadas: "",
      dataDocPronto: "",
      dataEnvioPrevia: "",
      dataConclusao: "",
      dataProximoPrazo: "",
    });
    setShowForm(false);
  };

  const servicosFiltrados = servicos.filter(
    (s) =>
      s.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      s.cliente?.empresa?.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "-";

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-bold">Gestão de Serviços</h2>

      {/* Botão para mostrar formulário */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 mb-4 text-white transition bg-green-600 rounded hover:bg-green-700"
        >
          Adicionar novo serviço
        </button>
      )}

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Pesquisar por serviço ou empresa..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/2"
      />

      {/* Formulário */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded md:grid-cols-3 bg-gray-50"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Nome do serviço</label>
            <input
              name="nome"
              placeholder="Nome do serviço"
              value={form.nome}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">ID do Cliente</label>
            <input
              name="clienteId"
              placeholder="ID do Cliente"
              value={form.clienteId}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Turno da Vez</label>
            <input
              name="turnoDaVez"
              placeholder="Turno da Vez"
              value={form.turnoDaVez}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Link do Documento
            </label>
            <input
              name="linkDoc"
              placeholder="Link Doc"
              value={form.linkDoc}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Link Prévia Vercel
            </label>
            <input
              name="linkPreviaVercel"
              placeholder="Link Prévia Vercel"
              value={form.linkPreviaVercel}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Comentário</label>
            <input
              name="comentariosTexto"
              placeholder="Comentário"
              value={form.comentariosTexto}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Contratação
            </label>
            <input
              type="date"
              name="dataContratacao"
              value={form.dataContratacao}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Coleta de Informações
            </label>
            <input
              type="date"
              name="dataInfosColetadas"
              value={form.dataInfosColetadas}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data do Documento Pronto
            </label>
            <input
              type="date"
              name="dataDocPronto"
              value={form.dataDocPronto}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Envio da Prévia
            </label>
            <input
              type="date"
              name="dataEnvioPrevia"
              value={form.dataEnvioPrevia}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Conclusão
            </label>
            <input
              type="date"
              name="dataConclusao"
              value={form.dataConclusao}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data do Próximo Prazo
            </label>
            <input
              type="date"
              name="dataProximoPrazo"
              value={form.dataProximoPrazo}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex col-span-1 gap-4 md:col-span-3">
            <button
              type="submit"
              className="p-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
            >
              {form.id ? "Atualizar Serviço" : "Adicionar Serviço"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-black transition bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabela */}
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
                    className="text-blue-600 hover:underline"
                  >
                    Doc
                  </a>
                </td>
                <td className="p-2 border">
                  <a
                    href={servico.linkPreviaVercel}
                    target="_blank"
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
