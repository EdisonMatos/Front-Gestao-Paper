import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function AcaoMudarComplexidade({
  servico,
  onAtualizarComplexidade,
  onFechar,
}) {
  const [novaComplexidade, setNovaComplexidade] = useState(
    servico.complexidade !== null ? servico.complexidade.toString() : ""
  );
  const [loading, setLoading] = useState(false);

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
          className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
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
  );
}
