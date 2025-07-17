// components/AcoesCardServico.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Função para converter ISO datetime para string yyyy-mm-dd para input type=date
function toInputDateString(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset).toISOString();
  return localISO.split("T")[0];
}

// Função para converter string yyyy-mm-dd do input para objeto Date local
function fromInputDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function AcoesCardServico({
  servico,
  turno,
  capitalizar,
  onFechar,
  onAtualizarPrazo, // RECEBENDO PROP NOVA PRAZO
  onAtualizarComplexidade, // NOVA PROP PRA COMPLEXIDADE
}) {
  const [acaoSelecionada, setAcaoSelecionada] = useState("");
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [comentarioDirecionar, setComentarioDirecionar] = useState("");
  const [novaDataPrazo, setNovaDataPrazo] = useState(
    toInputDateString(servico.dataProximoPrazo)
  );
  const [novaComplexidade, setNovaComplexidade] = useState(
    servico.complexidade !== null ? servico.complexidade.toString() : ""
  );
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
      setTimeout(() => {
        window.location.reload();
      }, 2000);

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
      const novaDataISO = fromInputDateString(novaDataPrazo).toISOString();

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          dataProximoPrazo: novaDataISO,
        }
      );

      toast.success("Prazo alterado com sucesso!", { autoClose: 1000 });

      // Atualiza estado no componente pai
      onAtualizarPrazo(novaDataISO);

      onFechar();
    } catch (err) {
      console.error("Erro ao mudar prazo:", err);
      alert("Erro ao mudar prazo.");
    } finally {
      setLoading(false);
    }
  };

  const mudarComplexidade = async () => {
    if (!novaComplexidade) return alert("Selecione uma complexidade.");

    setLoading(true);
    try {
      const complexidadeFloat = parseFloat(novaComplexidade);

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          complexidade: complexidadeFloat,
        }
      );

      toast.success("Complexidade alterada com sucesso!", { autoClose: 1000 });

      // Atualiza estado no componente pai
      onAtualizarComplexidade(complexidadeFloat);

      onFechar();
    } catch (err) {
      console.error("Erro ao mudar complexidade:", err);
      alert("Erro ao mudar complexidade.");
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
        <option value="mudarComplexidade">Mudar complexidade</option>
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

      {acaoSelecionada === "mudarComplexidade" && (
        <>
          <label className="block text-text">Selecione a complexidade:</label>
          <select
            value={novaComplexidade}
            onChange={(e) => setNovaComplexidade(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione a complexidade</option>
            <option value="1">1 - Muito simples</option>
            <option value="2">2 - Simples</option>
            <option value="3">3 - Moderada</option>
            <option value="4">4 - Demorada</option>
            <option value="5">5 - Muito complexa</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={mudarComplexidade}
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
