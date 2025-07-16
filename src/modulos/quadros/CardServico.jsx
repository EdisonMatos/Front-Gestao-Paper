export default function CardServico({ servico, provided, snapshot }) {
  function obterComentarioMaisRecente() {
    if (servico.comentarios && servico.comentarios.length > 0) {
      const maisRecente = [...servico.comentarios].sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
      )[0];
      return maisRecente?.texto;
    }

    return servico.comentariosTexto || "Sem comentário";
  }

  const docDisponivel = !!servico.linkDoc;
  const previaDisponivel = !!servico.linkPreviaVercel;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white rounded p-3 mb-2 shadow ${
        snapshot.isDragging ? "scale-105" : ""
      }`}
    >
      <h3 className="font-semibold">{servico.nome}</h3>
      <p className="text-sm text-gray-600">
        {servico.cliente?.empresa || "Sem empresa"}
      </p>
      <p className="text-xs italic text-gray-500">
        {servico.cliente?.representante || "Sem representante"}
      </p>
      <div className="flex gap-2 mt-2 mb-2 text-sm">
        {/* Link do DOC */}
        {docDisponivel ? (
          <a
            href={servico.linkDoc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Doc
          </a>
        ) : (
          <span className="text-gray-400 cursor-default">Doc</span>
        )}

        {/* Link da PRÉVIA */}
        {previaDisponivel ? (
          <a
            href={servico.linkPreviaVercel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Prévia
          </a>
        ) : (
          <span className="text-gray-400 cursor-default">Prévia</span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-700">
        {obterComentarioMaisRecente()}
      </p>
    </div>
  );
}
