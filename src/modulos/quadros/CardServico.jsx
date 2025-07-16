import { useState } from "react";
import axios from "axios";

export default function CardServico({ servico, provided, snapshot }) {
  const [comentarios, setComentarios] = useState(servico.comentarios || []);
  const [adicionandoComentario, setAdicionandoComentario] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const docDisponivel = !!servico.linkDoc;
  const previaDisponivel = !!servico.linkPreviaVercel;

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;

    setLoading(true);

    try {
      const { data: comentarioCriado } = await axios.post(
        "https://backend-gestao-paper.onrender.com/comentarios",
        {
          servicoId: servico.id,
          texto: novoComentario.trim(),
          feitoPor: "Ed", // você pode alterar isso dinamicamente no futuro
          setor: "gestao",
        }
      );

      setComentarios((prev) => [...prev, comentarioCriado]);
      setNovoComentario("");
      setAdicionandoComentario(false);
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      alert("Erro ao adicionar comentário");
    } finally {
      setLoading(false);
    }
  };

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

      {!adicionandoComentario && (
        <button
          onClick={() => setAdicionandoComentario(true)}
          className="mb-2 text-sm text-blue-600 hover:underline"
        >
          Adicionar comentário
        </button>
      )}

      {adicionandoComentario && (
        <div className="mb-2">
          <input
            type="text"
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="w-full p-1 mb-1 text-sm border rounded"
            placeholder="Digite seu comentário..."
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={adicionarComentario}
              disabled={loading}
              className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
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

      <div className="mt-3">
        {comentarios.length > 0 ? (
          <ul className="space-y-1 text-sm text-gray-700">
            {comentarios
              .sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm))
              .map((comentario) => (
                <li key={comentario.id} className="pt-1 border-t">
                  <span className="font-semibold">{comentario.feitoPor}:</span>{" "}
                  {comentario.texto}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm italic text-gray-500">Sem comentários ainda.</p>
        )}
      </div>
    </div>
  );
}
