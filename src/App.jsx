import Clientes from "./modulos/clientes/Clientes";
import Feedbacks from "./modulos/feedbacks/Feedbacks";
import QuadroDev from "./modulos/quadros/QuadroDev";
import QuadroSuporte from "./modulos/quadros/QuadroSuporte";
import Servicos from "./modulos/servicos/Servicos";

function App() {
  return (
    <div className="flex flex-col">
      <Clientes />
      <Feedbacks />
      <Servicos />
      <QuadroDev />
      <QuadroSuporte />
    </div>
  );
}

export default App;
