export default function MenuItemPrazos({
  label,
  Icon,
  abaAtiva,
  setAbaAtiva,
  servicos,
}) {
  function calcularDiasRestantes(dataAlvo) {
    if (!dataAlvo) return null;
    const hoje = new Date();
    const prazo = new Date(dataAlvo);
    const diff = prazo.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Serviços ativos = sem dataConclusao e não "ausentes"
  const servicosAtivos = servicos.filter(
    (s) => !s.dataConclusao && s.posicaoNoQuadro !== "ausentes"
  );

  // Quantos têm dataPrazoProjeto = hoje OU dataProximoPrazo = hoje
  const count = servicosAtivos.filter((s) => {
    const diasProjeto = calcularDiasRestantes(s.dataPrazoProjeto);
    const diasTarefa = calcularDiasRestantes(s.dataProximoPrazo);
    return diasProjeto === 0 || diasTarefa === 0;
  }).length;

  return (
    <li>
      <button
        onClick={() => setAbaAtiva("prazos")}
        className={`flex justify-between items-center p-2 w-full rounded-lg group ${
          abaAtiva === "prazos"
            ? "text-white bg-background"
            : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
        }`}
      >
        <div className="flex">
          <Icon
            className={`${
              abaAtiva === "prazos" ? "text-links" : "text-white/50"
            }`}
          />
          <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
        </div>
        {count > 0 && (
          <div>
            <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium bg-red-100 rounded-full text-links ms-3 dark:bg-inputBg dark:text-links">
              {count}
            </span>
          </div>
        )}
      </button>
    </li>
  );
}
