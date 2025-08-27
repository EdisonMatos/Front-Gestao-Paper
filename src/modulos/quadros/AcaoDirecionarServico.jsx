import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Função para converter string yyyy-mm-dd do input para objeto Date local
function fromInputDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function AcaoDirecionarServico({
  servico,
  turno,
  capitalizar,
  onFechar,
}) {
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [comentarioDirecionar, setComentarioDirecionar] = useState("");
  const [novaComplexidadeDirecionar, setNovaComplexidadeDirecionar] =
    useState("");
  const [novaDataPrazo, setNovaDataPrazo] = useState(
    servico.dataProximoPrazo
      ? new Date(servico.dataProximoPrazo).toISOString().split("T")[0]
      : ""
  );
  const [novoPrazoProjeto, setNovoPrazoProjeto] = useState(""); // campo novo para prazo do projeto
  const [loading, setLoading] = useState(false);

  const direcionarServico = async () => {
    if (!comentarioDirecionar.trim()) return alert("Comentário é obrigatório.");
    if (!setorSelecionado) return alert("Setor é obrigatório.");
    if (!novaComplexidadeDirecionar)
      return alert("Complexidade é obrigatória.");
    if (!novaDataPrazo) return alert("Atualizar prazo é obrigatório.");
    if (servico.dataPrazoProjeto === null && !novoPrazoProjeto)
      return alert("Preencha o prazo do projeto.");

    setLoading(true);
    try {
      const novaDataISO = fromInputDateString(novaDataPrazo).toISOString();
      const novaDataProjetoISO =
        servico.dataPrazoProjeto === null && novoPrazoProjeto
          ? fromInputDateString(novoPrazoProjeto).toISOString()
          : servico.dataPrazoProjeto;

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
          posicaoNoQuadro: "backlog",
          ordemVerticalNoQuadro: -10,
          complexidade: parseFloat(novaComplexidadeDirecionar),
          dataProximoPrazo: novaDataISO,
          dataPrazoProjeto: novaDataProjetoISO,
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

  return (
    <>
      <select
        value={setorSelecionado}
        onChange={(e) => setSetorSelecionado(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-text border-border"
      >
        <option value="">Selecione o setor:</option>
        <option value="suporte">Suporte</option>
        <option value="dev">Dev</option>
        <option value="webmaster">Webmaster</option>
        <option value="comercial">Comercial</option>
        <option value="trafego">Tráfego Pago</option>
        <option value="socialmedia">Social Media</option>
        <option value="feedbacks">Feedbacks</option>
        <option value="financeiro">Financeiro</option>
        <option value="diretoria">Diretoria</option>
      </select>

      <select
        value={novaComplexidadeDirecionar}
        onChange={(e) => setNovaComplexidadeDirecionar(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-text border-border"
      >
        <option value="">Selecione a complexidade</option>
        <option value="1">1 - Muito simples (até 15 min)</option>
        <option value="2">2 - Simples (até 30min)</option>
        <option value="3">3 - Moderado (Até 1h)</option>
        <option value="4">4 - Demorada (Acima 1h)</option>
        <option value="5">5 - Muito longa (Conversar)</option>
      </select>
      {servico.dataPrazoProjeto === null && (
        <>
          <p className="text-text/80">Novo prazo do projeto:</p>
          <input
            type="date"
            value={novoPrazoProjeto}
            onChange={(e) => setNovoPrazoProjeto(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          />
        </>
      )}
      <p className="text-text/80">Novo prazo da tarefa:</p>
      <input
        type="date"
        value={novaDataPrazo}
        onChange={(e) => setNovaDataPrazo(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
      />

      <input
        type="text"
        value={comentarioDirecionar}
        onChange={(e) => setComentarioDirecionar(e.target.value)}
        placeholder="Comentário"
        className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
      />
      <div className="flex gap-2">
        <button
          onClick={direcionarServico}
          disabled={loading}
          className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
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
  );
}
