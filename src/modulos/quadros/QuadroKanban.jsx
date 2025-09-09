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
  "contabilidade",
  "socialmedia",
  "diretoria",
];

export default function QuadroKanban({ titulo, turno, colunas }) {
  const [servicos, setServicos] = useState(
    Object.keys(colunas).reduce((acc, coluna) => {
      acc[coluna] = [];
      return acc;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(300); // 5 minutos em segundos

  async function carregarServicos() {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `https://backend-gestao-paper.onrender.com/servicos/kanban`,
        { params: { turno } } // evita problemas de encoding e fica mais claro
      );

      const keys = Object.keys(colunas);

      // Sempre começamos com todas as colunas vazias
      const baseVazia = keys.reduce((acc, k) => {
        acc[k] = [];
        return acc;
      }, {});

      let servicosOrganizados = { ...baseVazia };

      if (Array.isArray(data)) {
        // ===== Caso 1: backend retorna LISTA plana de serviços =====
        for (const servico of data) {
          const pos = servico.posicaoNoQuadro;
          const keyValida =
            pos && servicosOrganizados.hasOwnProperty(pos) ? pos : keys[0]; // fallback na primeira coluna
          servicosOrganizados[keyValida].push(servico);
        }
      } else if (data && typeof data === "object") {
        // ===== Caso 2: backend retorna OBJETO agrupado por coluna =====
        // Copiamos apenas as colunas esperadas; o que não vier vira []
        for (const k of keys) {
          const lista = Array.isArray(data[k]) ? data[k] : [];
          servicosOrganizados[k] = lista.slice(); // cópia defensiva
        }
      } else {
        // Resposta inesperada => mantém tudo vazio
        console.warn("Formato inesperado da resposta /kanban:", data);
      }

      // Ordena cada coluna por ordemVerticalNoQuadro (nulls sobem)
      for (const k of keys) {
        servicosOrganizados[k].sort((a, b) => {
          const A = a.ordemVerticalNoQuadro ?? Infinity;
          const B = b.ordemVerticalNoQuadro ?? Infinity;
          return A - B;
        });
      }

      setServicos(servicosOrganizados);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
      // Garante estado consistente mesmo em erro
      const vazio = Object.keys(colunas).reduce(
        (acc, k) => ((acc[k] = []), acc),
        {}
      );
      setServicos(vazio);
      toast.error("Erro ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, [turno]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          carregarServicos();
          return 300; // reinicia a contagem sem limpar o intervalo
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // só limpa quando o componente desmontar
  }, []);

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

    // ===== NOVA REGRA =====
    if (destino === "emProgresso") {
      if (
        itemMovido.dataProximoPrazo === null ||
        itemMovido.dataPrazoProjeto === null
      ) {
        toast.info(
          "Defina os prazos antes de colocar o serviço 'Em Progresso'.",
          {
            autoClose: 2500,
          }
        );
        return;
      }
    }

    if (destino === "emProgresso") {
      if (itemMovido.dataInfosColetadas === null) {
        toast.info(
          "Serviço não pode entrar em andamento sem a data das infos coletadas.",
          {
            autoClose: 2500,
          }
        );
        return;
      }
    }
    // ======================

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

    let comentario = null;
    if (destino === "finalizar") {
      comentario = "Serviço finalizado. Pegar feedback";
    } else if (destino === "solicitado") {
      comentario = "Feedback solicitado. Aguardar";
    } else if (destino === "emMaos") {
      comentario = "Feedback recebido. Postar";
    } else if (destino === "semFbFinalizar") {
      comentario = "Sem feedback. Serviço finalizado.";
    } else if (destino !== "") {
      const dispensaComentario =
        turno === "financeiro" &&
        [
          "enviadoComercial",
          "pagarComissao",
          "aguardandoCliente",
          "aguardandoClienteAss",
          "aguardandoClienteAqui",
        ].includes(destino);

      if (!dispensaComentario) {
        comentario = prompt(
          "Comente no seguinte formato: \n O que foi feito. O que precisa ser feito agora."
        );
        if (!comentario || !comentario.trim()) {
          toast.info("Movimentação cancelada.", { autoClose: 1000 });
          return;
        }
      }
    }

    try {
      const movingToastId = toast.loading("Movendo serviço...");

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

      const payload = {
        posicaoNoQuadro: destino,
        ordemVerticalNoQuadro: 0,
      };

      if (destino === "finalizar") {
        payload.dataConclusao = new Date().toISOString();
      }

      if (destino === "emMaos") {
        payload.turnoDaVez = "socialmedia";
        payload.posicaoNoQuadro = "postarFeedbacks";
      }

      if (destino === "semFbFinalizar") {
        payload.turnoDaVez = "finalizado";
        payload.posicaoNoQuadro = "finalizado";
        payload.dataConclusao = new Date().toISOString();
      }

      if (
        destino === "aguardandoCliente" ||
        destino === "ausentes" ||
        destino === "emAtendimento"
      ) {
        payload.dataProximoPrazo = null;
        payload.dataPrazoProjeto = null;
        payload.complexidade = null;
      }

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${itemMovido.id}`,
        payload
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

  const minutos = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const segundos = (timer % 60).toString().padStart(2, "0");
  const timerClass = timer <= 15 ? "text-links" : "text-white/50";
  const textoExtra = timer <= 15 ? " - Atualizando em breve!" : "";

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-text">{titulo}</h2>
        <span className="text-text">|</span>
        <p className={timerClass}>
          Atualiza em: {minutos}:{segundos}
          {textoExtra}
        </p>
      </div>
      <div className="relative flex gap-4 py-4 overflow-x-auto gap">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([key, config]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-w-[275px] w-[275px] bg-containers p-3 rounded-2xl shadow-md"
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
