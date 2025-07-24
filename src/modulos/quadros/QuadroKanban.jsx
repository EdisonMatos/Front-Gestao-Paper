// components/QuadroKanban.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardServico from "./CardServico";
import SkeletonCard from "./SkeletonCard";

const opcoesSetores = [
  "dev",
  "suporte",
  "webmaster",
  "feedbacks",
  "comercial",
  "financeiro",
  "trafego",
];

export default function QuadroKanban({ titulo, turno, colunas }) {
  const [servicos, setServicos] = useState(
    Object.keys(colunas).reduce((acc, coluna) => {
      acc[coluna] = [];
      return acc;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(true);

  async function carregarServicos() {
    try {
      const { data } = await axios.get(
        "https://backend-gestao-paper.onrender.com/servicos"
      );

      const apenasDoTurno = data.filter(
        (servico) => servico.turnoDaVez === turno
      );

      const servicosOrganizados = Object.keys(colunas).reduce((acc, coluna) => {
        acc[coluna] = [];
        return acc;
      }, {});

      apenasDoTurno.forEach((servico) => {
        const pos = servico.posicaoNoQuadro;
        const colunaValida =
          pos && servicosOrganizados[pos] ? pos : Object.keys(colunas)[0];
        servicosOrganizados[colunaValida].push(servico);
      });

      Object.keys(servicosOrganizados).forEach((coluna) => {
        servicosOrganizados[coluna].sort((a, b) => {
          const ordemA = a.ordemVerticalNoQuadro;
          const ordemB = b.ordemVerticalNoQuadro;
          if (ordemA === null && ordemB !== null) return -1;
          if (ordemB === null && ordemA !== null) return 1;
          return (ordemA ?? 0) - (ordemB ?? 0);
        });
      });

      setServicos(servicosOrganizados);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, [turno, colunas]);

  async function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const origem = source.droppableId;
    const destino = destination.droppableId;
    const itemMovido = servicos[origem][source.index];

    if (origem === destino) {
      const novaLista = Array.from(servicos[origem]);
      const [movido] = novaLista.splice(source.index, 1);
      novaLista.splice(destination.index, 0, movido);

      setServicos((prev) => ({
        ...prev,
        [origem]: novaLista,
      }));

      const updatingToastId = toast.loading("Atualizando ordem...");

      try {
        const now = Date.now();

        await Promise.all(
          novaLista.map((servico, index) =>
            axios.put(
              `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
              {
                ordemVerticalNoQuadro: index,
              }
            )
          )
        );

        await carregarServicos();

        toast.update(updatingToastId, {
          render: "Ordem atualizada com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });
      } catch (error) {
        console.error("Erro ao atualizar ordem dos serviços:", error);
        toast.dismiss();
        toast.error("Erro ao atualizar ordem", { autoClose: 1000 });
      }

      return;
    }

    // Se for mudança de coluna para emProgresso, não exige comentário
    let comentario = null;
    if (destino !== "emProgresso") {
      comentario = prompt(
        "Comente no seguinte formato: \n O que foi feito. O que precisa ser feito agora."
      );
      if (!comentario || !comentario.trim()) {
        toast.info("Movimentação cancelada.", { autoClose: 1000 });
        return;
      }
    }

    try {
      const movingToastId = toast.loading("Movendo serviço...");

      // 1. Cria comentário (caso necessário)
      if (comentario) {
        await axios.post(
          "https://backend-gestao-paper.onrender.com/comentarios",
          {
            servicoId: itemMovido.id,
            texto: comentario.trim(),
            feitoPor: turno.charAt(0).toUpperCase() + turno.slice(1),
            setor: turno,
          }
        );
      }

      // 2. Atualiza serviço com nova coluna
      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
        {
          posicaoNoQuadro: destino,
          ordemVerticalNoQuadro: 0,
        }
      );

      await carregarServicos();

      toast.update(movingToastId, {
        render: "Serviço movido com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      toast.dismiss();
      toast.error("Erro ao mover serviço", { autoClose: 1000 });
    }
  }

  function obterComentarioMaisRecente(servico) {
    if (servico.comentarios && servico.comentarios.length > 0) {
      const maisRecente = [...servico.comentarios].sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
      )[0];
      return maisRecente?.texto;
    }

    return servico.comentariosTexto || null;
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-text">{titulo}</h2>
      <div className="relative flex gap-4 py-4 overflow-x-auto gap">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([key, config]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[300px] w-[300px] bg-containers p-3 rounded-2xl shadow-md"
                >
                  <div className="flex items-center justify-between px-2 py-4 mb-2 text-left text-text">
                    <span>{config.nome}</span>
                    <span className="w-8 px-2 py-2 text-sm text-center text-text rounded-xl bg-background">
                      {servicos[key]?.length || 0}
                    </span>
                  </div>

                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    : servicos[key].map((servico, index) => {
                        const comentario = obterComentarioMaisRecente(servico);
                        return (
                          <Draggable
                            key={servico.id}
                            draggableId={servico.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <CardServico
                                servico={servico}
                                provided={provided}
                                snapshot={snapshot}
                                turno={turno}
                                modoCard={config.tipoCard}
                              />
                            )}
                          </Draggable>
                        );
                      })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
