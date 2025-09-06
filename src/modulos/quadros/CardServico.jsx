// components/CardServico.jsx
import { useState } from "react";
import axios from "axios";
import AcoesCardServico from "./AcoesCardServico";
import CardServicoVisual from "./CardServicoVisual";

export default function CardServico({
  servico: servicoInicial,
  provided,
  snapshot,
  turno,
  modoCard,
}) {
  const [comentarios, setComentarios] = useState(
    servicoInicial.comentarios || []
  );
  const [adicionandoComentario, setAdicionandoComentario] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [mostrarCompleto, setMostrarCompleto] = useState(false);
  const [mostrarDirecionar, setMostrarDirecionar] = useState(false);
  const [mostrarDescricaoCompleta, setMostrarDescricaoCompleta] =
    useState(false);

  const [servico, setServico] = useState(servicoInicial);
  const [dataProximoPrazoLocal, setDataProximoPrazoLocal] = useState(
    servico.dataProximoPrazo || null
  );
  const [dataPrazoProjetoLocal] = useState(servico.dataPrazoProjeto || null);

  const docDisponivel = !!servico.linkDoc;
  const previaDisponivel = !!servico.linkPreviaVercel;
  const repoDisponivel = !!servico.linkRepoGithub;

  const formatarDataPrazoProjeto = (dataISO) => {
    if (!dataISO) return "Prazo projeto: -";
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `Prazo projeto: ${dia}/${mes}/${ano}`;
  };

  const formatarDataPrazoProjetoDetalhado = (dataISO) => {
    if (!dataISO) {
      return (
        <>
          <span className="text-text/50">Sem prazo</span> (
          <span className="text-text/50">-</span>)
        </>
      );
    }

    const hoje = new Date();
    const prazo = new Date(dataISO);

    const diffMs = prazo.setHours(0, 0, 0, 0) - hoje.setHours(0, 0, 0, 0);
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const dataFormatada = `${String(prazo.getDate()).padStart(2, "0")}/${String(
      prazo.getMonth() + 1
    ).padStart(2, "0")}/${prazo.getFullYear()}`;

    if (diffDias === 0) {
      return (
        <>
          {dataFormatada} -{" "}
          <span className="font-semibold text-red-500">Hoje</span>
        </>
      );
    } else if (diffDias === 1) {
      return (
        <>
          {dataFormatada} -{" "}
          <span className="font-semibold text-links">Amanhã</span>
        </>
      );
    } else if (diffDias < 1) {
      return (
        <>
          {dataFormatada} - <br></br>
          <span className="font-semibold text-red-500">
            Atrasado {Math.abs(diffDias)} dia(s)
          </span>
        </>
      );
    } else {
      return (
        <>
          {dataFormatada} - {diffDias} dias
        </>
      );
    }
  };

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

  const formatarDataPrazo = (dataPrazoISO) => {
    if (!dataPrazoISO) {
      return (
        <>
          <span className="text-text/50">Sem prazo</span> (
          <span className="text-text/50">-</span>)
        </>
      );
    }

    const hoje = new Date();
    const prazo = new Date(dataPrazoISO);

    const diffMs = prazo.setHours(0, 0, 0, 0) - hoje.setHours(0, 0, 0, 0);
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const dataFormatada = `${String(prazo.getDate()).padStart(2, "0")}/${String(
      prazo.getMonth() + 1
    ).padStart(2, "0")}/${prazo.getFullYear()}`;

    const complexidade = servico.complexidade;
    const complexidadeText =
      complexidade === null ? "-" : complexidade.toString();

    const complexidadeClass = [1, 2, 3, 4, 5].includes(complexidade)
      ? {
          1: "text-text",
          2: "text-text",
          3: "text-text",
          4: "text-text",
          5: "text-text",
        }[complexidade]
      : "text-text";

    const renderComplexidade = (
      <span className={complexidadeClass}>({complexidadeText})</span>
    );

    if (diffDias === 0) {
      return (
        <>
          {dataFormatada} -{" "}
          <span className="font-semibold text-red-500">Hoje</span>{" "}
          {renderComplexidade}
        </>
      );
    } else if (diffDias === 1) {
      return (
        <>
          {dataFormatada} -{" "}
          <span className="font-semibold text-links">Amanhã</span>{" "}
          {renderComplexidade}
        </>
      );
    } else if (diffDias < 1) {
      return (
        <>
          {dataFormatada} - <br></br>
          <span className="font-semibold text-red-500">
            Atrasado {Math.abs(diffDias)} dia(s)
          </span>
        </>
      );
    } else {
      return (
        <>
          {dataFormatada} - {diffDias} dias {renderComplexidade}
        </>
      );
    }
  };

  const comentariosOrdenados = [...comentarios].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );

  const doisMaisRecentes = comentariosOrdenados.slice(0, 2);
  const comentariosRestantes = comentariosOrdenados.slice(2);

  const modoCompacto = modoCard === "compacto" && !mostrarCompleto;
  const modoSuperCompacto = modoCard === "superCompacto" && !mostrarCompleto;

  const estiloFonte =
    modoCompacto || modoSuperCompacto ? { fontSize: "12px" } : {};

  const formatarTelefoneParaWhatsApp = (telefone) => {
    return telefone.replace(/\D/g, "");
  };

  const handleAtualizarPrazo = (novaData) => {
    setDataProximoPrazoLocal(novaData);
    setServico((prev) => ({
      ...prev,
      dataProximoPrazo: novaData,
    }));
  };

  const handleAtualizarComplexidade = (novaComplexidade) => {
    setServico((prev) => ({
      ...prev,
      complexidade: novaComplexidade,
    }));
  };

  const linhasDescricao = servico.comentariosTexto
    ? servico.comentariosTexto.split("\n")
    : [];
  const descricaoCurta = linhasDescricao.slice(0, 2).join("\n");

  return (
    <CardServicoVisual
      provided={provided}
      snapshot={snapshot}
      servico={servico}
      turno={turno}
      comentarios={comentarios}
      doisMaisRecentes={doisMaisRecentes}
      comentariosRestantes={comentariosRestantes}
      adicionandoComentario={adicionandoComentario}
      setAdicionandoComentario={setAdicionandoComentario}
      novoComentario={novoComentario}
      setNovoComentario={setNovoComentario}
      adicionarComentario={adicionarComentario}
      loading={loading}
      mostrarTodos={mostrarTodos}
      setMostrarTodos={setMostrarTodos}
      mostrarCompleto={mostrarCompleto}
      setMostrarCompleto={setMostrarCompleto}
      mostrarDirecionar={mostrarDirecionar}
      setMostrarDirecionar={setMostrarDirecionar}
      mostrarDescricaoCompleta={mostrarDescricaoCompleta}
      setMostrarDescricaoCompleta={setMostrarDescricaoCompleta}
      docDisponivel={docDisponivel}
      previaDisponivel={previaDisponivel}
      repoDisponivel={repoDisponivel}
      dataProximoPrazoLocal={dataProximoPrazoLocal}
      dataPrazoProjetoLocal={dataPrazoProjetoLocal}
      capitalizar={capitalizar}
      formatarDataHora={formatarDataHora}
      formatarTelefoneParaWhatsApp={formatarTelefoneParaWhatsApp}
      formatarDataPrazoProjetoDetalhado={formatarDataPrazoProjetoDetalhado}
      formatarDataPrazo={formatarDataPrazo}
      estiloFonte={estiloFonte}
      modoCompacto={modoCompacto}
      modoSuperCompacto={modoSuperCompacto}
      handleAtualizarPrazo={handleAtualizarPrazo}
      handleAtualizarComplexidade={handleAtualizarComplexidade}
      linhasDescricao={linhasDescricao}
      descricaoCurta={descricaoCurta}
    />
  );
}
