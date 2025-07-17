// components/AcoesCardServico.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function AcoesCardServico({
  servico,
  turno,
  capitalizar,
  onFechar,
}) {
  const [acaoSelecionada, setAcaoSelecionada] = useState("");
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [comentarioDirecionar, setComentarioDirecionar] = useState("");
  const [novaDataPrazo, setNovaDataPrazo] = useState("");
  const [loading, setLoading] = useState(false);

  const direcionarServico = async () => {
    if (!comentarioDirecionar.trim()) return alert("Comentário é obrigatório.");
    if (!setorSelecionado) return alert("Setor é obrigatório.");

    setLoading(true);
    try {
      await axios.post(
        "https://backend-gestao-paper.onrender.com/comentarios",
        {
          servicoId: servico.id,
          texto: comentarioDirecionar.trim(),
          feitoPor: capitalizar(turno),
          setor: turno,
        }
      );

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          turnoDaVez: setorSelecionado,
          posicaoNoQuadro: null,
        }
      );

      toast.success("Direcionado com sucesso!", { autoClose: 1000 });
      onFechar();
    } catch (err) {
      console.error("Erro ao direcionar:", err);
      alert("Erro ao direcionar serviço.");
    } finally {
      setLoading(false);
    }
  };

  const mudarPrazo = async () => {
    if (!novaDataPrazo) return alert("Selecione uma nova data.");

    setLoading(true);
    try {
      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          dataProximoPrazo: novaDataPrazo,
        }
      );

      toast.success("Prazo alterado com sucesso!", { autoClose: 1000 });
      onFechar();
    } catch (err) {
      console.error("Erro ao mudar prazo:", err);
      alert("Erro ao mudar prazo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-2 space-y-2 text-sm">
      <select
        value={acaoSelecionada}
        onChange={(e) => setAcaoSelecionada(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
      >
        <option value="">Selecione a ação:</option>
        <option value="direcionar">Direcionar serviço</option>
        <option value="mudarPrazo">Mudar prazo</option>
      </select>

      {acaoSelecionada === "direcionar" && (
        <>
          <select
            value={setorSelecionado}
            onChange={(e) => setSetorSelecionado(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione o setor:</option>
            <option value="suporte">Suporte</option>
            <option value="dev">Dev</option>
            <option value="webmaster">Webmaster</option>
            <option value="feedbacks">Feedbacks</option>
          </select>

          <input
            type="text"
            value={comentarioDirecionar}
            onChange={(e) => setComentarioDirecionar(e.target.value)}
            placeholder="Adicione um comentário"
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          />

          <div className="flex gap-2">
            <button
              onClick={direcionarServico}
              disabled={loading}
              className="px-2 py-1 text-sm text-white rounded bg-buttons hover:bg-buttonsHover"
            >
              {loading ? "Enviando..." : "Direcionar"}
            </button>
            <button
              onClick={onFechar}
              className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {acaoSelecionada === "mudarPrazo" && (
        <>
          <label className="block text-text">Selecione a nova data:</label>
          <input
            type="date"
            value={novaDataPrazo}
            onChange={(e) => setNovaDataPrazo(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          />

          <div className="flex gap-2">
            <button
              onClick={mudarPrazo}
              disabled={loading}
              className="px-2 py-1 text-sm text-white rounded bg-buttons hover:bg-buttonsHover"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={onFechar}
              className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
