import { useEffect, useState } from "react";

export default function QuadroPrazos() {
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

  // Filtra pelo input (busca por nome do serviço ou cliente)
  const servicosFiltrados = servicos.filter((s) => {
    const termo = filtro.toLowerCase();
    const nomeServico = s.nome?.toLowerCase() || "";
    const nomeCliente = s.cliente?.empresa?.toLowerCase() || "";
    return nomeServico.includes(termo) || nomeCliente.includes(termo);
  });

  function formatarData(dataString) {
    if (!dataString) return "—";
    return new Date(dataString).toLocaleDateString();
  }

  // Calcula dias restantes para a data alvo (prazo)
  function calcularDiasRestantes(dataAlvo) {
    if (!dataAlvo) return null;
    const hoje = new Date();
    const prazo = new Date(dataAlvo);
    const diff = prazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); // positivo se no prazo, negativo se atrasado
  }

  // Define a cor do texto para dias restantes
  function corDiasRestantes(dias) {
    if (dias === null) return "";
    if (dias < 0) return "text-red-600"; // atraso
    return "text-white"; // dentro do prazo
  }

  function ordenarPorData(lista, chave) {
    return [...lista].sort((a, b) => {
      const dataA = a[chave] ? new Date(a[chave]) : new Date(0);
      const dataB = b[chave] ? new Date(b[chave]) : new Date(0);
      return dataA - dataB;
    });
  }

  // Serviços com prazo do projeto definido e ativos (sem dataConclusao)
  const servicosComPrazoProjeto = ordenarPorData(
    servicosFiltrados.filter((s) => s.dataPrazoProjeto && !s.dataConclusao),
    "dataPrazoProjeto"
  );

  // Serviços com próximo prazo definido e ativos (sem dataConclusao)
  const servicosComProximoPrazo = ordenarPorData(
    servicosFiltrados.filter((s) => s.dataProximoPrazo && !s.dataConclusao),
    "dataProximoPrazo"
  );

  function renderTabelaPrazos(titulo, lista, colunaData) {
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
                  <th className="px-4 py-2 w-[560px]">Serviço</th>
                  <th className="px-4 py-2 w-[200px]">Cliente</th>
                  <th className="px-4 py-2 w-[140px]">
                    {titulo === "Prazos do Projeto"
                      ? "Prazo do Projeto"
                      : "Próximo Prazo"}
                  </th>
                  <th className="px-4 py-2 w-[240px]">Dias Restantes</th>
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
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-border bg-background text-text"
                    >
                      <td className="px-4 py-2">{s.nome}</td>
                      <td className="px-4 py-2">{s.cliente?.empresa}</td>
                      <td className="px-4 py-2">
                        {formatarData(s[colunaData])}
                      </td>
                      <td className={`px-4 py-2 font-semibold ${corTexto}`}>
                        {textoDias}
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
      <h2 className="mb-4 text-2xl font-bold text-text">Prazos dos Serviços</h2>

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
            "Prazos do Projeto",
            servicosComPrazoProjeto,
            "dataPrazoProjeto"
          )}
          {renderTabelaPrazos(
            "Próximos Prazos",
            servicosComProximoPrazo,
            "dataProximoPrazo"
          )}
        </>
      )}
    </div>
  );
}
