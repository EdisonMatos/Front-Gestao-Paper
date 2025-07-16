import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AddNovoCliente from "./AddNovoCliente";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  const fetchClientes = async () => {
    // Removi toast.loading
    try {
      const res = await axios.get(API_URL);
      setClientes(res.data);
    } catch (err) {
      toast.error("Erro ao carregar clientes.", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
      c.representante.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEdit = (cliente) => {
    setClienteParaEditar(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir este cliente?")) {
      // Removi toast.loading
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Cliente excluído com sucesso!", { autoClose: 1000 });
        fetchClientes();
      } catch (err) {
        toast.error("Erro ao excluir cliente.", { autoClose: 1000 });
      }
    }
  };

  const handleAdicionarNovo = () => {
    setClienteParaEditar(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setClienteParaEditar(null);
    setShowForm(false);
  };

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
      {!showForm ? (
        <button
          onClick={handleAdicionarNovo}
          className="px-4 py-2 mb-4 text-white bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Adicionar novo cliente
        </button>
      ) : (
        <button
          onClick={resetForm}
          className="px-4 py-2 mb-4 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      )}

      {/* Formulário */}
      {showForm && (
        <AddNovoCliente
          clienteParaEditar={clienteParaEditar}
          onSalvo={() => {
            resetForm();
            fetchClientes();
          }}
          onCancelar={resetForm}
        />
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
                    className="text-yellow-600 hover:underline"
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
