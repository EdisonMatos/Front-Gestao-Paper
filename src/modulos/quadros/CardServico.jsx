import { useState } from "react";
import axios from "axios";

export default function CardServico({ servico, provided, snapshot, turno }) {
  const [comentarios, setComentarios] = useState(servico.comentarios || []);
  const [adicionandoComentario, setAdicionandoComentario] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [mostrarCompleto, setMostrarCompleto] = useState(false);

  const docDisponivel = !!servico.linkDoc;
  const previaDisponivel = !!servico.linkPreviaVercel;

  const capitalizar = (texto) =>
    texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;

    setLoading(true);

    try {
      const { data: comentarioCriado } = await axios.post(
        "https://backend-gestao-paper.onrender.com/comentarios",
        {
          servicoId: servico.id,
          texto: novoComentario.trim(),
          feitoPor: capitalizar(turno),
          setor: turno,
        }
      );

      setComentarios((prev) => [comentarioCriado, ...prev]);
      setNovoComentario("");
      setAdicionandoComentario(false);
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      alert("Erro ao adicionar comentário");
    } finally {
      setLoading(false);
    }
  };

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${hora}:${min}h`;
  };

  const comentariosOrdenados = [...comentarios].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );

  const comentarioMaisRecente = comentariosOrdenados[0];
  const comentariosRestantes = comentariosOrdenados.slice(1);

  const modoCompacto =
    servico.posicaoNoQuadro === "aguardandoCliente" && !mostrarCompleto;

  const estiloFonte = modoCompacto ? { fontSize: "12px" } : {};

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-cards rounded-2xl p-5 mb-2 shadow ${
        snapshot.isDragging ? "scale-105" : ""
      }`}
      // Removi o style daqui para não quebrar o drag
    >
      {modoCompacto ? (
        <>
          <div
            className="flex items-center justify-between"
            style={estiloFonte}
          >
            <h3 className="font-semibold text-text">{servico.nome}</h3>
            <p className="text-text">
              {servico.cliente?.empresa || "Sem empresa"}
            </p>
          </div>

          <div
            className="pt-2 border-t-2 border-border text-text"
            style={estiloFonte}
          >
            {comentarioMaisRecente ? (
              <>
                <p>{comentarioMaisRecente.texto}</p>
                <p className="mt-1 text-text" style={{ fontSize: "12px" }}>
                  {capitalizar(comentarioMaisRecente.setor)} -{" "}
                  {formatarDataHora(comentarioMaisRecente.criadoEm)}
                </p>
              </>
            ) : (
              <p className="italic text-text" style={estiloFonte}>
                Sem comentários ainda.
              </p>
            )}
          </div>

          <button
            onClick={() => setMostrarCompleto(true)}
            className="mt-2 text-links hover:underline"
            style={estiloFonte}
          >
            Mostrar card completo
          </button>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-text" style={estiloFonte}>
            {servico.nome}
          </h3>
          <p className="text-sm text-text opacity-90" style={estiloFonte}>
            {servico.cliente?.empresa || "Sem empresa"}
          </p>

          <p className="text-xs text-text opacity-70" style={estiloFonte}>
            {servico.cliente?.representante || "Sem representante"}
          </p>

          <div className="flex gap-2 mt-2 mb-2 text-sm" style={estiloFonte}>
            {docDisponivel ? (
              <a
                href={servico.linkDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-links hover:underline"
              >
                Doc
              </a>
            ) : (
              <span className="text-gray-400 cursor-default">Doc</span>
            )}

            {previaDisponivel ? (
              <a
                href={servico.linkPreviaVercel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-links hover:underline"
              >
                Prévia
              </a>
            ) : (
              <span className="cursor-default text-text">Prévia</span>
            )}
          </div>

          {!adicionandoComentario && (
            <button
              onClick={() => setAdicionandoComentario(true)}
              className="mb-2 text-sm text-links hover:underline"
            >
              Comentar
            </button>
          )}

          {adicionandoComentario && (
            <div className="mb-2">
              <input
                type="text"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className="w-full p-1 mb-1 text-sm border rounded bg-inputBg text-placeholder border-border"
                placeholder="Digite seu comentário..."
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={adicionarComentario}
                  disabled={loading}
                  className="px-2 py-1 text-sm text-white rounded bg-buttons hover:bg-buttonsHover"
                >
                  {loading ? "Adicionando..." : "Adicionar"}
                </button>
                <button
                  onClick={() => {
                    setAdicionandoComentario(false);
                    setNovoComentario("");
                  }}
                  className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="mt-0">
            {comentarioMaisRecente ? (
              <div
                className="pt-2 text-sm border-t-2 border-border text-text"
                style={estiloFonte}
              >
                <p>{comentarioMaisRecente.texto}</p>
                <p
                  className="mt-1 text-xs text-text opacity-80"
                  style={estiloFonte}
                >
                  {capitalizar(comentarioMaisRecente.setor)} -{" "}
                  {formatarDataHora(comentarioMaisRecente.criadoEm)}
                </p>
              </div>
            ) : (
              <p></p>
            )}

            {comentariosRestantes.length > 0 && (
              <div className="mt-2">
                {!mostrarTodos ? (
                  <button
                    onClick={() => setMostrarTodos(true)}
                    className="text-sm text-links hover:underline"
                    style={estiloFonte}
                  >
                    Ver todos
                  </button>
                ) : (
                  <>
                    <ul
                      className="mt-2 space-y-2 text-sm text-text"
                      style={estiloFonte}
                    >
                      {comentariosRestantes.map((comentario) => (
                        <li
                          key={comentario.id}
                          className="pt-2 border-t-2 border-border text-text"
                        >
                          <p>{comentario.texto}</p>
                          <p
                            className="mt-1 text-xs text-text"
                            style={estiloFonte}
                          >
                            {capitalizar(comentario.setor)} -{" "}
                            {formatarDataHora(comentario.criadoEm)}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setMostrarTodos(false)}
                      className="mt-2 text-sm text-links hover:underline"
                      style={estiloFonte}
                    >
                      Ocultar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {servico.posicaoNoQuadro === "aguardandoCliente" && (
            <button
              onClick={() => setMostrarCompleto(false)}
              className="mt-4 text-sm text-links hover:underline"
            >
              Ocultar
            </button>
          )}
        </>
      )}
    </div>
  );
}
