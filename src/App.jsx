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
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <RotinaSuporte />
          <QuadroSuporte />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit ">
          <QuadroDev />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <QuadroComercial />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <RotinaFinanceiro />
          <QuadroFinanceiro />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <RotinaWebmaster />
          <QuadroWebmaster />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <RotinaTrafego />
          <QuadroTrafego />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          {/* <RotinaFeedbacks /> */}
          <QuadroFeedbacks />
        </div>
        <div className="m-6 overflow-x-auto border border-border rounded-xl w-fit">
          <RotinaDiretoria />
          <QuadroDiretoria />
        </div>
      </div>
    </div>
  );
}

export default App;
