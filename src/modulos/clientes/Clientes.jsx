import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    empresa: "",
    representante: "",
    telefone: "",
    email: "",
    dominio: "",
  });

  const fetchClientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setClientes(res.data);
      toast.update(loadingToast, {
        render: "Clientes carregados com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: "Erro ao carregar clientes.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      empresa: "",
      representante: "",
      telefone: "",
      email: "",
      dominio: "",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      form.id ? "Atualizando cliente..." : "Adicionando cliente..."
    );
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, form);
        toast.update(loadingToast, {
          render: "Cliente atualizado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await axios.post(API_URL, form);
        toast.update(loadingToast, {
          render: "Cliente adicionado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      resetForm();
      fetchClientes();
    } catch (err) {
      toast.update(loadingToast, {
        render: "Erro ao salvar cliente.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir este cliente?")) {
      const loadingToast = toast.loading("Excluindo cliente...");
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.update(loadingToast, {
          render: "Cliente excluído com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        fetchClientes();
      } catch (err) {
        toast.update(loadingToast, {
          render: "Erro ao excluir cliente.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
      c.representante.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-bold">Gestão de Clientes</h2>
      {/* Pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar por empresa ou representante..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/2"
      />
      {/* Botão mostrar formulário */}
      <button
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setForm({
              id: null,
              empresa: "",
              representante: "",
              telefone: "",
              email: "",
              dominio: "",
            });
            setShowForm(true);
          }
        }}
        className="px-4 py-2 mb-4 text-white bg-green-600 rounded hover:bg-green-700"
      >
        {showForm ? "Cancelar" : "Adicionar novo cliente"}
      </button>
      {/* Formulário */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded md:grid-cols-3 bg-gray-50"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Empresa</label>
            <input
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Representante</label>
            <input
              name="representante"
              value={form.representante}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Domínio</label>
            <input
              name="dominio"
              value={form.dominio}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
            >
              {form.id ? "Atualizar Cliente" : "Adicionar Cliente"}
            </button>
          </div>
        </form>
      )}
      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Empresa</th>
              <th className="p-2 border">Representante</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Domínio</th>
              <th className="p-2 border">Serviços</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="p-2 border">{cliente.empresa}</td>
                <td className="p-2 border">{cliente.representante}</td>
                <td className="p-2 border">{cliente.telefone}</td>
                <td className="p-2 border">{cliente.email}</td>
                <td className="p-2 border">{cliente.dominio}</td>
                <td className="p-2 border">
                  {cliente.servicos?.length || 0} serviço(s)
                  <ul className="pl-4 mt-1 text-xs text-gray-600 list-disc">
                    {cliente.servicos?.map((servico) => (
                      <li key={servico.id}>{servico.nome}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 space-x-2 border">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
