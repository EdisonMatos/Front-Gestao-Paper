import Clientes from "./modulos/clientes/Clientes";
import Feedbacks from "./modulos/feedbacks/Feedbacks";
import QuadroDev from "./modulos/quadros/QuadroDev";
import QuadroFeedbacks from "./modulos/quadros/QuadroFeedbacks";
import QuadroSuporte from "./modulos/quadros/QuadroSuporte";
import QuadroWebmaster from "./modulos/quadros/QuadroWebmaster";
import Servicos from "./modulos/servicos/Servicos";

function App() {
  return (
    <div className="flex flex-col max-w-[1400px] ">
      <Clientes />
      <Servicos />
      {/* <Feedbacks /> */}
      <QuadroSuporte />
      <QuadroDev />
      <QuadroWebmaster />
      <QuadroFeedbacks />
    </div>
  );
}

export default App;
