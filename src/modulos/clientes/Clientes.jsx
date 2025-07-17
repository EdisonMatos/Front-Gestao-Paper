import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddNovoCliente from "./AddNovoCliente";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  const fetchClientes = async () => {
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

  const clientesFiltrados = clientes
    .filter(
      (c) =>
        c.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
        c.representante.toLowerCase().includes(filtro.toLowerCase())
    )
    .slice(0, 3);

  const handleEdit = (cliente) => {
    setClienteParaEditar(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const cliente = clientes.find((c) => c.id === id);

    if (cliente.servicos && cliente.servicos.length > 0) {
      alert(
        `Este cliente possui ${cliente.servicos.length} serviço(s) vinculado(s).\n\n` +
          `Exclua os serviços individualmente antes de apagar o cliente.`
      );
      return;
    }

    if (confirm("Deseja realmente excluir este cliente?")) {
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
      <h2 className="mb-4 text-2xl font-bold text-text">Gestão de Clientes</h2>
      <input
        type="text"
        placeholder="Pesquisar por empresa ou representante..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/4 bg-inputBg text-placeholder border-border"
      />
      {!showForm ? (
        <button
          onClick={handleAdicionarNovo}
          className="px-4 py-2 mb-4 ml-4 text-white rounded bg-buttons hover:bg-buttonsHover"
        >
          Adicionar novo cliente
        </button>
      ) : (
        <button
          onClick={resetForm}
          className="px-4 py-2 mb-4 ml-4 text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      )}

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

      {filtro.trim() !== "" && clientesFiltrados.length > 0 && (
        <div className="overflow-x-auto text-text">
          <table className="min-w-full text-sm text-left border border-border">
            <thead className="bg-containers border-solid border-[1px] border-containers">
              <tr className="">
                <th className="p-2 border border-containers">Empresa</th>
                <th className="p-2 border border-containers">Representante</th>
                <th className="p-2 border border-containers">Telefone</th>
                <th className="p-2 border border-containers">Email</th>
                <th className="p-2 border border-containers">Domínio</th>
                <th className="p-2 border border-containers">Serviços</th>
                <th className="p-2 border border-containers">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="hover:bg-[#2E2C33] border-border"
                >
                  <td className="p-2 border border-border">
                    {cliente.empresa}
                  </td>
                  <td className="p-2 border border-border">
                    {cliente.representante}
                  </td>
                  <td className="p-2 border border-border">
                    {cliente.telefone}
                  </td>
                  <td className="p-2 border border-border">{cliente.email}</td>
                  <td className="p-2 border border-border">
                    {cliente.dominio}
                  </td>
                  <td className="p-2 border border-border">
                    {cliente.servicos?.length || 0} serviço(s)
                    <ul className="pl-4 mt-1 text-xs list-disc">
                      {cliente.servicos?.map((servico) => (
                        <li key={servico.id}>{servico.nome}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 space-x-2 border border-border">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="text-links hover:underline"
                    >
                      Editar
                    </button>
                    {/* <button
                      onClick={() => handleDelete(cliente.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtro.trim() !== "" && clientesFiltrados.length === 0 && (
        <p className="mt-4 text-left text-text opacity-60">
          Nenhum resultado encontrado.
        </p>
      )}
    </div>
  );
}
