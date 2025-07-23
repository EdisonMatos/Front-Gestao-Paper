// components/AddNovaRotina.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddNovaRotina({ setor, onAtualizarRotinas }) {
  const [novaRotina, setNovaRotina] = useState({
    nome: "",
    descricao: "",
    diaDaSemana: "",
    horario: "",
    complexidade: "",
    setor: setor,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [rotinas, setRotinas] = useState([]);

  useEffect(() => {
    fetchRotinas();
  }, [setor]);

  async function fetchRotinas() {
    try {
      const { data } = await axios.get(
        "https://backend-gestao-paper.onrender.com/rotinas"
      );
      const filtradas = data.filter((r) => r.setor === setor);
      setRotinas(filtradas);
    } catch (error) {
      console.error("Erro ao buscar rotinas:", error);
    }
  }

  async function salvarRotina(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(
          `https://backend-gestao-paper.onrender.com/rotinas/${editandoId}`,
          novaRotina
        );
      } else {
        await axios.post(
          "https://backend-gestao-paper.onrender.com/rotinas",
          novaRotina
        );
      }

      setNovaRotina({
        nome: "",
        descricao: "",
        diaDaSemana: "",
        horario: "",
        complexidade: "",
        setor: setor,
      });
      setEditandoId(null);
      fetchRotinas();
      onAtualizarRotinas();
    } catch (error) {
      console.error("Erro ao salvar rotina:", error);
    }
  }

  function editarRotina(rotina) {
    setNovaRotina(rotina);
    setEditandoId(rotina.id);
  }

  async function excluirRotina(id) {
    if (!window.confirm("Deseja realmente excluir esta rotina?")) return;

    try {
      await axios.delete(
        `https://backend-gestao-paper.onrender.com/rotinas/${id}`
      );
      setRotinas(rotinas.filter((r) => r.id !== id));
      onAtualizarRotinas();
    } catch (error) {
      console.error("Erro ao excluir rotina:", error);
    }
  }

  return (
    <div>
      <form onSubmit={salvarRotina} className="mb-6 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="p-2 border rounded bg-inputBg text-text border-border"
            placeholder="Nome"
            value={novaRotina.nome}
            onChange={(e) =>
              setNovaRotina({ ...novaRotina, nome: e.target.value })
            }
            required
          />
          <input
            className="p-2 border rounded bg-inputBg text-text border-border"
            placeholder="Dias (ex: seg,qua)"
            value={novaRotina.diaDaSemana}
            onChange={(e) =>
              setNovaRotina({ ...novaRotina, diaDaSemana: e.target.value })
            }
            required
          />
          <input
            className="p-2 border rounded bg-inputBg text-text border-border"
            placeholder="Horário(s) (ex: 08:00,14:00)"
            value={novaRotina.horario}
            onChange={(e) =>
              setNovaRotina({ ...novaRotina, horario: e.target.value })
            }
            required
          />
          <input
            className="p-2 border rounded bg-inputBg text-text border-border"
            placeholder="Complexidade (ex: 1)"
            value={novaRotina.complexidade}
            onChange={(e) =>
              setNovaRotina({ ...novaRotina, complexidade: e.target.value })
            }
            required
          />
        </div>
        <textarea
          className="w-full p-2 border rounded bg-inputBg text-text border-border"
          placeholder="Descrição"
          value={novaRotina.descricao}
          onChange={(e) =>
            setNovaRotina({ ...novaRotina, descricao: e.target.value })
          }
          required
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded bg-buttons hover:bg-buttonsHover"
        >
          {editandoId ? "Atualizar" : "Adicionar"} Rotina
        </button>
      </form>

      <div className="mb-6 space-y-2">
        {rotinas.map((r) => (
          <div
            key={r.id}
            className="p-3 border rounded bg-background border-border"
          >
            <p className="text-sm font-semibold text-text">{r.nome}</p>
            <p className="text-xs text-text/80">
              Dias: {r.diaDaSemana} | Horário: {r.horario} | Complexidade:{" "}
              {r.complexidade}
            </p>
            <p className="text-xs text-text/60">{r.descricao}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => editarRotina(r)}
                className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => excluirRotina(r.id)}
                className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
