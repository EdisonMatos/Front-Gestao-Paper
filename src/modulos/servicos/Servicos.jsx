import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";
const API_CLIENTES = "https://backend-gestao-paper.onrender.com/clientes";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clienteBusca, setClienteBusca] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

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

  useEffect(() => {
    fetchServicos();
    fetchClientes();
  }, []);

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

  const fetchClientes = async () => {
    try {
      const res = await axios.get(API_CLIENTES);
      setClientes(res.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  // Atualiza o filtro e lista de clientes para autocomplete conforme digita
  useEffect(() => {
    if (!clienteBusca.trim()) {
      setClientesFiltrados([]);
      return;
    }
    const busca = clienteBusca.toLowerCase();
    const encontrados = clientes
      .filter(
        (c) =>
          c.empresa?.toLowerCase().includes(busca) ||
          c.representante?.toLowerCase().includes(busca)
      )
      .slice(0, 3);
    setClientesFiltrados(encontrados);
  }, [clienteBusca, clientes]);

  // Ao escolher cliente no autocomplete
  const handleClienteSelect = (cliente) => {
    setForm({ ...form, clienteId: cliente.id });
    setClienteBusca(`${cliente.empresa} | ${cliente.representante}`);
    setClientesFiltrados([]);
  };

  // Para resetar o cliente na edição/limpar
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
    setClienteBusca("");
    setClientesFiltrados([]);
    setShowForm(false);
  };

  // Atualiza o form normalmente
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Na edição, já preenche também o campo clienteBusca para mostrar texto
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

    const cliente = clientes.find((c) => c.id === servico.clienteId);
    if (cliente) {
      setClienteBusca(`${cliente.empresa} | ${cliente.representante}`);
    } else {
      setClienteBusca("");
    }

    setClientesFiltrados([]);
    setShowForm(true);
  };

  // Validação no submit para obrigatórios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome.trim()) {
      return toast.error("Nome do serviço é obrigatório");
    }
    if (!form.clienteId) {
      return toast.error("Selecione um cliente válido");
    }
    if (!["dev", "webmaster", "suporte"].includes(form.turnoDaVez)) {
      return toast.error(
        "Turno da vez é obrigatório e deve ser dev, webmaster ou suporte"
      );
    }
    if (!form.dataContratacao) {
      return toast.error("Data de contratação é obrigatória");
    }

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

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Pesquisar por serviço ou empresa..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/2"
      />

      {/* Botão para mostrar formulário */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 mb-4 text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Adicionar novo serviço
        </button>
      )}

      {/* Formulário */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="relative grid grid-cols-1 gap-4 p-4 mb-6 border rounded md:grid-cols-3 bg-gray-50"
          autoComplete="off"
        >
          {/* Nome do serviço */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Nome do serviço *
            </label>
            <input
              name="nome"
              placeholder="Nome do serviço"
              value={form.nome}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          {/* Cliente - campo autocomplete */}
          <div className="relative flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Selecione o cliente *
            </label>
            <input
              type="text"
              placeholder="Digite para buscar cliente..."
              value={clienteBusca}
              onChange={(e) => {
                setClienteBusca(e.target.value);
                setForm({ ...form, clienteId: "" });
              }}
              className="p-2 border rounded"
              required
              autoComplete="off"
            />
            {clientesFiltrados.length > 0 && (
              <ul className="absolute z-10 w-full overflow-auto bg-white border rounded shadow-md max-h-40">
                {clientesFiltrados.map((cliente) => (
                  <li
                    key={cliente.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleClienteSelect(cliente)}
                  >
                    {cliente.empresa} | {cliente.representante}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Turno da vez */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Turno da Vez *</label>
            <select
              name="turnoDaVez"
              value={form.turnoDaVez}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            >
              <option value="">Selecione</option>
              <option value="dev">dev</option>
              <option value="webmaster">webmaster</option>
              <option value="suporte">suporte</option>
            </select>
          </div>

          {/* Data de contratação */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Contratação *
            </label>
            <input
              type="date"
              name="dataContratacao"
              value={form.dataContratacao}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          {/* Campos opcionais */}
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

          <div className="flex col-span-1 gap-4 md:col-span-3">
            <button
              type="submit"
              className="p-2 text-white transition bg-yellow-600 rounded hover:bg-yellow-600"
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
                  {servico.linkDoc ? (
                    <a
                      href={servico.linkDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:underline"
                    >
                      Doc
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border">
                  {servico.linkPreviaVercel ? (
                    <a
                      href={servico.linkPreviaVercel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:underline"
                    >
                      Prévia
                    </a>
                  ) : (
                    "-"
                  )}
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
                  {servico.comentariosTexto || "-"}
                </td>
                <td className="p-2 space-x-2 border">
                  <button
                    onClick={() => handleEdit(servico)}
                    className="text-yellow-600 hover:underline"
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
