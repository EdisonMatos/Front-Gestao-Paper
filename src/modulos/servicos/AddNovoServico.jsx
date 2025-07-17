// AddNovoServico.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";
const CLIENTES_URL = "https://backend-gestao-paper.onrender.com/clientes";

export default function AddNovoServico({
  servicoParaEditar = null,
  onSalvo,
  onCancelar,
}) {
  const [form, setForm] = useState({
    id: null,
    nome: "",
    clienteId: "",
    clienteNome: "",
    linkDoc: "",
    linkPreviaVercel: "",
    turnoDaVez: "",
    comentariosTexto: "", // ainda presente no state
    dataContratacao: "",
    dataInfosColetadas: "",
    dataDocPronto: "",
    dataEnvioPrevia: "",
    dataConclusao: "",
    dataProximoPrazo: "",
  });

  const [clienteBusca, setClienteBusca] = useState("");
  const [sugestoesClientes, setSugestoesClientes] = useState([]);

  useEffect(() => {
    if (servicoParaEditar) {
      setForm({
        id: servicoParaEditar.id,
        nome: servicoParaEditar.nome || "",
        clienteId: servicoParaEditar.clienteId || "",
        clienteNome: servicoParaEditar.cliente?.empresa || "",
        linkDoc: servicoParaEditar.linkDoc || "",
        linkPreviaVercel: servicoParaEditar.linkPreviaVercel || "",
        turnoDaVez: servicoParaEditar.turnoDaVez || "",
        comentariosTexto: servicoParaEditar.comentariosTexto || "",
        dataContratacao: servicoParaEditar.dataContratacao
          ? servicoParaEditar.dataContratacao.substring(0, 10)
          : "",
        dataInfosColetadas: servicoParaEditar.dataInfosColetadas
          ? servicoParaEditar.dataInfosColetadas.substring(0, 10)
          : "",
        dataDocPronto: servicoParaEditar.dataDocPronto
          ? servicoParaEditar.dataDocPronto.substring(0, 10)
          : "",
        dataEnvioPrevia: servicoParaEditar.dataEnvioPrevia
          ? servicoParaEditar.dataEnvioPrevia.substring(0, 10)
          : "",
        dataConclusao: servicoParaEditar.dataConclusao
          ? servicoParaEditar.dataConclusao.substring(0, 10)
          : "",
        dataProximoPrazo: servicoParaEditar.dataProximoPrazo
          ? servicoParaEditar.dataProximoPrazo.substring(0, 10)
          : "",
      });
      setClienteBusca(servicoParaEditar.cliente?.empresa || "");
    }
  }, [servicoParaEditar]);

  useEffect(() => {
    const buscarClientes = async (termo) => {
      if (!termo) {
        setSugestoesClientes([]);
        return;
      }
      try {
        const res = await axios.get(CLIENTES_URL);
        const filtrados = res.data.filter(
          (cliente) =>
            cliente.empresa.toLowerCase().includes(termo.toLowerCase()) ||
            cliente.representante.toLowerCase().includes(termo.toLowerCase())
        );
        setSugestoesClientes(filtrados.slice(0, 3));
      } catch (err) {
        console.error("Erro ao buscar clientes", err);
      }
    };

    if (clienteBusca.length > 1) {
      buscarClientes(clienteBusca);
    } else {
      setSugestoesClientes([]);
    }
  }, [clienteBusca]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form };
      delete payload.clienteNome;

      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, payload);
        toast.success("Serviço atualizado com sucesso!", { autoClose: 1000 });
        onSalvo();
      } else {
        await axios.post(API_URL, payload);
        toast.success("Serviço adicionado com sucesso!", { autoClose: 1000 });
        window.location.reload(); // 🔁 refresh após adicionar novo serviço
      }
    } catch (err) {
      toast.error("Erro ao salvar serviço.", { autoClose: 1000 });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded border-border md:grid-cols-3 bg-background text-text"
    >
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Nome do serviço*</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="relative flex flex-col">
        <label className="mb-1 text-sm font-medium">Selecione o Cliente*</label>
        <input
          type="text"
          value={form.clienteNome || clienteBusca}
          onChange={(e) => {
            setClienteBusca(e.target.value);
            setForm((prev) => ({
              ...prev,
              clienteId: "",
              clienteNome: e.target.value,
            }));
          }}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
          placeholder="Digite o nome da empresa ou representante"
        />
        {sugestoesClientes.length > 0 && (
          <ul className="absolute z-10 w-full border rounded shadow bg-background">
            {sugestoesClientes.map((cliente) => (
              <li
                key={cliente.id}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    clienteId: cliente.id,
                    clienteNome: `${cliente.empresa} | ${cliente.representante}`,
                  }));
                  setSugestoesClientes([]);
                }}
                className="px-2 py-1 cursor-pointer hover:bg-inputBg"
              >
                {cliente.empresa} | {cliente.representante}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Turno da Vez*</label>
        <select
          name="turnoDaVez"
          value={form.turnoDaVez}
          onChange={handleChange}
          required
          className="p-2 border rounded text-placeholder bg-inputBg"
        >
          <option value="">Selecione</option>
          <option value="dev">Dev</option>
          <option value="suporte">Suporte</option>
          <option value="webmaster">Webmaster</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Data de Contratação*</label>
        <input
          type="date"
          name="dataContratacao"
          value={form.dataContratacao}
          onChange={handleChange}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      {/* Campos opcionais */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Link do Documento</label>
        <input
          name="linkDoc"
          value={form.linkDoc}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Link Prévia Vercel</label>
        <input
          name="linkPreviaVercel"
          value={form.linkPreviaVercel}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
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
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
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
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
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
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Data de Conclusão</label>
        <input
          type="date"
          name="dataConclusao"
          value={form.dataConclusao}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
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
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex col-span-1 gap-4 md:col-span-3">
        <button
          type="submit"
          className="p-2 text-white transition rounded bg-buttons hover:bg-buttonsHover"
        >
          {form.id ? "Atualizar Serviço" : "Adicionar Serviço"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="p-2 text-white transition rounded bg-secondaryButtons hover:bg-secondaryButtonsHover"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
