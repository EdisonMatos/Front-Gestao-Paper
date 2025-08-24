import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Função para converter ISO datetime para string yyyy-mm-dd para input type=date
function toInputDateString(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset).toISOString();
  return localISO.split("T")[0];
}

// Função para converter string yyyy-mm-dd do input para objeto Date local
function fromInputDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function AcaoMudarPrazosEDatas({
  servico,
  subAcaoDatasPrazos,
  setSubAcaoDatasPrazos,
  onFechar,
  onAtualizarPrazo,
}) {
  const [loading, setLoading] = useState(false);

  const [datas, setDatas] = useState({
    dataContratacao: toInputDateString(servico.dataContratacao),
    dataInfosColetadas: toInputDateString(servico.dataInfosColetadas),
    dataDocPronto: toInputDateString(servico.dataDocPronto),
    dataEnvioPrevia: toInputDateString(servico.dataEnvioPrevia),
    dataConclusao: toInputDateString(servico.dataConclusao),
    dataProximoPrazo: toInputDateString(servico.dataProximoPrazo),
    dataPrazoProjeto: toInputDateString(servico.dataPrazoProjeto),
  });

  const handleDatasChange = (e) => {
    const { name, value } = e.target;
    setDatas((prev) => ({ ...prev, [name]: value }));
  };

  const salvarDatas = async () => {
    setLoading(true);
    try {
      const payload = {
        ...servico,
        dataContratacao: fromInputDateString(
          datas.dataContratacao
        )?.toISOString(),
        dataInfosColetadas: fromInputDateString(
          datas.dataInfosColetadas
        )?.toISOString(),
        dataDocPronto: fromInputDateString(datas.dataDocPronto)?.toISOString(),
        dataEnvioPrevia: fromInputDateString(
          datas.dataEnvioPrevia
        )?.toISOString(),
        dataConclusao: fromInputDateString(datas.dataConclusao)?.toISOString(),
      };

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        payload
      );

      toast.success("Datas atualizadas com sucesso!", { autoClose: 1000 });

      onAtualizarPrazo(datas.dataPrazoProjeto || null);

      onFechar();
    } catch (err) {
      console.error("Erro ao salvar datas:", err);
      alert("Erro ao salvar datas.");
    } finally {
      setLoading(false);
    }
  };

  const salvarPrazos = async () => {
    setLoading(true);
    try {
      const payload = {
        ...servico,
        dataProximoPrazo: fromInputDateString(
          datas.dataProximoPrazo
        )?.toISOString(),
        dataPrazoProjeto: fromInputDateString(
          datas.dataPrazoProjeto
        )?.toISOString(),
      };

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        payload
      );

      toast.success("Prazos atualizados com sucesso!", { autoClose: 1000 });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      if (onAtualizarPrazo) {
        onAtualizarPrazo(datas.dataProximoPrazo || null);
      }

      onFechar();
    } catch (err) {
      console.error("Erro ao salvar prazos:", err);
      alert("Erro ao salvar prazos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <select
        value={subAcaoDatasPrazos}
        onChange={(e) => setSubAcaoDatasPrazos(e.target.value)}
        className="w-full p-1 border rounded bg-inputBg text-text border-border"
      >
        <option value="">Escolha o que deseja alterar:</option>
        <option value="datas">Mudar datas</option>
        <option value="prazos">Mudar prazos</option>
      </select>

      {subAcaoDatasPrazos === "datas" && (
        <>
          <div>
            <div className="text-text">Data de contratação:</div>
            <input
              type="date"
              name="dataContratacao"
              value={datas.dataContratacao}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div>
            <div className="text-text">Data de infos coletadas:</div>
            <input
              type="date"
              name="dataInfosColetadas"
              value={datas.dataInfosColetadas}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div>
            <div className="text-text">Data de documento pronto:</div>
            <input
              type="date"
              name="dataDocPronto"
              value={datas.dataDocPronto}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div>
            <div className="text-text">Data de envio prévia:</div>
            <input
              type="date"
              name="dataEnvioPrevia"
              value={datas.dataEnvioPrevia}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div>
            <div className="text-text">Data de conclusão:</div>
            <input
              type="date"
              name="dataConclusao"
              value={datas.dataConclusao}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={salvarDatas}
              disabled={loading}
              className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={onFechar}
              className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {subAcaoDatasPrazos === "prazos" && (
        <>
          <div className="">
            <div className="text-text">Data do prazo do projeto:</div>
            <input
              type="date"
              name="dataPrazoProjeto"
              value={datas.dataPrazoProjeto}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div className="">
            <div className=" text-text">Data do próximo prazo:</div>
            <input
              type="date"
              name="dataProximoPrazo"
              value={datas.dataProximoPrazo}
              onChange={handleDatasChange}
              className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={salvarPrazos}
              disabled={loading}
              className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={onFechar}
              className="px-2 py-1 text-sm text-black bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </>
  );
}
