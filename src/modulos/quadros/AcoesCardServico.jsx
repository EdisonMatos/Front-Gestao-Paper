// components/AcoesCardServico.jsx
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
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [comentarioDirecionar, setComentarioDirecionar] = useState("");
  const [novaComplexidadeDirecionar, setNovaComplexidadeDirecionar] =
    useState("");
  const [novaDataPrazo, setNovaDataPrazo] = useState(
    toInputDateString(servico.dataProximoPrazo)
  );
  const [novaComplexidade, setNovaComplexidade] = useState(
    servico.complexidade !== null ? servico.complexidade.toString() : ""
  );
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

  const direcionarServico = async () => {
    if (!comentarioDirecionar.trim()) return alert("Comentário é obrigatório.");
    if (!setorSelecionado) return alert("Setor é obrigatório.");
    if (!novaComplexidadeDirecionar)
      return alert("Complexidade é obrigatória.");
    if (!novaDataPrazo) return alert("Atualizar prazo é obrigatório.");

    setLoading(true);
    try {
      const novaDataISO = fromInputDateString(novaDataPrazo).toISOString();

      await axios.post(
        "https://backend-gestao-paper.onrender.com/comentarios",
        {
          servicoId: servico.id,
          texto: comentarioDirecionar.trim(),
          feitoPor: capitalizar(turno),
          setor: turno,
        }
      );

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          turnoDaVez: setorSelecionado,
          posicaoNoQuadro: "backlog",
          ordemVerticalNoQuadro: null,
          complexidade: parseFloat(novaComplexidadeDirecionar),
          dataProximoPrazo: novaDataISO,
        }
      );

      toast.success("Direcionado com sucesso!", { autoClose: 1000 });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      onFechar();
    } catch (err) {
      console.error("Erro ao direcionar:", err);
      alert("Erro ao direcionar serviço.");
    } finally {
      setLoading(false);
    }
  };

  const mudarComplexidade = async () => {
    if (!novaComplexidade) return alert("Selecione uma complexidade.");

    setLoading(true);
    try {
      const complexidadeFloat = parseFloat(novaComplexidade);

      await axios.put(
        `https://backend-gestao-paper.onrender.com/servicos/${servico.id}`,
        {
          ...servico,
          complexidade: complexidadeFloat,
        }
      );

      toast.success("Complexidade alterada com sucesso!", { autoClose: 1000 });
      onAtualizarComplexidade(complexidadeFloat);
      onFechar();
    } catch (err) {
      console.error("Erro ao mudar complexidade:", err);
      alert("Erro ao mudar complexidade.");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Removida opção 'mudarPrazo' */}
        <option value="mudarComplexidade">Mudar complexidade tarefa</option>
        <option value="mudarDatasPrazos">Mudar datas e prazos</option>
      </select>

      {acaoSelecionada === "mudarDatasPrazos" && (
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
      )}

      {acaoSelecionada === "direcionar" && (
        <>
          <select
            value={setorSelecionado}
            onChange={(e) => setSetorSelecionado(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-text border-border"
          >
            <option value="">Selecione o setor:</option>
            <option value="suporte">Suporte</option>
            <option value="dev">Dev</option>
            <option value="webmaster">Webmaster</option>
            <option value="comercial">Comercial</option>
            <option value="trafego">Tráfego Pago</option>
            <option value="socialmedia">Social Media</option>
            <option value="feedbacks">Feedbacks</option>
            <option value="financeiro">Financeiro</option>
            <option value="diretoria">Diretoria</option>
          </select>

          <select
            value={novaComplexidadeDirecionar}
            onChange={(e) => setNovaComplexidadeDirecionar(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-text border-border"
          >
            <option value="">Selecione a complexidade</option>
            <option value="1">1 - Muito simples (até 15 min)</option>
            <option value="2">2 - Simples (até 30min)</option>
            <option value="3">3 - Moderado (Até 1h)</option>
            <option value="4">4 - Demorada (Acima 1h)</option>
            <option value="5">5 - Muito longa (Conversar)</option>
          </select>
          <p className="text-text/80">Selecione o novo prazo da tarefa:</p>
          <input
            type="date"
            value={novaDataPrazo}
            onChange={(e) => setNovaDataPrazo(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          />
          <input
            type="text"
            value={comentarioDirecionar}
            onChange={(e) => setComentarioDirecionar(e.target.value)}
            placeholder="Comente no padrão estabelecido."
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          />
          <div className="flex gap-2">
            <button
              onClick={direcionarServico}
              disabled={loading}
              className="px-2 py-1 text-sm text-black rounded bg-buttonsHover hover:bg-buttons"
            >
              {loading ? "Enviando..." : "Direcionar"}
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

      {acaoSelecionada === "mudarComplexidade" && (
        <>
          <label className="block text-text">Selecione a complexidade:</label>
          <select
            value={novaComplexidade}
            onChange={(e) => setNovaComplexidade(e.target.value)}
            className="w-full p-1 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione a complexidade</option>
            <option value="1">1 - Muito simples</option>
            <option value="2">2 - Simples</option>
            <option value="3">3 - Moderada</option>
            <option value="4">4 - Demorada</option>
            <option value="5">5 - Muito complexa</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={mudarComplexidade}
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
    </div>
  );
}
