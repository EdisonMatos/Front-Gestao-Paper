import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Função para converter string yyyy-mm-dd do input para objeto Date local
function fromInputDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function AcaoFinalizarServico({
  servico,
  turno,
  capitalizar,
  onFechar,
}) {
  const [tipoFinalizacao, setTipoFinalizacao] = useState("");
  const [comentarioFinalizar, setComentarioFinalizar] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("setor");

  const finalizarServico = async () => {
    if (role !== "diretoria") {
      toast.error("Você não tem permissão para finalizar serviços.", {
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);
    try {
      let dataFinal;
      if (tipoFinalizacao === "hoje") {
        dataFinal = new Date().toISOString();
      } else if (tipoFinalizacao === "comData") {
        if (!dataConclusao) {
          alert("Selecione a data de conclusão.");
          setLoading(false);
          return;
        }
        dataFinal = fromInputDateString(dataConclusao).toISOString();
      } else {
        alert("Selecione como deseja finalizar o serviço.");
        setLoading(false);
        return;
      }

      if (comentarioFinalizar.trim()) {
        await axios.post(
          "https://backend-gestao-paper.onrender.com/comentarios",
          {
            servicoId: servico.id,
            texto: comentarioFinalizar.trim(),
            feitoPor: capitalizar(turno),
            setor: turno,
          }
        );
      }

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          dataConclusao: dataFinal,
          posicaoNoQuadro: "finalizado",
          turnoDaVez: "finalizado",
        }
      );

      toast.success("Serviço finalizado com sucesso!", { autoClose: 1000 });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      onFechar();
    } catch (err) {
      console.error("Erro ao finalizar serviço:", err);
      alert("Erro ao finalizar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <select
        value={tipoFinalizacao}
        onChange={(e) => setTipoFinalizacao(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-text border-border"
      >
        <option value="">Selecione como finalizar:</option>
        <option value="hoje">Finalizar hoje</option>
        <option value="comData">Finalizar com data</option>
      </select>

      {tipoFinalizacao === "comData" && (
        <input
          type="date"
          value={dataConclusao}
          onChange={(e) => setDataConclusao(e.target.value)}
          className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
        />
      )}

      {tipoFinalizacao && (
        <input
          type="text"
          value={comentarioFinalizar}
          onChange={(e) => setComentarioFinalizar(e.target.value)}
          placeholder="Comentário (opcional)"
          className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
        />
      )}

      {tipoFinalizacao && (
        <div className="flex gap-2">
          <button
            onClick={finalizarServico}
            disabled={loading}
            className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
          >
            {loading ? "Enviando..." : "Confirmar"}
          </button>
          <button
            onClick={onFechar}
            className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
}
