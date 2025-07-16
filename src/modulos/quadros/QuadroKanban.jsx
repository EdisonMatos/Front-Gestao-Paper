// components/QuadroKanban.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardServico from "./CardServico";

const opcoesSetores = ["dev", "suporte", "webmaster"];

export default function QuadroKanban({ titulo, turno, colunas }) {
  // Inicializa o estado com as chaves das colunas recebidas
  const [servicos, setServicos] = useState(
    Object.keys(colunas).reduce((acc, coluna) => {
      acc[coluna] = [];
      return acc;
    }, {})
  );

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
        // Se pos não existir ou não for uma coluna válida, joga no primeiro da lista (pode ser backlog ou o primeiro da prop)
        const colunaValida =
          pos && servicosOrganizados[pos] ? pos : Object.keys(colunas)[0];
        servicosOrganizados[colunaValida].push(servico);
      });

      // Ordena por atualizadoEm em cada coluna
      Object.keys(servicosOrganizados).forEach((coluna) => {
        servicosOrganizados[coluna].sort(
          (a, b) => new Date(a.atualizadoEm) - new Date(b.atualizadoEm)
        );
      });

      setServicos(servicosOrganizados);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
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

    const toastId = toast.loading("Atualizando quadro...");

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

        toast.update(toastId, {
          render: "Ordem atualizada com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Erro ao atualizar ordem dos serviços:", error);
        toast.update(toastId, {
          render: "Erro ao atualizar ordem",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      return;
    }

    // Se houver uma coluna chamada "concluido", tratar ela como especial (igual antes)
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
        toast.dismiss(toastId);
        alert("Setor inválido ou operação cancelada.");
        return;
      }

      try {
        await axios.put(
          `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
          {
            turnoDaVez: escolha,
            posicaoNoQuadro: null,
          }
        );

        await carregarServicos();

        toast.update(toastId, {
          render: "Serviço concluído e direcionado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
        toast.update(toastId, {
          render: "Erro ao atualizar serviço",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      return;
    }

    try {
      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
        {
          posicaoNoQuadro: destino,
          atualizadoEm: new Date().toISOString(),
        }
      );

      await carregarServicos();

      toast.update(toastId, {
        render: "Serviço movido com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      toast.update(toastId, {
        render: "Erro ao mover serviço",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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
      <h2 className="mb-4 text-2xl font-bold">{titulo}</h2>
      <div className="relative flex gap-4 p-4 min-h-[500px]">
        <ToastContainer position="top-right" autoClose={3000} />
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([key, nome]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[250px] bg-gray-100 p-2 rounded shadow-md"
                >
                  <h2 className="mb-2 font-bold text-center">{nome}</h2>
                  {servicos[key].map((servico, index) => {
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
                            comentario={comentario}
                            provided={provided}
                            snapshot={snapshot}
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
