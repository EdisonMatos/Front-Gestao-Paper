// components/CardServicoVisual.jsx
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
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-cards rounded-2xl p-5 mb-2 shadow ${
        snapshot.isDragging ? "scale-105" : ""
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
                <div key={doisMaisRecentes[0].id}>
                  <p>{doisMaisRecentes[0].texto}</p>
                  <p
                    className="mt-1 opacity-50 text-text"
                    style={{ fontSize: "12px" }}
                  >
                    {capitalizar(doisMaisRecentes[0].setor)} -{" "}
                    {formatarDataHora(doisMaisRecentes[0].criadoEm)}
                  </p>
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
                target="_blank"
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
              className="p-2 my-2 text-sm whitespace-pre-line rounded-lg bg-neutral-900 text-text opacity-80"
              style={estiloFonte}
            >
              {mostrarDescricaoCompleta
                ? servico.comentariosTexto
                : descricaoCurta}
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
                className="pt-2 text-sm border-t-2 border-border text-text"
                style={estiloFonte}
              >
                <p>{comentario.texto}</p>
                <p
                  className="mt-1 text-xs opacity-50 text-text"
                  style={estiloFonte}
                >
                  {capitalizar(comentario.setor)} -{" "}
                  {formatarDataHora(comentario.criadoEm)}
                </p>
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
