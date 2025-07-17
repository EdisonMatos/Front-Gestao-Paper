// components/QuadroKanban.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardServico from "./CardServico";
import SkeletonCard from "./SkeletonCard";

const opcoesSetores = ["dev", "suporte", "webmaster", "feedbacks"];

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
        servicosOrganizados[coluna].sort(
          (a, b) => new Date(a.atualizadoEm) - new Date(b.atualizadoEm)
        );
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

      try {
        const now = Date.now();

        await Promise.all(
          novaLista.map((servico, index) =>
            axios.put(
              `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
              {
                atualizadoEm: new Date(now + index * 1000).toISOString(),
              }
            )
          )
        );

        await carregarServicos();
        toast.success("Ordem atualizada com sucesso!", { autoClose: 1000 });
      } catch (error) {
        console.error("Erro ao atualizar ordem dos serviços:", error);
        toast.error("Erro ao atualizar ordem", { autoClose: 1000 });
      }

      return;
    }

    if (destino === "concluido") {
      const opcoes = opcoesSetores.filter(
        (setor) => setor !== itemMovido.turnoDaVez
      );

      const escolha = window.prompt(
        `Para qual setor você quer mover agora que foi concluído?\nOpções: ${opcoes.join(
          ", "
        )}`
      );

      if (!escolha || !opcoes.includes(escolha)) {
        alert("Setor inválido ou operação cancelada.");
        return;
      }

      try {
        const loadingToastId = toast.loading("Direcionando serviço...");

        await axios.put(
          `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
          {
            turnoDaVez: escolha,
            posicaoNoQuadro: null,
          }
        );

        await carregarServicos();

        toast.update(loadingToastId, {
          render: "Serviço concluído e direcionado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeButton: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        toast.dismiss();
        toast.error("Erro ao atualizar serviço", { autoClose: 1500 });
      }

      return;
    }

    try {
      const movingToastId = toast.loading("Movendo serviço...");

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
        {
          posicaoNoQuadro: destino,
          atualizadoEm: new Date().toISOString(),
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
      <div className="relative flex justify-between gap-4 py-4 gap">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([key, nome]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[250px] bg-containers p-3 rounded-2xl shadow-md"
                >
                  <h2 className="px-2 py-4 mb-2 text-left text-text">{nome}</h2>

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
