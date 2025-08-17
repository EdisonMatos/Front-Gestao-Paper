import { ToastContainer } from "react-toastify";
import Clientes from "./modulos/clientes/Clientes";
import QuadroDev from "./modulos/quadros/QuadroDev";
import QuadroFeedbacks from "./modulos/quadros/QuadroFeedbacks";
import QuadroSuporte from "./modulos/quadros/QuadroSuporte";
import QuadroWebmaster from "./modulos/quadros/QuadroWebmaster";
import Servicos from "./modulos/servicos/Servicos";
import RotinaSuporte from "./modulos/quadrosRotinas/RotinaSuporte";
import QuadroComercial from "./modulos/quadros/QuadroComercial";
import QuadroFinanceiro from "./modulos/quadros/QuadroFinanceiro";
import RotinaWebmaster from "./modulos/quadrosRotinas/RotinaWebmaster";
import RotinaFeedbacks from "./modulos/quadrosRotinas/RotinaFeedbacks";
import RotinaTrafego from "./modulos/quadrosRotinas/RotinaTrafego";
import QuadroTrafego from "./modulos/quadros/QuadroTrafego";
import RotinaDiretoria from "./modulos/quadrosRotinas/RotinaDiretoria";
import QuadroDiretoria from "./modulos/quadros/QuadroDiretoria";
import RotinaFinanceiro from "./modulos/quadrosRotinas/RotinaFinanceiro";
import AcordionDepartamentos from "./componentes/AcordionDepartamentos";
import RotinaSocialMedia from "./modulos/quadrosRotinas/RotinaSocialMedia";
import QuadroSocialMedia from "./modulos/quadros/QuadroSocialMedia";
import QuadroResumoRotinas from "./modulos/dashboards/DashboardResumoRotinas";
import DashboardTarefasEmProgresso from "./modulos/dashboards/DashboardTarefasEmProgresso";
import Agrupamento from "./componentes/Agrupamento";
import Titulos from "./componentes/Titulos";
import QuadroPrazos from "./modulos/dashboards/DashboardPrazos";
import RotinaComercial from "./modulos/quadrosRotinas/RotinaComercial";
import paperClubLogo from "./assets/imgs/logoPaperClub.png";
import {
  Award,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  ChartSpline,
  Code,
  Globe,
  Headset,
  Instagram,
  Landmark,
  LayoutPanelTop,
  List,
  MessageCircle,
  ScanSearch,
  Tag,
  Trophy,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";

export default function Sidebar() {
  console.log("Renderizando Sidebar");

  const [abaAtiva, setAbaAtiva] = useState("painel");
  const apelido = localStorage.getItem("nome") || "Usuário";
  const role = localStorage.getItem("setor");

  const temPermissao = ["veterano", "staff", "guildmaster"].includes(role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("guildId");
    window.location.reload();
  };

  const spriteUrl =
    localStorage.getItem("avatar") ||
    "https://www.paperstreet.com.br/assets/team1-tw21WVNj.webp";

  spriteUrl;

  // const spriteUrl = "https://www.paperstreet.com.br/assets/team1-tw21WVNj.webp";

  spriteUrl;

  return (
    <>
      <div>
        <div>
          <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-inputBg dark:border-border">
            <div class="px-3 py-3 lg:px-5 lg:pl-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                  <button
                    data-drawer-target="logo-sidebar"
                    data-drawer-toggle="logo-sidebar"
                    aria-controls="logo-sidebar"
                    type="button"
                    class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  >
                    <span class="sr-only">Open sidebar</span>
                    <svg
                      class="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                      ></path>
                    </svg>
                  </button>
                  <a href="https://flowbite.com" class="flex ms-2 md:me-24">
                    <img
                      src={paperClubLogo}
                      class="h-16 me-3"
                      alt="FlowBite Logo"
                    />
                    <span class="self-center text-[12px] min-[375px]:text-[16px] font-semibold sm:text-2xl whitespace-nowrap dark:text-white hidden desktop1:flex">
                      Paper Club
                    </span>
                  </a>
                </div>
                <div class="flex items-center justify-center">
                  <div class="flex items-center">
                    <div className="flex items-center">
                      <div className="flex flex-col items-end justify-end mr-4 ">
                        <p
                          class="text-[14px] text-gray-900 dark:text-white capitalize"
                          role="none"
                        >
                          {apelido} <span className="opacity-50">({role})</span>
                        </p>
                        <p>
                          <a
                            href="#"
                            class="blocktext-sm text-[10px] desktop1:text-[14px] text-gray-900 dark:text-links hover:opacity-100 w-fit"
                            role="none"
                            onClick={handleLogout}
                          >
                            Sair
                          </a>
                        </p>
                      </div>
                      <button
                        type="button"
                        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        aria-expanded="false"
                        data-dropdown-toggle="dropdown-user"
                      >
                        <span class="sr-only">Open user menu</span>
                        <img
                          class="max-w-6 max-h-6 min-[375px]:max-w-12 min-[375px]:max-h-12 rounded-full"
                          src={spriteUrl}
                          alt="user photo"
                        />
                      </button>
                    </div>
                    <div
                      class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                      id="dropdown-user"
                    >
                      <div class="px-4 py-3" role="none">
                        <p
                          class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                          role="none"
                        >
                          Time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <aside
            id="logo-sidebar"
            class="fixed top-0 left-0 z-40 w-64 h-screen pt-28 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-inputBg dark:border-border"
            aria-label="Sidebar"
          >
            <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-inputBg">
              <ul class="space-y-2 font-medium">
                <li>
                  <button
                    onClick={() => setAbaAtiva("painel")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "painel"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <LayoutPanelTop
                        className={`${
                          abaAtiva === "painel" ? "text-links" : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">Painel</span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("cadastros")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "cadastros"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <List
                        className={`${
                          abaAtiva === "cadastros"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Cadastros
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
              <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <button
                    onClick={() => setAbaAtiva("suporte")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "suporte"
                        ? "text-white bg-background "
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <MessageCircle
                        className={`${
                          abaAtiva === "suporte"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">Suporte</span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("comercial")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "comercial"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Headset
                        className={`${
                          abaAtiva === "comercial"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Comercial
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("desenvolvimento")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "desenvolvimento"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Code
                        className={`${
                          abaAtiva === "desenvolvimento"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">Dev</span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("webmaster")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "webmaster"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Globe
                        className={`${
                          abaAtiva === "webmaster"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Webmaster
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("trafego")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "trafego"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <ScanSearch
                        className={`${
                          abaAtiva === "trafego"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Tráfego Pago
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("socialmedia")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "socialmedia"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Instagram
                        className={`${
                          abaAtiva === "socialmedia"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Social Media
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
              <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <button
                    onClick={() => setAbaAtiva("feedbacks")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "feedbacks"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Award
                        className={`${
                          abaAtiva === "feedbacks"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Feedbacks
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("financeiro")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "financeiro"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <Landmark
                        className={`${
                          abaAtiva === "financeiro"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Financeiro
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setAbaAtiva("diretoria")}
                    className={`flex justify-between items-center p-2 w-full rounded-lg group ${
                      abaAtiva === "diretoria"
                        ? "text-white bg-background"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-background"
                    }`}
                  >
                    <div className="flex">
                      <ChartSpline
                        className={`${
                          abaAtiva === "diretoria"
                            ? "text-links"
                            : "text-white/50"
                        }`}
                      />
                      <span class="flex-1 ms-3 whitespace-nowrap">
                        Diretoria
                      </span>
                    </div>
                    <div>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                      <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          <div class="sm:ml-64">
            <div class="rounded-lg  mt-14 text-white">
              <ToastContainer />
              {/* Versão PC */}
              <div className="hidden desktop1:flex flex-col max-w-[1700px] overflow-x-auto pt-12 pl-4">
                {abaAtiva === "painel" && (
                  <>
                    {/* --- PAINEL PRINCIPAL --- */}
                    <div className="flex items-center">
                      <img className="pl-2 w-[200px]" src={paperClubLogo}></img>
                      <div>
                        <h1 className="ml-6 text-3xl font-bold text-white">
                          Paper Club
                        </h1>
                        <h1 className="ml-6 text-sm text-text">
                          Sistema de Controle Interno
                        </h1>
                        <p className="ml-6 text-xs text-text/50">
                          Paper Street Softwares ®
                        </p>
                        <p className="ml-6 text-xs text-text/50">
                          2025 - Versão 0.9 (Em desenvolvimento)
                        </p>
                      </div>
                    </div>

                    <div className="">
                      <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <QuadroResumoRotinas />
                      </div>
                      <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <DashboardTarefasEmProgresso />
                      </div>
                      <div className="p-6 m-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <QuadroPrazos />
                      </div>
                    </div>
                  </>
                )}

                {abaAtiva === "cadastros" && (
                  <>
                    {/* --- ABA CADASTROS --- */}
                    <Agrupamento>
                      <Titulos>
                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness className="text-links" /> Clientes
                          e Serviços
                        </div>
                      </Titulos>
                      <div className="mb-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <Clientes />
                      </div>
                      <div className="overflow-x-auto border border-border rounded-xl w-fit">
                        <Servicos />
                      </div>
                    </Agrupamento>
                  </>
                )}

                {abaAtiva === "suporte" && (
                  <>
                    {/* --- ABA SUPORTE --- */}
                    <RotinaSuporte />
                    <QuadroSuporte />
                  </>
                )}

                {abaAtiva === "comercial" && (
                  <>
                    {/* --- ABA COMERCIAL --- */}
                    <RotinaComercial />
                    <QuadroComercial />
                  </>
                )}

                {abaAtiva === "desenvolvimento" && (
                  <>
                    {/* --- ABA DESENVOLVIMENTO --- */}
                    <QuadroDev />
                  </>
                )}

                {abaAtiva === "webmaster" && (
                  <>
                    {/* --- ABA WEBMASTER --- */}
                    <RotinaWebmaster />
                    <QuadroWebmaster />
                  </>
                )}

                {abaAtiva === "trafego" && (
                  <>
                    {/* --- ABA TRÁFEGO PAGO --- */}
                    <RotinaTrafego />
                    <QuadroTrafego />
                  </>
                )}

                {abaAtiva === "socialmedia" && (
                  <>
                    {/* --- ABA SOCIAL MEDIA --- */}
                    <RotinaSocialMedia />
                    <QuadroSocialMedia />
                  </>
                )}

                {abaAtiva === "feedbacks" && (
                  <>
                    {/* --- ABA FEEDBACKS --- */}
                    <RotinaFeedbacks />
                    <QuadroFeedbacks />
                  </>
                )}

                {abaAtiva === "financeiro" && (
                  <>
                    {/* --- ABA FINANCEIRO --- */}
                    <RotinaFinanceiro />
                    <QuadroFinanceiro />
                  </>
                )}

                {abaAtiva === "diretoria" && (
                  <>
                    {/* --- ABA DIRETORIA --- */}
                    <RotinaDiretoria />
                    <QuadroDiretoria />
                  </>
                )}
              </div>
              {/* Versão PC */}

              {/* Versão Mobile */}
              <div className=" flex flex-col max-w-[1700px] overflow-x-auto desktop1:hidden pt-10">
                <Agrupamento>
                  <Titulos>
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="text-links" /> Clientes e
                      Serviços
                    </div>
                  </Titulos>
                  <div className="mb-6 overflow-x-auto border border-border rounded-xl w-fit">
                    <Clientes />
                  </div>
                  <div className="overflow-x-auto border border-border rounded-xl w-fit">
                    <Servicos />
                  </div>
                </Agrupamento>
                <Agrupamento>
                  <Titulos>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="text-links" /> Atendimento ao
                      cliente
                    </div>
                  </Titulos>
                  <AcordionDepartamentos titulo="Suporte">
                    <RotinaSuporte />
                    <QuadroSuporte />
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Comercial">
                    <RotinaComercial />
                    <QuadroComercial />
                  </AcordionDepartamentos>
                </Agrupamento>
                <Agrupamento>
                  <Titulos>
                    <div className="flex items-center gap-2">
                      <Wrench className="text-links" /> Operacional
                    </div>
                  </Titulos>
                  <AcordionDepartamentos titulo="Desenvolvimento">
                    <QuadroDev />
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Webmaster">
                    <RotinaWebmaster />
                    <QuadroWebmaster />
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Tráfego Pago">
                    <RotinaTrafego />
                    <QuadroTrafego />
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Social Media">
                    <RotinaSocialMedia />
                    <QuadroSocialMedia />
                  </AcordionDepartamentos>
                </Agrupamento>
                <Agrupamento>
                  <Titulos>
                    <div className="flex items-center gap-2">
                      <Award className="text-links" /> Controle de Qualidade
                    </div>
                  </Titulos>
                  <AcordionDepartamentos titulo="Feedbacks">
                    <RotinaFeedbacks />
                    <QuadroFeedbacks />
                  </AcordionDepartamentos>
                </Agrupamento>
                <Agrupamento>
                  <Titulos>
                    {" "}
                    <div className="flex items-center gap-2">
                      <ChartColumnIncreasing className="text-links" /> Gestão
                    </div>
                  </Titulos>
                  <AcordionDepartamentos titulo="Dashboards">
                    <Agrupamento>
                      <QuadroPrazos />
                    </Agrupamento>

                    <div className="">
                      <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <QuadroResumoRotinas />
                      </div>
                      <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
                        <DashboardTarefasEmProgresso />
                      </div>
                    </div>
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Financeiro">
                    <RotinaFinanceiro />
                    <QuadroFinanceiro />
                  </AcordionDepartamentos>
                  <AcordionDepartamentos titulo="Diretoria">
                    <RotinaDiretoria />
                    <QuadroDiretoria />
                  </AcordionDepartamentos>
                </Agrupamento>
              </div>
              {/* Versão Mobile */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
