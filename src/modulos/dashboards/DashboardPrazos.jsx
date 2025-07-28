import { useEffect, useState } from "react";

export default function DashboardPrazos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("https://backend-gestao-paper.onrender.com/servicos")
      .then((res) => res.json())
      .then(setServicos)
      .catch((err) => console.error("Erro ao buscar serviços:", err))
      .finally(() => setCarregando(false));
  }, []);

  function formatarDuracao(contratado, concluido) {
    const inicio = new Date(contratado);
    const fim = concluido ? new Date(concluido) : new Date();
    const diff = fim - inicio;
    const dias = Math.round(diff / (1000 * 60 * 60 * 24));

    if (dias > 30) {
      const meses = Math.floor(dias / 30);
      const diasRestantes = dias % 30;
      return {
        texto: `${meses} mes${meses > 1 ? "es" : ""} ${diasRestantes} dias`,
        dias,
      };
    }

    return { texto: `${dias} dias`, dias };
  }

  function formatarData(dataString, aplicarClasse = false) {
    if (!dataString)
      return aplicarClasse ? (
        <span className="text-text/50">Não informado</span>
      ) : (
        "Não informado"
      );
    return new Date(dataString).toLocaleDateString();
  }

  function calcularDiasRestantes(dataAlvo) {
    if (!dataAlvo) return null;
    const hoje = new Date();
    const prazo = new Date(dataAlvo);
    const diff = prazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function corDiasRestantes(dias) {
    if (dias === null) return "text-text/50";
    if (dias < 0) return "text-red-600";
    return "text-white";
  }

  function ordenarPrazosProjeto(lista) {
    return [...lista].sort((a, b) => {
      const diasA = calcularDiasRestantes(a.dataPrazoProjeto);
      const diasB = calcularDiasRestantes(b.dataPrazoProjeto);

      if (diasA !== null && diasB !== null) {
        if (diasA < 0 && diasB < 0) return diasA - diasB;
        if (diasA < 0) return -1;
        if (diasB < 0) return 1;
        return diasA - diasB;
      }

      if (diasA === null && diasB === null) {
        const dataContratoA = new Date(a.dataContratacao || 0);
        const dataContratoB = new Date(b.dataContratacao || 0);
        return dataContratoA - dataContratoB;
      }

      if (diasA === null) return 1;
      if (diasB === null) return -1;

      return 0;
    });
  }

  function ordenarPorData(lista, chave) {
    return [...lista].sort((a, b) => {
      const dataA = a[chave] ? new Date(a[chave]) : new Date(0);
      const dataB = b[chave] ? new Date(b[chave]) : new Date(0);
      return dataA - dataB;
    });
  }

  const servicosOrdenados = [...servicos].sort((a, b) => {
    const dataA = new Date(a.dataContratacao);
    const dataB = new Date(b.dataContratacao);
    return dataB - dataA;
  });

  const servicosFiltrados = servicosOrdenados.filter((s) => {
    const termo = filtro.toLowerCase();
    const nomeServico = s.nome?.toLowerCase() || "";
    const nomeCliente = s.cliente?.empresa?.toLowerCase() || "";
    return nomeServico.includes(termo) || nomeCliente.includes(termo);
  });

  const ausentes = servicosFiltrados.filter(
    (s) => s.posicaoNoQuadro === "ausentes"
  );

  const servicosAtivos = servicosFiltrados.filter(
    (s) => !s.dataConclusao && s.posicaoNoQuadro !== "ausentes"
  );

  const aguardandoCliente = servicosAtivos.filter(
    (s) => s.posicaoNoQuadro === "aguardandoCliente"
  );

  const servicosComPrazoProjeto = ordenarPrazosProjeto(
    servicosAtivos.filter((s) => s.posicaoNoQuadro !== "aguardandoCliente")
  );

  const servicosComProximoPrazo = ordenarPorData(
    servicosAtivos.filter(
      (s) => s.dataProximoPrazo && s.posicaoNoQuadro !== "aguardandoCliente"
    ),
    "dataProximoPrazo"
  );

  const finalizados = servicosFiltrados
    .filter((s) => s.dataConclusao)
    .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao));

  function renderTabelaPrazos(titulo, lista, colunaData) {
    return (
      <div className="mb-12">
        <h3 className="mb-2 text-xl font-semibold text-text">
          {titulo} ({lista.length})
        </h3>
        <div className="overflow-x-auto">
          <div className="max-h-[200px] overflow-y-auto border border-border rounded-lg">
            <table className="min-w-full text-sm border-collapse table-auto">
              <thead className="sticky top-0 bg-containers text-text">
                <tr className="text-left">
                  <th className="px-4 py-2 w-[200px]">Cliente</th>
                  <th className="px-4 py-2 w-[360px]">Serviço</th>
                  <th className="px-4 py-2 w-[140px]">
                    {titulo === "Prazo das Tarefas"
                      ? "Próximo Prazo"
                      : "Prazo do Projeto"}
                  </th>
                  <th className="px-4 py-2 w-[160px]">Dias Restantes</th>
                  {titulo !== "Prazo das Tarefas" && (
                    <>
                      <th className="px-4 py-2 w-[180px]">
                        Duração do Projeto
                      </th>
                      <th className="px-4 py-2 w-[140px]">Contratação</th>
                      <th className="px-4 py-2 w-[100px]">Turno</th>
                    </>
                  )}
                  {titulo === "Prazo das Tarefas" && (
                    <th className="px-4 py-2 w-[100px]">Turno</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {lista.map((s) => {
                  const diasRestantes = calcularDiasRestantes(s[colunaData]);
                  const corTexto = corDiasRestantes(diasRestantes);
                  const textoDias =
                    diasRestantes === null
                      ? "—"
                      : diasRestantes < 0
                      ? `Atraso há ${Math.abs(diasRestantes)} dia(s)`
                      : diasRestantes;
                  const duracao = s.dataContratacao
                    ? formatarDuracao(s.dataContratacao, s.dataConclusao)
                    : null;
                  const corDuracao =
                    duracao?.dias > 60
                      ? "text-red-600"
                      : duracao?.dias > 30
                      ? "text-yellow-500"
                      : "";
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-border bg-background text-text hover:bg-buttonsHover"
                    >
                      <td className="px-4 py-2">{s.cliente?.empresa}</td>
                      <td className="px-4 py-2">{s.nome}</td>
                      <td className="px-4 py-2">
                        {formatarData(s[colunaData], true)}
                      </td>
                      <td className={`px-4 py-2 font-semibold ${corTexto}`}>
                        {textoDias}
                      </td>
                      {titulo !== "Prazo das Tarefas" && (
                        <>
                          <td className={`px-4 py-2 ${corDuracao}`}>
                            {duracao ? duracao.texto : "—"}
                          </td>
                          <td className="px-4 py-2">
                            {formatarData(s.dataContratacao)}
                          </td>
                          <td className="px-4 py-2 capitalize">
                            {s.turnoDaVez || "—"}
                          </td>
                        </>
                      )}
                      {titulo === "Prazo das Tarefas" && (
                        <td className="px-4 py-2 capitalize">
                          {s.turnoDaVez || "—"}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderTabelaFinalizados(titulo, lista) {
    return (
      <div className="mb-12">
        <h3 className="mb-2 text-xl font-semibold text-text">
          {titulo} ({lista.length})
        </h3>
        <div className="overflow-x-auto">
          <div className="max-h-[200px] overflow-y-auto border border-border rounded-lg">
            <table className="min-w-full text-sm border-collapse table-auto">
              <thead className="sticky top-0 bg-containers text-text">
                <tr className="text-left">
                  <th className="px-4 py-2 w-[200px]">Cliente</th>
                  <th className="px-4 py-2 w-[530px]">Serviço</th>
                  <th className="px-4 py-2 w-[140px]">Contratação</th>
                  <th className="px-4 py-2 w-[140px]">Conclusão</th>
                  <th className="px-4 py-2 w-[180px]">Duração do Projeto</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((s) => {
                  const duracao = s.dataContratacao
                    ? formatarDuracao(s.dataContratacao, s.dataConclusao)
                    : null;
                  const corDuracao =
                    duracao?.dias > 60
                      ? "text-red-600"
                      : duracao?.dias > 30
                      ? "text-yellow-500"
                      : "";
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-border bg-background text-text hover:bg-buttonsHover"
                    >
                      <td className="px-4 py-2">{s.cliente?.empresa}</td>
                      <td className="px-4 py-2">{s.nome}</td>
                      <td className="px-4 py-2">
                        {s.dataContratacao
                          ? new Date(s.dataContratacao).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {s.dataConclusao
                          ? new Date(s.dataConclusao).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className={`px-4 py-2 ${corDuracao}`}>
                        {duracao ? duracao.texto : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-text">Prazos</h2>

      <input
        type="text"
        placeholder="Buscar serviço ou cliente..."
        className="w-full max-w-md px-3 py-2 mb-4 border rounded border-border bg-inputBg text-text placeholder:text-gray-400 focus:outline-none focus:ring-2"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {carregando ? (
        <p className="text-gray-500">Carregando serviços...</p>
      ) : (
        <>
          {renderTabelaPrazos(
            "Serviços ativos",
            servicosComPrazoProjeto,
            "dataPrazoProjeto"
          )}
          {renderTabelaPrazos(
            "Tarefas ativas",
            servicosComProximoPrazo,
            "dataProximoPrazo"
          )}
          {renderTabelaPrazos(
            "Aguardando Cliente",
            aguardandoCliente,
            "dataPrazoProjeto"
          )}
          {renderTabelaPrazos(
            "Clientes Ausentes",
            ausentes,
            "dataPrazoProjeto"
          )}
          {renderTabelaFinalizados("Serviços Finalizados", finalizados)}
        </>
      )}
    </div>
  );
}
