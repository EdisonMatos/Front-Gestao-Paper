import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddNovaRotina({ setor, onAtualizarRotinas }) {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [visivel, setVisivel] = useState(false);

  const [novaRotina, setNovaRotina] = useState({
    nome: "",
    descricao: "",
    status: "pendente",
    complexidade: 1,
    horario: "",
    janela: 60,
    diaDaSemana: "segunda",
    setor,
  });

  const [editando, setEditando] = useState({});

  useEffect(() => {
    if (!setor) return;
    buscarRotinas();
  }, [setor]);

  useEffect(() => {
    setNovaRotina((prev) => ({
      ...prev,
      setor,
    }));
  }, [setor]);

  async function buscarRotinas() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(
        "https://backend-gestao-paper.onrender.com/rotinas"
      );
      const data = await res.json();
      const filtradas = data.filter((r) => r.setor === setor);
      setRotinas(filtradas);
    } catch (e) {
      setErro("Erro ao carregar rotinas");
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setNovaRotina((prev) => ({
      ...prev,
      [name]:
        name === "complexidade" || name === "janela" ? Number(value) : value,
    }));
  }

  async function handleAdicionar(e) {
    e.preventDefault();
    if (!novaRotina.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const toastId = toast.loading("Adicionando rotina...");
    try {
      const res = await fetch(
        "https://backend-gestao-paper.onrender.com/rotinas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...novaRotina,
            conclusao: new Date(0).toISOString(), // <- adicionado aqui
          }),
        }
      );
      if (!res.ok) throw new Error("Erro ao criar rotina");

      setNovaRotina({
        nome: "",
        descricao: "",
        status: "pendente",
        complexidade: 1,
        horario: "",
        janela: 60,
        diaDaSemana: "segunda",
        setor,
      });

      await buscarRotinas();
      if (onAtualizarRotinas) onAtualizarRotinas();

      toast.update(toastId, {
        render: "Rotina adicionada com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao adicionar rotina",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }

  function iniciarEdicao(id) {
    const rotina = rotinas.find((r) => r.id === id);
    setEditando((prev) => ({
      ...prev,
      [id]: { ...rotina },
    }));
  }

  function cancelarEdicao(id) {
    setEditando((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function handleEditarChange(id, e) {
    const { name, value } = e.target;
    setEditando((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]:
          name === "complexidade" || name === "janela" ? Number(value) : value,
      },
    }));
  }

  async function salvarEdicao(id) {
    const rotinaEditada = editando[id];
    if (!rotinaEditada.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    const toastId = toast.loading("Salvando edição...");
    try {
      const res = await fetch(
        `https://backend-gestao-paper.onrender.com/rotinas/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rotinaEditada),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar rotina");

      cancelarEdicao(id);
      await buscarRotinas();
      if (onAtualizarRotinas) onAtualizarRotinas();

      toast.update(toastId, {
        render: "Rotina atualizada com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao salvar edição",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }

  async function excluirRotina(id) {
    if (!window.confirm("Deseja realmente excluir essa rotina?")) return;

    const toastId = toast.loading("Excluindo rotina...");
    try {
      const res = await fetch(
        `https://backend-gestao-paper.onrender.com/rotinas/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Erro ao excluir rotina");

      await buscarRotinas();
      if (onAtualizarRotinas) onAtualizarRotinas();

      toast.update(toastId, {
        render: "Rotina excluída com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Erro ao excluir rotina",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  }

  return (
    <>
      {!visivel && (
        <button
          onClick={() => setVisivel(true)}
          className="px-4 py-2 mb-4 text-black rounded bg-buttonsHover hover:bg-buttons"
        >
          Adicionar nova rotina
        </button>
      )}

      {visivel && (
        <div className="max-w-full p-4 mb-8 overflow-x-auto border rounded-lg shadow-md bg-background text-text">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-text">
              Gerenciar Rotinas - Setor: {setor}
            </h3>
            <button
              onClick={() => setVisivel(false)}
              className="px-8 py-2 text-white rounded bg-secondaryButtons hover:bg-secondaryButtonsHover"
            >
              Ocultar
            </button>
          </div>

          <form
            onSubmit={handleAdicionar}
            className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4"
          >
            <input
              type="text"
              name="nome"
              placeholder="Nome da rotina"
              value={novaRotina.nome}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
              required
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={novaRotina.descricao}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
            <input
              type="text"
              name="horario"
              placeholder="Horário (ex: 9:30)"
              value={novaRotina.horario}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
              pattern="^\d{1,2}:\d{2}$"
              title="Formato HH:MM"
              required
            />
            <input
              type="number"
              name="janela"
              placeholder="Janela (minutos)"
              value={novaRotina.janela}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
              min={1}
              required
            />

            <input
              type="number"
              name="complexidade"
              placeholder="Complexidade"
              value={novaRotina.complexidade}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
              min={1}
              max={10}
              required
            />

            <select
              name="diaDaSemana"
              value={novaRotina.diaDaSemana}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
              required
            >
              <option value="segunda">Segunda</option>
              <option value="terca">Terça</option>
              <option value="quarta">Quarta</option>
              <option value="quinta">Quinta</option>
              <option value="sexta">Sexta</option>
              <option value="sábado">Sábado</option>
              <option value="domingo">Domingo</option>
              <option value="todos">Todos</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 text-black rounded bg-buttonsHover col-span-full md:col-auto hover:bg-buttons"
            >
              Adicionar
            </button>
          </form>

          {carregando ? (
            <p>Carregando rotinas...</p>
          ) : erro ? (
            <p className="text-red-500">{erro}</p>
          ) : rotinas.length === 0 ? (
            <p>Nenhuma rotina encontrada para o setor {setor}.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Descrição</th>
                  <th className="px-3 py-2">Horário</th>
                  <th className="px-3 py-2">Janela (min)</th>
                  <th className="px-3 py-2">Complexidade</th>
                  <th className="px-3 py-2">Dia da Semana</th>
                  <th className="px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rotinas.map((r) => {
                  const edit = editando[r.id];
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-gray-200 hover:bg-links/50"
                    >
                      <td className="px-3 py-2">
                        {edit ? (
                          <input
                            type="text"
                            name="nome"
                            value={edit.nome}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border "
                          />
                        ) : (
                          r.nome
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {edit ? (
                          <input
                            type="text"
                            name="descricao"
                            value={edit.descricao}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
                          />
                        ) : (
                          r.descricao
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {edit ? (
                          <input
                            type="text"
                            name="horario"
                            value={edit.horario}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
                            pattern="^\d{1,2}:\d{2}$"
                            title="Formato HH:MM"
                          />
                        ) : (
                          r.horario
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {edit ? (
                          <input
                            type="number"
                            name="janela"
                            value={edit.janela}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
                            min={1}
                          />
                        ) : (
                          r.janela
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {edit ? (
                          <input
                            type="number"
                            name="complexidade"
                            value={edit.complexidade}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
                            min={1}
                            max={10}
                          />
                        ) : (
                          r.complexidade
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {edit ? (
                          <select
                            name="diaDaSemana"
                            value={edit.diaDaSemana}
                            onChange={(e) => handleEditarChange(r.id, e)}
                            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
                          >
                            <option value="segunda">Segunda</option>
                            <option value="terça">Terça</option>
                            <option value="quarta">Quarta</option>
                            <option value="quinta">Quinta</option>
                            <option value="sexta">Sexta</option>
                            <option value="sábado">Sábado</option>
                            <option value="domingo">Domingo</option>
                            <option value="todos">Todos</option>
                          </select>
                        ) : (
                          r.diaDaSemana
                        )}
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        {edit ? (
                          <>
                            <button
                              onClick={() => salvarEdicao(r.id)}
                              className="px-2 py-1 text-black rounded bg-buttonsHover hover:bg-buttons"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => cancelarEdicao(r.id)}
                              className="px-2 py-1 text-white bg-gray-400 rounded hover:bg-gray-500"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => iniciarEdicao(r.id)}
                              className="px-2 py-1 text-black rounded bg-buttons hover:bg-buttonsHover"
                            >
                              Editar
                            </button>
                            {/* <button
                              onClick={() => excluirRotina(r.id)}
                              className="px-2 py-1 text-black rounded bg-buttons hover:bg-buttonsHover"
                            >
                              Excluir
                            </button> */}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
