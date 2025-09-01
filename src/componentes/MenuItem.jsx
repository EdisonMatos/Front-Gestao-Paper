import { Loader2 } from "lucide-react";

export default function MenuItem({
  turno,
  label,
  Icon,
  abaAtiva,
  setAbaAtiva,
  count = 0,
  loading = false, // nova prop
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

        <div>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white/10 ms-3" />
          ) : (
            count > 0 && (
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 text-sm font-medium rounded-full ms-3 bg-inputBg text-links">
                {count}
              </span>
            )
          )}
        </div>
      </button>
    </li>
  );
}
