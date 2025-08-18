export default function MenuItem({
  turno,
  label,
  Icon,
  abaAtiva,
  setAbaAtiva,
  servicos,
}) {
  const count = servicos.filter(
    (s) =>
      s.turnoDaVez === turno &&
      (s.posicaoNoQuadro === null || s.posicaoNoQuadro === "backlog")
  ).length;

  return (
    <li>
      <button
        onClick={() => setAbaAtiva(turno)}
        className={`flex justify-between items-center p-2 w-full rounded-lg group ${
          abaAtiva === turno
            ? "text-white bg-background"
            : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
        }`}
      >
        <div className="flex">
          <Icon
            className={`${abaAtiva === turno ? "text-links" : "text-white/50"}`}
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
