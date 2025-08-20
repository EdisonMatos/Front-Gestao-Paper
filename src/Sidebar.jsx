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
  AlarmClockCheck,
  Award,
  BriefcaseBusiness,
  Calendar,
  ChartColumnIncreasing,
  ChartSpline,
  Code,
  Globe,
  Headset,
  Hourglass,
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
import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./componentes/MenuItem";
import MenuItemRotinas from "./componentes/MenuItemRotinas";
import MenuItemMeta from "./componentes/ManuItemMeta";
import MenuItemPrazos from "./componentes/MenuItemPrazos";

export default function Sidebar() {
  const [servicosCounts, setServicosCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    async function carregarServicosCounts() {
      setLoadingCounts(true);
      try {
        const { data } = await axios.get(
          "https://backend-gestao-paper.onrender.com/servicos/counts"
        );
        setServicosCounts(data);
      } catch (error) {
        console.error("Erro ao buscar counts dos serviços:", error);
      } finally {
        // garante que o loading não fica preso
        setTimeout(() => setLoadingCounts(false), 300);
      }
    }

    carregarServicosCounts();
    const interval = setInterval(carregarServicosCounts, 300000); //  1s = 1.000, 10s = 10.000, 1m = 60.000, 5m = 300.000

    return () => clearInterval(interval);
  }, []);

  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const { data } = await axios.get(
          "https://backend-gestao-paper.onrender.com/servicos"
        );
        setServicos(data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    }
    carregarServicos();
  }, []);

  const suporteCount = contarServicos("suporte");

  function contarServicos(turno) {
    return servicos.filter(
      (s) =>
        s.turnoDaVez === turno &&
        (s.posicaoNoQuadro === null || s.posicaoNoQuadro === "backlog")
    ).length;
  }

  const [abaAtiva, setAbaAtiva] = useState("prazos");
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
                  <a href="#" class="flex ms-2 md:me-24">
                    <img
                      src={paperClubLogo}
                      class="h-16 me-3"
                      alt="Paper Club Logo"
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
              <ul>
                {" "}
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
                      {/* <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-inputBg dark:text-white">
                        0
                      </span> */}
                    </div>
                  </button>
                </li>
              </ul>
              <ul className="pt-3 mt-3 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <ul>
                    <MenuItemPrazos
                      label="Prazos"
                      Icon={Calendar}
                      abaAtiva={abaAtiva}
                      setAbaAtiva={setAbaAtiva}
                      servicos={servicos}
                    />
                  </ul>
                </li>

                <li>
                  <MenuItemRotinas
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                  />
                </li>
                <li>
                  <MenuItemMeta
                    meta={2}
                    turno="progresso"
                    label="Em Progresso"
                    Icon={Hourglass}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                  />
                </li>
              </ul>
              <ul className="pt-3 mt-3 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <MenuItem
                    turno="suporte"
                    label="Suporte"
                    Icon={MessageCircle}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["suporte"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="comercial"
                    label="Comercial"
                    Icon={Headset}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["comercial"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="dev"
                    label="Desenvolvimento"
                    Icon={Code}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["dev"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="webmaster"
                    label="Webmaster"
                    Icon={Globe}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["webmaster"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="trafego"
                    label="Tráfego Pago"
                    Icon={ScanSearch}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["trafego"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="socialmedia"
                    label="Social Media"
                    Icon={Instagram}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["socialmedia"] || 0}
                    loading={loadingCounts}
                  />
                </li>
              </ul>

              <ul class="pt-3 mt-3 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                  <MenuItem
                    turno="feedbacks"
                    label="Feedbacks"
                    Icon={Award}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["feedbacks"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="financeiro"
                    label="Financeiro"
                    Icon={Landmark}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["financeiro"] || 0}
                    loading={loadingCounts}
                  />
                </li>
                <li>
                  <MenuItem
                    turno="diretoria"
                    label="Diretoria"
                    Icon={ChartSpline}
                    abaAtiva={abaAtiva}
                    setAbaAtiva={setAbaAtiva}
                    count={servicosCounts["diretoria"] || 0}
                    loading={loadingCounts}
                  />
                </li>
              </ul>
            </div>
          </aside>

          <div class="sm:ml-64">
            <div class="rounded-lg  mt-14 text-white">
              <ToastContainer />
              {/* Versão PC */}
              <div className="hidden desktop1:flex flex-col max-w-[1700px] overflow-x-auto pt-12 pl-4">
                {abaAtiva === "prazos" && (
                  <>
                    {/* --- prazos PRINCIPAL --- */}
                    <div className="">
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

                {abaAtiva === "dev" && (
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

                {abaAtiva === "rotinas" && (
                  <>
                    {/* --- ABA ROTINAS --- */}

                    <QuadroResumoRotinas />
                  </>
                )}

                {abaAtiva === "progresso" && (
                  <>
                    {/* --- EM PROGRESSO --- */}

                    <DashboardTarefasEmProgresso />
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
