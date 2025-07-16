// components/CardServico.jsx
export default function CardServico({
  servico,
  comentario,
  provided,
  snapshot,
}) {
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
      <p className="mt-2 text-sm text-gray-700">
        {comentario || "Sem comentário"}
      </p>
    </div>
  );
}
