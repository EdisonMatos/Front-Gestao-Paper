// ServCriacaoDeLpi.jsx
import React, { useEffect, useState } from "react";

/**
 * Componente que mostra os inputs/selects específicos quando o serviço é "Criação de LP".
 *
 * Props:
 * - initialData: (opcional) objeto com valores iniciais (não obrigatório)
 * - onChange: função chamada sempre que os dados mudarem. Recebe o objeto de estado atual.
 *
 * Observações:
 * - Nenhum campo é obrigatório.
 * - Formatação automática para telefone e CPF/CNPJ é feita aqui (apenas UI/format).
 */

export default function ServCriacaoDeLpi({
  initialData = {},
  onChange = () => {},
}) {
  const [tipoCliente, setTipoCliente] = useState(initialData.tipoCliente || "");
  const [tipoPagina, setTipoPagina] = useState(initialData.tipoPagina || "");
  const [formato, setFormato] = useState(initialData.formato || "");
  const [diasPrazo, setDiasPrazo] = useState(initialData.diasPrazo || "");
  const [pagamento, setPagamento] = useState(initialData.pagamento || "");
  const [valor, setValor] = useState(initialData.valor || "");
  const [telefone, setTelefone] = useState(initialData.telefone || "");
  const [nome, setNome] = useState(initialData.nome || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [cpfCnpj, setCpfCnpj] = useState(initialData.cpfCnpj || "");
  const [criarContrato, setCriarContrato] = useState(
    initialData.criarContrato || "Não"
  );

  // Formatadores simples (aplicados ao texto exibido)
  const formatTelefone = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11); // até 11 dígitos (DD + 9)
    if (!digits) return "";
    const d1 = digits.slice(0, 2);
    const d2 = digits.slice(2, 7);
    const d3 = digits.slice(7, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `${d1} ${d2}`.trim();
    return `${d1} ${d2}-${d3}`;
  };

  const formatCpfCnpj = (v) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length <= 11) {
      // CPF: 000.000.000-00
      const d = digits;
      const p1 = d.slice(0, 3);
      const p2 = d.slice(3, 6);
      const p3 = d.slice(6, 9);
      const p4 = d.slice(9, 11);
      if (d.length <= 3) return p1;
      if (d.length <= 6) return `${p1}.${p2}`;
      if (d.length <= 9) return `${p1}.${p2}.${p3}`;
      return `${p1}.${p2}.${p3}-${p4}`;
    } else {
      // CNPJ: 00.000.000/0000-00
      const d = digits.slice(0, 14);
      const p1 = d.slice(0, 2);
      const p2 = d.slice(2, 5);
      const p3 = d.slice(5, 8);
      const p4 = d.slice(8, 12);
      const p5 = d.slice(12, 14);
      if (d.length <= 2) return p1;
      if (d.length <= 5) return `${p1}.${p2}`;
      if (d.length <= 8) return `${p1}.${p2}.${p3}`;
      if (d.length <= 12) return `${p1}.${p2}.${p3}/${p4}`;
      return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    }
  };

  // Chama onChange com o objeto atual sempre que algo muda
  useEffect(() => {
    onChange({
      tipoCliente,
      tipoPagina,
      formato,
      diasPrazo,
      pagamento,
      valor,
      telefone,
      nome,
      email,
      cpfCnpj,
      criarContrato,
    });
  }, [
    tipoCliente,
    tipoPagina,
    formato,
    diasPrazo,
    pagamento,
    valor,
    telefone,
    nome,
    email,
    cpfCnpj,
    criarContrato,
    onChange,
  ]);

  return (
    <div className="p-3 border rounded md:col-span-3 bg-background border-border">
      <h3 className="mb-2 text-sm font-medium">Dados — Criação de LP</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Tipo de Cliente</label>
          <select
            value={tipoCliente}
            onChange={(e) => setTipoCliente(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            <option value="Adv">Advogado</option>
            <option value="Cli">Cliente geral</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Tipo de Página</label>
          <select
            value={tipoPagina}
            onChange={(e) => setTipoPagina(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            <option value="LPi">LPi</option>
            <option value="LPv">LPv</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Formato</label>
          <select
            value={formato}
            onChange={(e) => setFormato(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            <option value="Ass">Assinatura</option>
            <option value="Aqu">Aquisição</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Dias de Prazo</label>
          <select
            value={diasPrazo}
            onChange={(e) => setDiasPrazo(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            {Array.from({ length: 30 }).map((_, idx) => {
              const val = idx + 1;
              return (
                <option key={val} value={String(val)}>
                  {val}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Pagamento</label>
          <select
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            <option value="Cc">Cartão de Crédito</option>
            <option value="Pix">Pix</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Valor</label>
          <select
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="">Selecione</option>
            <option value="69">69</option>
            <option value="89">89</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Telefone</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(formatTelefone(e.target.value))}
            placeholder="00 00000-0000"
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm">CPF/CNPJ</label>
          <input
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          />
        </div>

        {/* NOVO CAMPO para criar contrato */}
        {/* <div className="flex flex-col">
          <label className="mb-1 text-sm">
            Vai criar contrato e link de pagamento?
          </label>
          <select
            value={criarContrato}
            onChange={(e) => setCriarContrato(e.target.value)}
            className="p-2 border rounded bg-inputBg text-placeholder border-border"
          >
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div> */}
      </div>
    </div>
  );
}
