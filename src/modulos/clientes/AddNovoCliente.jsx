// AddNovoCliente.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://backend-gestao-paper.onrender.com/clientes";

export default function AddNovoCliente({
  clienteParaEditar = null,
  onSalvo,
  onCancelar,
}) {
  const [form, setForm] = useState({
    id: null,
    empresa: "",
    representante: "",
    telefone: "",
    email: "",
    dominio: "",
  });

  useEffect(() => {
    if (clienteParaEditar) {
      setForm(clienteParaEditar);
    } else {
      setForm({
        id: null,
        empresa: "",
        representante: "",
        telefone: "",
        email: "",
        dominio: "",
      });
    }
  }, [clienteParaEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, form);
        toast.success("Cliente atualizado com sucesso!", { autoClose: 1000 });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        await axios.post(API_URL, form);
        toast.success("Cliente adicionado com sucesso!", { autoClose: 1000 });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      onSalvo();
    } catch (err) {
      toast.error("Erro ao salvar cliente.", { autoClose: 1000 });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 p-4 mb-6 border rounded md:grid-cols-3 bg-background border-border text-text"
    >
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Empresa / Site</label>
        <input
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Representante</label>
        <input
          name="representante"
          value={form.representante}
          onChange={handleChange}
          required
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Telefone</label>
        <input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Domínio</label>
        <input
          name="dominio"
          value={form.dominio}
          onChange={handleChange}
          className="p-2 border rounded bg-inputBg text-placeholder border-border"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full px-4 py-2 text-white transition rounded bg-buttons hover:bg-buttonsHover"
        >
          {form.id ? "Atualizar Cliente" : "Adicionar Cliente"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 ml-2 rounded bg-secondaryButtons hover:bg-secondaryButtonsHover"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
