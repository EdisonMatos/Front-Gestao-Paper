import { useEffect, useState } from "react";

export default function DashboardServicos() {
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

  const servicosOrdenados = [...servicos].sort((a, b) => {
    const dataA = new Date(a.dataContratacao);
    const dataB = new Date(b.dataContratacao);
    return dataB - dataA; // mais recente primeiro
  });

  // Filtra pelo input de busca, buscando em nome do serviço e cliente (case insensitive)
  const servicosFiltrados = servicosOrdenados.filter((s) => {
    const termo = filtro.toLowerCase();
    const nomeServico = s.nome?.toLowerCase() || "";
    const nomeCliente = s.cliente?.empresa?.toLowerCase() || "";
    return nomeServico.includes(termo) || nomeCliente.includes(termo);
  });

  const ativos = servicosFiltrados.filter((s) => !s.dataConclusao);
  const finalizados = servicosFiltrados.filter((s) => s.dataConclusao);

  function renderTabelaAtivos(titulo, lista) {
    return (
      <div className="mb-12">
        <h3 className="mb-2 text-xl font-semibold text-text">
          {titulo} ({lista.length})
        </h3>
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg">
            <table className="min-w-full border-collapse table-auto">
              <thead className="sticky top-0 bg-containers text-text">
                <tr className="text-left">
                  <th className="px-4 py-2 w-[500px]">Serviço</th>
                  <th className="px-4 py-2 w-[200px]">Cliente</th>
                  <th className="px-4 py-2 w-[120px]">Turno</th>
                  <th className="px-4 py-2 w-[140px]">Contratação</th>
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
                      className="border-t border-border bg-background text-text"
                    >
                      <td className="px-4 py-2">{s.nome}</td>
                      <td className="px-4 py-2">{s.cliente?.empresa}</td>
                      <td className="px-4 py-2 capitalize">
                        {s.turnoDaVez || "—"}
                      </td>
                      <td className="px-4 py-2">
                        {s.dataContratacao
                          ? new Date(s.dataContratacao).toLocaleDateString()
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

  function renderTabelaFinalizados(titulo, lista) {
    return (
      <div className="mb-12">
        <h3 className="mb-2 text-xl font-semibold text-text">
          {titulo} ({lista.length})
        </h3>
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg">
            <table className="min-w-full border-collapse table-auto">
              <thead className="sticky top-0 bg-containers text-text">
                <tr className="text-left">
                  <th className="px-4 py-2 w-[300px]">Serviço</th>
                  <th className="px-4 py-2 w-[200px]">Cliente</th>
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
                      className="border-t border-border bg-background text-text"
                    >
                      <td className="px-4 py-2">{s.nome}</td>
                      <td className="px-4 py-2">{s.cliente?.empresa}</td>
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
    <div className="">
      <h2 className="mb-4 text-2xl font-bold text-text">Serviços</h2>

      <input
        type="text"
        placeholder="Buscar serviço ou cliente..."
        className="w-full max-w-md px-3 py-2 mb-4 border rounded border-border bg-inputBg text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 "
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {carregando ? (
        <p className="text-gray-500">Carregando serviços...</p>
      ) : (
        <>
          {renderTabelaAtivos("Serviços Ativos", ativos)}
          {renderTabelaFinalizados("Serviços Finalizados", finalizados)}
        </>
      )}
    </div>
  );
}
