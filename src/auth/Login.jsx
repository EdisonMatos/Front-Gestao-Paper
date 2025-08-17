import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import loginImg from "../assets/imgs/loginImg.jpg";
import logoPaperClub from "../assets/imgs/logoPaperClub.png";

const API_URL = "https://backend-gestao-paper.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Verifica se já existe login antes de renderizar
  const token = localStorage.getItem("token");
  const tipo = localStorage.getItem("tipo");
  if (token && tipo) {
    // Se já está logado, redireciona para "/"
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro no login");

      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.usuario.id);
      localStorage.setItem("nome", data.usuario.nome);
      localStorage.setItem("email", data.usuario.email);
      localStorage.setItem("cargo", data.usuario.cargo || "");
      localStorage.setItem("setor", data.usuario.setor || "");
      localStorage.setItem("tipo", data.usuario.tipo ?? "comum");
      localStorage.setItem("avatar", data.usuario.avatar || "");

      navigate("/"); // Redireciona para o dashboard
      console.log("Enviando login com:", { email, senha });
      console.log("Resposta da API:", data);
      console.log("Token salvo?", localStorage.getItem("token"));
      console.log("Tipo salvo?", localStorage.getItem("tipo"));
      console.log("Chamando navigate para '/'");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen p-4 text-white bg-background font-mainFont">
      <div className="bg-background w-full md:w-[50%] flex justify-center items-center">
        <div className="w-full">
          <div className="w-full max-w-[400px] mx-auto flex flex-col justify-center items-center">
            <img src={logoPaperClub} alt="Logo" className="w-[50%]" />
            <h2 className="mb-5 text-2xl font-medium text-left">
              Faça login no Paper Club
            </h2>
            <p className="text-[14px] mb-8 opacity-50">
              Entre com seu e-mail e senha.
            </p>
            <form
              onSubmit={handleLogin}
              className="flex w-[80%] flex-col gap-2.5"
            >
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2.5 text-base bg-neutral-900 border border-neutral-800 rounded"
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="p-2.5 text-base bg-neutral-900 border border-neutral-800 rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2.5 text-base text-black rounded cursor-pointer bg-buttonsHover hover:bg-buttons disabled:opacity-70"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </div>
      <div
        className="w-[50%] bg-background bg-right rounded-xl bg-cover hidden md:block"
        style={{ backgroundImage: `url(${loginImg})` }}
      ></div>
    </div>
  );
}
