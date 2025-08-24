// components/CardServicoVisual.jsx
import { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import AcoesCardServico from "./AcoesCardServico";

export default function CardServicoVisual({
  provided,
  snapshot,
  servico,
  turno,
  comentarios,
  doisMaisRecentes,
  comentariosRestantes,
  adicionandoComentario,
  setAdicionandoComentario,
  novoComentario,
  setNovoComentario,
  adicionarComentario,
  loading,
  mostrarTodos,
  setMostrarTodos,
  mostrarCompleto,
  setMostrarCompleto,
  mostrarDirecionar,
  setMostrarDirecionar,
  mostrarDescricaoCompleta,
  setMostrarDescricaoCompleta,
  docDisponivel,
  previaDisponivel,
  repoDisponivel,
  dataProximoPrazoLocal,
  dataPrazoProjetoLocal,
  capitalizar,
  formatarDataHora,
  formatarTelefoneParaWhatsApp,
  formatarDataPrazoProjetoDetalhado,
  formatarDataPrazo,
  estiloFonte,
  modoCompacto,
  modoSuperCompacto,
  handleAtualizarPrazo,
  handleAtualizarComplexidade,
  linhasDescricao,
  descricaoCurta,
}) {
  const [copied, setCopied] = useState(false);
  const descriptionRef = useRef(null);

  // estado para copiar comentários individuais
  const [copiedCommentId, setCopiedCommentId] = useState(null);

  async function handleCopyDescription() {
    try {
      const textToCopy = mostrarDescricaoCompleta
        ? servico?.comentariosTexto ?? ""
        : descricaoCurta ?? "";

      if (!textToCopy || !textToCopy.trim()) {
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar descrição:", err);
    }
  }

  async function handleCopyComment(commentId, commentText) {
    try {
      if (!commentText || !commentText.trim()) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(commentText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = commentText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedCommentId(commentId);
      setTimeout(() => setCopiedCommentId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar comentário:", err);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }

    try {
      await axios.delete(
        `https://backend-gestao-paper.onrender.com/comentarios/${commentId}`
      );
      toast.success("Comentário excluído com sucesso!", { autoClose: 1000 });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      toast.error("Erro ao excluir comentário.");
    }
  }

  function renderCommentText(texto) {
    if (texto.startsWith("http")) {
      return texto.length > 20 ? texto.substring(0, 22) + "..." : texto;
    }
    return texto;
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-cards rounded-2xl p-5 mb-2 shadow ${
        snapshot.isDragging ? "scale-110 transition-all" : ""
      }`}
    >
      {modoCompacto || modoSuperCompacto ? (
        <>
          <div className="text-text" style={estiloFonte}>
            <h3 className="font-semibold">{servico.nome}</h3>
            <p>{servico.cliente?.empresa || "Sem empresa"}</p>
          </div>

          {!modoSuperCompacto && (
            <div
              className="pt-2 border-t-2 border-border text-text"
              style={estiloFonte}
            >
              {doisMaisRecentes.length > 0 ? (
                <div
                  key={doisMaisRecentes[0].id}
                  className="relative group"
                  style={estiloFonte}
                >
                  <p className="group-hover:opacity-30">
                    {renderCommentText(doisMaisRecentes[0].texto)}
                  </p>
                  <p
                    className="mt-1 opacity-50 text-text group-hover:opacity-30"
                    style={{ fontSize: "12px" }}
                  >
                    {capitalizar(doisMaisRecentes[0].setor)} -{" "}
                    {formatarDataHora(doisMaisRecentes[0].criadoEm)}
                  </p>
                  <div className="absolute flex gap-2 px-3 py-1 text-xs text-white transition -translate-x-1/2 -translate-y-1/2 rounded opacity-0 top-1/2 left-1/2 bg-opacity-70 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyComment(
                          doisMaisRecentes[0].id,
                          doisMaisRecentes[0].texto
                        );
                      }}
                      className="px-2 py-1 text-black transition-all rounded bg-links hover:scale-110"
                    >
                      {copiedCommentId === doisMaisRecentes[0].id
                        ? "Copiado!"
                        : "Copiar"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(
                          comentario.id || doisMaisRecentes[0].id
                        );
                      }}
                      className="px-2 py-1 text-white transition-all bg-red-600 rounded hover:scale-110 hover:bg-red-700"
                    >
                      Excluir
                    </button>
                    {doisMaisRecentes[0].texto.startsWith("http") && (
                      <a
                        href={doisMaisRecentes[0].texto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-black transition-all bg-white rounded hover:scale-110"
                      >
                        Acessar
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="italic text-text" style={estiloFonte}>
                  Sem comentários ainda.
                </p>
              )}
            </div>
          )}

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

          <p className="text-xs text-text" style={estiloFonte}>
            {servico.cliente?.telefone ? (
              <a
                href={`https://wa.me/+55${formatarTelefoneParaWhatsApp(
                  servico.cliente.telefone
                )}`}
                // target="_blank"
                rel="noopener noreferrer"
                className="text-links hover:underline"
              >
                {servico.cliente?.representante || "Sem representante"}
              </a>
            ) : (
              servico.cliente?.representante || "Sem representante"
            )}
          </p>

          {linhasDescricao.length > 0 && (
            <div
              ref={descriptionRef}
              className="relative p-2 pr-8 my-2 text-sm whitespace-pre-line rounded-lg bg-neutral-900 text-text opacity-80"
              style={estiloFonte}
            >
              {mostrarDescricaoCompleta
                ? servico.comentariosTexto
                : descricaoCurta}

              <button
                onClick={handleCopyDescription}
                className="absolute p-1 rounded top-2 right-2 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-1"
                aria-label={copied ? "Descrição copiada" : "Copiar descrição"}
                title={copied ? "Copiado!" : "Copiar descrição"}
                type="button"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-text" />
                )}
              </button>

              {linhasDescricao.length > 3 && (
                <button
                  onClick={() => setMostrarDescricaoCompleta((prev) => !prev)}
                  className="block mt-1 text-xs text-links hover:underline"
                  style={estiloFonte}
                >
                  {mostrarDescricaoCompleta ? "Ocultar" : "Ver mais"}
                </button>
              )}
            </div>
          )}

          <p className="mt-4 text-sm text-text" style={estiloFonte}>
            <span className="font-bold">Projeto:</span>{" "}
            {formatarDataPrazoProjetoDetalhado(dataPrazoProjetoLocal)}
          </p>

          <p className="mb-4 text-sm text-text" style={estiloFonte}>
            <span className="font-bold">Tarefa:</span>{" "}
            {formatarDataPrazo(dataProximoPrazoLocal)}
          </p>

          <div
            className="flex items-center gap-2 mt-2 mb-2 text-sm"
            style={estiloFonte}
          >
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
              <span className="cursor-default text-text opacity-40">Doc</span>
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
              <span className="cursor-default text-text opacity-40">
                Prévia
              </span>
            )}

            {repoDisponivel ? (
              <a
                href={servico.linkRepoGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-links hover:underline"
              >
                Git
              </a>
            ) : (
              <span className="cursor-default text-text opacity-40">Git</span>
            )}

            <button
              onClick={() => setMostrarDirecionar((prev) => !prev)}
              className="text-links hover:underline"
            >
              {mostrarDirecionar ? "Ocultar Ações" : "Ações"}
            </button>
          </div>

          {mostrarDirecionar && (
            <AcoesCardServico
              servico={servico}
              turno={turno}
              capitalizar={capitalizar}
              onFechar={() => setMostrarDirecionar(false)}
              onAtualizarPrazo={handleAtualizarPrazo}
              onAtualizarComplexidade={handleAtualizarComplexidade}
            />
          )}

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
                  className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
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
            {doisMaisRecentes.map((comentario) => (
              <div
                key={comentario.id}
                className="relative pt-2 text-sm border-t-2 border-border text-text group"
                style={estiloFonte}
              >
                <p className="group-hover:opacity-30">
                  {renderCommentText(comentario.texto)}
                </p>
                <p
                  className="mt-1 text-xs opacity-50 text-text group-hover:opacity-30"
                  style={estiloFonte}
                >
                  {capitalizar(comentario.setor)} -{" "}
                  {formatarDataHora(comentario.criadoEm)}
                </p>

                {/* Botões sobrepostos */}
                <div className="absolute flex gap-2 px-3 py-1 text-xs text-white transition -translate-x-1/2 -translate-y-1/2 rounded opacity-0 top-1/2 left-1/2 bg-opacity-70 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyComment(comentario.id, comentario.texto);
                    }}
                    className="px-2 py-1 text-black transition-all rounded bg-links hover:scale-110"
                  >
                    {copiedCommentId === comentario.id ? "Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteComment(
                        comentario.id || doisMaisRecentes[0].id
                      );
                    }}
                    className="px-2 py-1 text-white transition-all bg-red-600 rounded hover:scale-110 hover:bg-red-700"
                  >
                    Excluir
                  </button>
                  {comentario.texto.startsWith("http") && (
                    <a
                      href={comentario.texto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 text-black transition-all bg-white rounded hover:scale-110"
                    >
                      Acessar
                    </a>
                  )}
                </div>
              </div>
            ))}
            {comentariosRestantes.length > 0 && (
              <div className="mt-2">
                {!mostrarTodos ? (
                  <button
                    onClick={() => setMostrarTodos(true)}
                    className="text-sm text-links hover:underline"
                    style={estiloFonte}
                  >
                    Ver todos comentários
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
                          className="relative pt-2 border-t-2 border-border text-text group"
                        >
                          <p className="group-hover:opacity-30">
                            {renderCommentText(comentario.texto)}
                          </p>
                          <p
                            className="mt-1 text-xs opacity-50 text-text group-hover:opacity-30"
                            style={estiloFonte}
                          >
                            {capitalizar(comentario.setor)} -{" "}
                            {formatarDataHora(comentario.criadoEm)}
                          </p>

                          {/* Botões sobrepostos */}
                          <div className="absolute flex gap-2 px-3 py-1 text-xs text-white transition -translate-x-1/2 -translate-y-1/2 rounded opacity-0 top-1/2 left-1/2 bg-opacity-70 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyComment(
                                  comentario.id,
                                  comentario.texto
                                );
                              }}
                              className="px-2 py-1 text-black transition-all rounded bg-links hover:scale-110"
                            >
                              {copiedCommentId === comentario.id
                                ? "Copiado!"
                                : "Copiar"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteComment(
                                  comentario.id || doisMaisRecentes[0].id
                                );
                              }}
                              className="px-2 py-1 text-white transition-all bg-red-600 rounded hover:scale-110 hover:bg-red-700"
                            >
                              Excluir
                            </button>
                            {comentario.texto.startsWith("http") && (
                              <a
                                href={comentario.texto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-black transition-all bg-white rounded hover:scale-110"
                              >
                                Acessar
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setMostrarTodos(false)}
                      className="mt-2 text-sm text-links hover:underline"
                      style={estiloFonte}
                    >
                      Ocultar comentários
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {(servico.posicaoNoQuadro === "aguardandoCliente" ||
            servico.posicaoNoQuadro === "solicitado") && (
            <button
              onClick={() => setMostrarCompleto(false)}
              className="mt-4 text-sm text-links hover:underline"
            >
              Mostrar card resumido
            </button>
          )}
        </>
      )}
    </div>
  );
}
