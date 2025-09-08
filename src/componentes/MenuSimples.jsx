export default function MenuSimples({
  turno,
  label,
  Icon,
  abaAtiva,
  setAbaAtiva,
  allowedRoles = [],
}) {
  const role = localStorage.getItem("setor");
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return null;
  }

  return (
    <li>
      <button
        onClick={() => setAbaAtiva(turno)}
        className={`flex justify-between items-center p-2 w-full rounded-lg group ${
          abaAtiva === turno
            ? "text-white bg-background"
            : " text-white/50 hover:bg-background"
        }`}
      >
        <div className="flex">
          <Icon
            className={`${abaAtiva === turno ? "text-links" : "text-white/50"}`}
          />
          <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
        </div>

        <div></div>
      </button>
    </li>
  );
}
