import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddNovoServico from "./AddNovoServico"; // import novo componente
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";
const API_COMENTARIOS_URL =
  "https://backend-gestao-paper.onrender.com/comentarios";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState(null);

  const fetchServicos = async () => {
    try {
      const res = await axios.get(API_URL);
      setServicos(res.data);
    } catch (err) {
      toast.error("Erro ao carregar serviços.", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const servicosFiltrados = servicos
    .filter(
      (s) =>
        s.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        s.cliente?.empresa?.toLowerCase().includes(filtro.toLowerCase())
    )
    .slice(0, 3);

  const handleEdit = (servico) => {
    setServicoParaEditar(servico);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const resComentarios = await axios.get(API_COMENTARIOS_URL);
      const comentarios = resComentarios.data.filter((c) => c.servicoId === id);

      let mensagemConfirm = "Deseja realmente excluir este serviço?";

      if (comentarios.length > 0) {
        mensagemConfirm =
          `Este serviço possui ${comentarios.length} comentário(s).\n` +
          `Ao excluir, TODOS os comentários relacionados também serão removidos.\n\n` +
          "Deseja continuar e excluir tudo?";
      }

      if (!confirm(mensagemConfirm)) {
        return;
      }

      if (comentarios.length > 0) {
        await Promise.all(
          comentarios.map((comentario) =>
            axios.delete(`${API_COMENTARIOS_URL}/${comentario.id}`)
          )
        );
      }

      await axios.delete(`${API_URL}/${id}`);
      toast.success("Serviço e comentários excluídos com sucesso!", {
        autoClose: 1000,
      });
      fetchServicos();
    } catch (err) {
      toast.error("Erro ao excluir serviço.", { autoClose: 1000 });
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
      <h2 className="mb-4 text-2xl font-bold text-text">Gestão de Serviços</h2>

      <input
        type="text"
        placeholder="Pesquisar por serviço ou empresa..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded md:w-1/4 bg-inputBg text-placeholder border-border"
      />

      {!showForm && (
        <button
          onClick={() => {
            setServicoParaEditar(null);
            setShowForm(true);
          }}
          className="px-4 py-2 mb-4 ml-4 text-white transition rounded bg-buttons hover:bg-buttonsHover"
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

      {filtro.trim() !== "" && servicosFiltrados.length > 0 && (
        <div className="overflow-x-auto text-text">
          <table className="min-w-full text-sm text-left border border-border">
            <thead className="bg-containers border-solid border-[1px] border-containers text-text">
              <tr>
                <th className="p-2 border border-containers">Nome</th>
                <th className="p-2 border border-containers">Empresa</th>
                <th className="p-2 border border-containers">Turno</th>
                <th className="p-2 border border-containers">Doc</th>
                <th className="p-2 border border-containers">Prévia</th>
                <th className="p-2 border border-containers">Datas</th>
                <th className="p-2 border border-containers">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicosFiltrados.map((servico) => (
                <tr key={servico.id} className="hover:bg-[#2E2C33] ">
                  <td className="p-2 border border-border">{servico.nome}</td>
                  <td className="p-2 border border-border">
                    {servico.cliente?.empresa || "Sem cliente"}
                  </td>
                  <td className="p-2 border border-border">
                    {servico.turnoDaVez}
                  </td>
                  <td className="p-2 border border-border">
                    <a
                      href={servico.linkDoc}
                      target="_blank"
                      rel="noreferrer"
                      className="text-links hover:underline"
                    >
                      Doc
                    </a>
                  </td>
                  <td className="p-2 border border-border">
                    <a
                      href={servico.linkPreviaVercel}
                      target="_blank"
                      rel="noreferrer"
                      className="text-links hover:underline"
                    >
                      Prévia
                    </a>
                  </td>
                  <td className="p-2 text-xs border border-border">
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
                  <td className="p-2 space-x-2 border border-border">
                    <button
                      onClick={() => handleEdit(servico)}
                      className="text-links hover:underline"
                    >
                      Editar
                    </button>
                    {/* <button
                      onClick={() => handleDelete(servico.id)}
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

      {filtro.trim() !== "" && servicosFiltrados.length === 0 && (
        <p className="mt-4 text-left text-text opacity-60">
          Nenhum resultado encontrado.
        </p>
      )}
    </div>
  );
}
