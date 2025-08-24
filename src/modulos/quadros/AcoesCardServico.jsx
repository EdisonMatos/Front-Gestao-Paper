import { useState } from "react";
import AcaoMudarComplexidade from "./AcaoMudarComplexidade";
import AcaoDirecionarServico from "./AcaoDirecionarServico";
import AcaoMudarPrazosEDatas from "./AcaoMudarPrazosEDatas";

// Função para converter ISO datetime para string yyyy-mm-dd para input type=date
function toInputDateString(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset).toISOString();
  return localISO.split("T")[0];
}

export default function AcoesCardServico({
  servico,
  turno,
  capitalizar,
  onFechar,
  onAtualizarPrazo,
  onAtualizarComplexidade,
}) {
  const [acaoSelecionada, setAcaoSelecionada] = useState("");
  const [subAcaoDatasPrazos, setSubAcaoDatasPrazos] = useState("");

  return (
    <div className="mb-2 space-y-2 text-sm">
      <select
        value={acaoSelecionada}
        onChange={(e) => {
          setAcaoSelecionada(e.target.value);
          setSubAcaoDatasPrazos("");
        }}
        className="w-full p-1 border rounded bg-inputBg text-text border-border"
      >
        <option value="">Selecione a ação:</option>
        <option value="direcionar">Direcionar serviço</option>
        <option value="mudarComplexidade">Mudar complexidade tarefa</option>
        <option value="mudarDatasPrazos">Mudar datas e prazos</option>
      </select>

      {acaoSelecionada === "mudarDatasPrazos" && (
        <AcaoMudarPrazosEDatas
          servico={servico}
          subAcaoDatasPrazos={subAcaoDatasPrazos}
          setSubAcaoDatasPrazos={setSubAcaoDatasPrazos}
          onFechar={onFechar}
          onAtualizarPrazo={onAtualizarPrazo}
        />
      )}

      {acaoSelecionada === "direcionar" && (
        <AcaoDirecionarServico
          servico={servico}
          turno={turno}
          capitalizar={capitalizar}
          onFechar={onFechar}
        />
      )}

      {acaoSelecionada === "mudarComplexidade" && (
        <AcaoMudarComplexidade
          servico={servico}
          onAtualizarComplexidade={onAtualizarComplexidade}
          onFechar={onFechar}
        />
      )}
    </div>
  );
}
