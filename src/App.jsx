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
import QuadroResumoRotinas from "./modulos/quadros/QuadroResumoRotinas";
import DashboardTarefasEmProgresso from "./modulos/quadros/DashboardTarefasEmProgresso";
import Agrupamento from "./componentes/Agrupamento";
import Titulos from "./componentes/Titulos";
import DashboardServicos from "./modulos/quadros/DashboardServicos";

function App() {
  return (
    <div className="min-h-screen bg-background font-mainFont">
      <ToastContainer />
      <img
        className="py-10 pl-6 w-[350px]"
        src="https://www.paperstreet.com.br/assets/logo-CbJtwANr.webp"
      ></img>
      <h1 className="ml-6 text-3xl font-bold text-text/70">
        Sistema de Gerenciamento
      </h1>
      <p className="ml-6 text-text/50">Versão 0.8 (Em desenvolvimento)</p>
      <div className="mt-10 flex flex-col max-w-[1400px] overflow-x-auto">
        <Agrupamento>
          <Titulos>💼 Clientes e Serviços</Titulos>
          <div className="mb-6 overflow-x-auto border border-border rounded-xl w-fit">
            <Clientes />
          </div>
          <div className="overflow-x-auto border border-border rounded-xl w-fit">
            <Servicos />
          </div>
        </Agrupamento>
        <Agrupamento>
          <Titulos>💬 Atendimento ao cliente</Titulos>
          <AcordionDepartamentos titulo="Suporte">
            <RotinaSuporte />
            <QuadroSuporte />
          </AcordionDepartamentos>
          <AcordionDepartamentos titulo="Comercial">
            <QuadroComercial />
          </AcordionDepartamentos>
        </Agrupamento>
        <Agrupamento>
          <Titulos>🛠️ Operacional</Titulos>
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
          <Titulos>🏅 Controle de Qualidade</Titulos>
          <AcordionDepartamentos titulo="Feedbacks">
            <RotinaFeedbacks />
            <QuadroFeedbacks />
          </AcordionDepartamentos>
        </Agrupamento>
        <Agrupamento>
          <Titulos>📈 Gestão</Titulos>
          <AcordionDepartamentos titulo="Dashboards">
            <Agrupamento>
              <DashboardServicos />
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
