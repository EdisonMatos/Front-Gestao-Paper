// AddNovoServico.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ServCriacaoDeLpi from "./ServCriacaoDeLpi";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";
const CLIENTES_URL = "https://backend-gestao-paper.onrender.com/clientes";

function toInputDateString(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset).toISOString();
  return localISO.split("T")[0];
}

function fromInputDateString(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function AddNovoServico({
  servicoParaEditar = null,
  onSalvo,
  onCancelar,
}) {
  const [form, setForm] = useState({
    id: null,
    nome: "",
    clienteId: "",
    clienteNome: "",
    linkDoc: "",
    linkPreviaVercel: "",
    linkRepoGithub: "",
    turnoDaVez: "",
    comentariosTexto: "",
    dataContratacao: "",
    dataInfosColetadas: "",
    dataDocPronto: "",
    dataEnvioPrevia: "",
    dataConclusao: "",
    dataProximoPrazo: "",
    dataPrazoProjeto: "",
  });

  const [clienteBusca, setClienteBusca] = useState("");
  const [sugestoesClientes, setSugestoesClientes] = useState([]);
  const [mostrarOutroNome, setMostrarOutroNome] = useState(false);

  // estado para guardar os dados do componente ServCriacaoDeLpi
  const [servCriacaoData, setServCriacaoData] = useState({});

  // novo estado para o option adicional "Criar contrato e link de pagamento?"
  const [criarContratoFaturamento, setCriarContratoFaturamento] =
    useState("Selecione");

  const isEdicao = !!servicoParaEditar;

  useEffect(() => {
    if (servicoParaEditar) {
      setForm({
        id: servicoParaEditar.id,
        nome: servicoParaEditar.nome || "",
        clienteId: servicoParaEditar.clienteId || "",
        clienteNome: servicoParaEditar.cliente?.empresa || "",
        linkDoc: servicoParaEditar.linkDoc || "",
        linkPreviaVercel: servicoParaEditar.linkPreviaVercel || "",
        linkRepoGithub: servicoParaEditar.linkRepoGithub || "",
        turnoDaVez: servicoParaEditar.turnoDaVez || "",
        comentariosTexto: servicoParaEditar.comentariosTexto || "",
        dataContratacao: servicoParaEditar.dataContratacao
          ? toInputDateString(servicoParaEditar.dataContratacao)
          : "",
        dataInfosColetadas: servicoParaEditar.dataInfosColetadas
          ? toInputDateString(servicoParaEditar.dataInfosColetadas)
          : "",
        dataDocPronto: servicoParaEditar.dataDocPronto
          ? toInputDateString(servicoParaEditar.dataDocPronto)
          : "",
        dataEnvioPrevia: servicoParaEditar.dataEnvioPrevia
          ? toInputDateString(servicoParaEditar.dataEnvioPrevia)
          : "",
        dataConclusao: servicoParaEditar.dataConclusao
          ? toInputDateString(servicoParaEditar.dataConclusao)
          : "",
        dataProximoPrazo: servicoParaEditar.dataProximoPrazo
          ? toInputDateString(servicoParaEditar.dataProximoPrazo)
          : "",
        dataPrazoProjeto: servicoParaEditar.dataPrazoProjeto
          ? toInputDateString(servicoParaEditar.dataPrazoProjeto)
          : "",
      });
      setClienteBusca(servicoParaEditar.cliente?.empresa || "");
    }
  }, [servicoParaEditar]);

  useEffect(() => {
    const controller = new AbortController();

    const buscarClientes = async (termo) => {
      if (!termo) {
        setSugestoesClientes([]);
        return;
      }
      try {
        const res = await axios.get(CLIENTES_URL, {
          signal: controller.signal,
        });
        const filtrados = res.data.filter(
          (cliente) =>
            cliente.empresa.toLowerCase().includes(termo.toLowerCase()) ||
            cliente.representante.toLowerCase().includes(termo.toLowerCase())
        );
        setSugestoesClientes(filtrados.slice(0, 3));
      } catch (err) {
        if (axios.isCancel(err)) {
          // requisição cancelada — não faz nada
        } else {
          console.error("Erro ao buscar clientes", err);
        }
      }
    };

    if (clienteBusca.length > 1) {
      buscarClientes(clienteBusca);
    } else {
      setSugestoesClientes([]);
    }

    return () => controller.abort(); // cancela requisição anterior ao mudar clienteBusca
  }, [clienteBusca]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // monta a descrição final a partir dos dados do ServCriacaoDeLpi + o campo comentariosTexto
  function montarDescricaoCriacaoLP(servData, comentariosExistentes) {
    if (!servData || Object.keys(servData).length === 0)
      return comentariosExistentes || "";

    const parts = [];

    if (servData.tipoCliente) parts.push(servData.tipoCliente);
    if (servData.tipoPagina) parts.push(servData.tipoPagina);
    if (servData.formato) parts.push(servData.formato);
    if (servData.diasPrazo) parts.push(`${servData.diasPrazo}D`);
    if (servData.pagamento) parts.push(servData.pagamento);
    if (servData.valor) parts.push(servData.valor);

    const firstLine = parts.join(" ");

    const contatoLines = [];
    if (servData.nome) contatoLines.push(servData.nome);

    if (servData.cpfCnpj) {
      const digits = servData.cpfCnpj.replace(/\D/g, "");
      if (digits.length > 11) {
        contatoLines.push(`CNPJ: ${servData.cpfCnpj}`);
      } else {
        contatoLines.push(`CPF: ${servData.cpfCnpj}`);
      }
    }

    if (servData.email) contatoLines.push(servData.email);
    if (servData.telefone) contatoLines.push(servData.telefone);

    let resultado = "";

    if (firstLine) {
      resultado += firstLine + "\n\n";
    }

    if (contatoLines.length > 0) {
      resultado += contatoLines.join("\n") + "\n\n";
    }

    if (comentariosExistentes && comentariosExistentes.trim() !== "") {
      resultado += `Obs: ${comentariosExistentes}`;
    } else {
      resultado = resultado.trim();
    }

    return resultado;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Salvando serviço...");

    try {
      const payload = { ...form };

      payload.dataContratacao = fromInputDateString(form.dataContratacao);
      payload.dataInfosColetadas = fromInputDateString(form.dataInfosColetadas);
      payload.dataDocPronto = fromInputDateString(form.dataDocPronto);
      payload.dataEnvioPrevia = fromInputDateString(form.dataEnvioPrevia);
      payload.dataConclusao = fromInputDateString(form.dataConclusao);
      payload.dataProximoPrazo = fromInputDateString(form.dataProximoPrazo);
      payload.dataPrazoProjeto = fromInputDateString(form.dataPrazoProjeto);

      // Se for Criação de LP, compor a descrição a partir dos dados do ServCriacaoDeLpi + comentariosTexto
      const nomeDoServico = form.nome;
      if (nomeDoServico === "Criação de LP") {
        const composed = montarDescricaoCriacaoLP(
          servCriacaoData,
          form.comentariosTexto
        );
        payload.comentariosTexto = composed;
      }

      // manter compatibilidade com o que já existia (apaga clienteNome antes de enviar)
      delete payload.clienteNome;

      if (form.id) {
        // ***EDIÇÃO: não mexe na posicaoNoQuadro***
        await axios.put(`${API_URL}/${form.id}`, payload);
        toast.update(toastId, {
          render: "Serviço atualizado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        onSalvo();
      } else {
        // ***CRIAÇÃO: define como backlog***
        payload.posicaoNoQuadro = "backlog";

        await axios.post(API_URL, payload);

        // Se a opção "Criar contrato e link de pagamento?" estiver como "Sim"
        if (
          nomeDoServico === "Criação de LP" &&
          criarContratoFaturamento === "Sim"
        ) {
          const novoServicoContrato = {
            ...payload,
            nome: "Contrato e Faturamento",
            turnoDaVez: "financeiro",
          };
          delete novoServicoContrato.id;
          await axios.post(API_URL, novoServicoContrato);
        }

        toast.update(toastId, {
          render: "Serviço adicionado com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      toast.update(toastId, {
        render: "Erro ao salvar serviço.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded border-border md:grid-cols-3 bg-background text-text"
    >
      {!isEdicao ? (
        <>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Nome do serviço*</label>
            <select
              name="nome"
              value={mostrarOutroNome ? "Outro" : form.nome}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Outro") {
                  setMostrarOutroNome(true);
                  setForm((prev) => ({ ...prev, nome: "" }));
                } else {
                  setMostrarOutroNome(false);
                  setForm((prev) => ({ ...prev, nome: value }));
                }
              }}
              required
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            >
              <option value="">Selecione</option>
              <option value="Criação de LP">Criação de LP</option>
              <option value="Manutenção de LP">Manutenção de LP</option>
              <option value="Contrato e Faturamento">
                Contrato e Faturamento
              </option>
              <option value="Criação de Artes">Criação de Artes</option>
              <option value="Template Paper">Template Paper</option>
              <option value="Outro">Outro... (digitar)</option>
            </select>
          </div>
          {mostrarOutroNome && (
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Digite o nome</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Digite o nome"
                className="p-2 border rounded bg-inputBg text-placeholder border-border"
                required
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Nome do serviço*</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>
      )}

      <div className="relative flex flex-col">
        <label className="mb-1 text-sm font-medium">Selecione o Cliente*</label>
        <input
          type="text"
          value={clienteBusca || form.clienteNome} // <-- usa busca se estiver digitando, senão usa o nome salvo
          onChange={(e) => {
            setClienteBusca(e.target.value);
            setForm((prev) => ({
              ...prev,
              clienteId: "", // limpa ID ao digitar manualmente
              clienteNome: e.target.value, // enquanto digita, mostra texto no campo
            }));
          }}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
          placeholder="Digite o nome da empresa ou representante"
        />
        {sugestoesClientes.length > 0 && (
          <ul className="absolute z-10 w-full border rounded shadow bg-background">
            {sugestoesClientes.map((cliente) => (
              <li
                key={cliente.id}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    clienteId: cliente.id,
                    clienteNome: `${cliente.empresa} | ${cliente.representante}`,
                  }));
                  setClienteBusca(""); // <-- zera busca ao selecionar
                  setSugestoesClientes([]); // esconde lista imediatamente
                }}
                className="px-2 py-1 cursor-pointer hover:bg-inputBg"
              >
                {cliente.empresa} | {cliente.representante}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Turno da Vez*</label>
        <select
          name="turnoDaVez"
          value={form.turnoDaVez}
          onChange={handleChange}
          required
          className="p-2 border rounded text-placeholder bg-inputBg"
        >
          <option value="">Selecione</option>
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
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Data de Contratação*</label>
        <input
          type="date"
          name="dataContratacao"
          value={form.dataContratacao}
          onChange={handleChange}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>
      {form.nome !== "Criação de LP" && form.nome !== "Criação de Artes" && (
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Data do Próximo Prazo
          </label>
          <input
            type="date"
            name="dataProximoPrazo"
            value={form.dataProximoPrazo}
            onChange={handleChange}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>
      )}

      {form.nome !== "Criação de LP" && form.nome !== "Criação de Artes" && (
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">
            Data do Prazo do Projeto
          </label>
          <input
            type="date"
            name="dataPrazoProjeto"
            value={form.dataPrazoProjeto}
            onChange={handleChange}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>
      )}

      <div className="flex flex-col md:col-span-3">
        <label className="mb-1 text-sm font-medium">
          Descrição / Comentários
        </label>
        <textarea
          name="comentariosTexto"
          value={form.comentariosTexto}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
          rows={3}
          placeholder="Digite aqui comentários ou uma descrição do serviço..."
        />
      </div>

      {/* Mostrar o bloco ServCriacaoDeLpi quando for Criação de LP */}
      {((!isEdicao && form.nome === "Criação de LP" && !mostrarOutroNome) ||
        (isEdicao && form.nome === "Criação de LP")) && (
        <>
          <ServCriacaoDeLpi
            initialData={{}}
            onChange={(data) => {
              setServCriacaoData(data || {});
            }}
          />
          {/* Novo select "Criar contrato e link de pagamento?" */}
          {!isEdicao && (
            <div className="flex flex-col mt-3 md:col-span-3">
              <label className="mb-1 text-sm font-medium">
                Precisa de contrato e link de pagamento?
              </label>
              <select
                value={criarContratoFaturamento}
                onChange={(e) => setCriarContratoFaturamento(e.target.value)}
                className="p-2 border rounded bg-inputBg text-placeholder border-border"
                required
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
          )}
        </>
      )}

      {isEdicao && (
        <>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Link do Documento
            </label>
            <input
              name="linkDoc"
              value={form.linkDoc}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Link Prévia Vercel
            </label>
            <input
              name="linkPreviaVercel"
              value={form.linkPreviaVercel}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Link do Repositório Github
            </label>
            <input
              name="linkRepoGithub"
              value={form.linkRepoGithub}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Coleta de Informações
            </label>
            <input
              type="date"
              name="dataInfosColetadas"
              value={form.dataInfosColetadas}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data do Documento Pronto
            </label>
            <input
              type="date"
              name="dataDocPronto"
              value={form.dataDocPronto}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Envio da Prévia
            </label>
            <input
              type="date"
              name="dataEnvioPrevia"
              value={form.dataEnvioPrevia}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
              Data de Conclusão
            </label>
            <input
              type="date"
              name="dataConclusao"
              value={form.dataConclusao}
              onChange={handleChange}
              className="p-2 border rounded bg-inputBg text-placeholder border-border"
            />
          </div>
        </>
      )}

      <div className="flex col-span-1 gap-4 md:col-span-3">
        <button
          type="submit"
          className="px-6 text-black transition rounded bg-buttonsHover hover:bg-buttons"
        >
          {form.id ? "Atualizar Serviço" : "Adicionar Serviço"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-2 text-white transition rounded bg-secondaryButtons hover:bg-secondaryButtonsHover"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
