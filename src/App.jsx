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

function App() {
  return (
    <div className="bg-background font-mainFont">
      <ToastContainer />
      <div className="flex flex-col max-w-[1400px] ">
        <Clientes />
        <Servicos />
        <RotinaSuporte />
        <QuadroSuporte />
        <QuadroDev />
        <QuadroComercial />
        <QuadroFinanceiro />
        <QuadroWebmaster />
        <QuadroFeedbacks />
      </div>
    </div>
  );
}

export default App;
