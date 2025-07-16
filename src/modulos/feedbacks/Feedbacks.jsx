import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://backend-gestao-paper.onrender.com/servicos";

export default function Feedbacks() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServicos = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API_URL);
      setServicos(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // Atualiza os checkboxes localmente
  const handleCheckboxChange = (id, field) => {
    setServicos((oldServicos) =>
      oldServicos.map((s) => (s.id === id ? { ...s, [field]: !s[field] } : s))
    );
  };

  // Salva as alterações de um serviço específico
  const handleSave = async (servico) => {
    const loadingToast = toast.loading(
      `Salvando feedbacks de ${servico.nome}...`
    );
    try {
      await axios.put(`${API_URL}/${servico.id}`, servico);
      toast.update(loadingToast, {
        render: "Feedback salvo com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      fetchServicos();
    } catch (error) {
      toast.update(loadingToast, {
        render: "Erro ao salvar feedback.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-bold">Feedbacks dos Serviços</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Empresa</th>
              <th className="p-2 border">Representante</th>
              <th className="p-2 text-center border">Deu Feedback Site</th>
              <th className="p-2 text-center border">Feedback Site Postado</th>
              <th className="p-2 text-center border">Deu Feedback Google</th>
              <th className="p-2 text-center border">
                Feedback Google Postado
              </th>
              <th className="p-2 text-center border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {s.cliente?.empresa || "Sem empresa"}
                </td>
                <td className="p-2 border">
                  {s.cliente?.representante || "-"}
                </td>

                <td className="p-2 text-center border">
                  <input
                    type="checkbox"
                    checked={!!s.deuFeedbackSite}
                    onChange={() =>
                      handleCheckboxChange(s.id, "deuFeedbackSite")
                    }
                  />
                </td>

                <td className="p-2 text-center border">
                  <input
                    type="checkbox"
                    checked={!!s.feedbackSitePostado}
                    onChange={() =>
                      handleCheckboxChange(s.id, "feedbackSitePostado")
                    }
                  />
                </td>

                <td className="p-2 text-center border">
                  <input
                    type="checkbox"
                    checked={!!s.deuFeedbackGoogle}
                    onChange={() =>
                      handleCheckboxChange(s.id, "deuFeedbackGoogle")
                    }
                  />
                </td>

                <td className="p-2 text-center border">
                  <input
                    type="checkbox"
                    checked={!!s.feedbackGooglePostado}
                    onChange={() =>
                      handleCheckboxChange(s.id, "feedbackGooglePostado")
                    }
                  />
                </td>

                <td className="p-2 text-center border">
                  <button
                    onClick={() => handleSave(s)}
                    className="px-2 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-600"
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            ))}
            {servicos.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
