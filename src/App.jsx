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
  MessageCircle,
  Trophy,
  Wrench,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background font-mainFont">
      <ToastContainer />
      <div className="flex items-center">
        <img className="pl-2 w-[200px]" src={paperClubLogo}></img>
        <div>
          <h1 className="ml-6 text-3xl font-bold text-white">Paper Club</h1>
          <h1 className="ml-6 text-sm text-text">
            Sistema de Controle Interno
          </h1>
          <p className="ml-6 text-xs text-text/50">Paper Street Softwares ®</p>
          <p className="ml-6 text-xs text-text/50">
            2025 - Versão 0.9 (Em desenvolvimento)
          </p>
        </div>
      </div>
      <div className=" flex flex-col max-w-[1700px] overflow-x-auto">
        <Agrupamento>
          <Titulos>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="text-links" /> Clientes e Serviços
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
              <MessageCircle className="text-links" /> Atendimento ao cliente
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
    </div>
  );
}

export default App;
