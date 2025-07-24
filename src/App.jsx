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
import AcordionDepartamentos from "./AcordionDepartamentos";
import RotinaSocialMedia from "./modulos/quadrosRotinas/RotinaSocialMedia";
import QuadroSocialMedia from "./modulos/quadros/QuadroSocialMedia";

function App() {
  return (
    <div className="bg-background font-mainFont">
      <ToastContainer />
      <div className="flex flex-col max-w-[1400px] overflow-x-auto">
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <Clientes />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <Servicos />
        </div>

        <AcordionDepartamentos titulo="SUPORTE">
          <RotinaSuporte />
          <QuadroSuporte />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="DESENVOLVIMENTO">
          <QuadroDev />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="WEBMASTER">
          <RotinaWebmaster />
          <QuadroWebmaster />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="TRÁFEGO PAGO">
          <RotinaTrafego />
          <QuadroTrafego />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="SOCIAL MEDIA">
          <RotinaSocialMedia />
          <QuadroSocialMedia />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="FEEDBACKS">
          <RotinaFeedbacks />
          <QuadroFeedbacks />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="COMERCIAL">
          <QuadroComercial />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="FINANCEIRO">
          <RotinaFinanceiro />
          <QuadroFinanceiro />
        </AcordionDepartamentos>

        <AcordionDepartamentos titulo="DIRETORIA">
          <RotinaDiretoria />
          <QuadroDiretoria />
        </AcordionDepartamentos>
      </div>
    </div>
  );
}

export default App;
