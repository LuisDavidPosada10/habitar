import { Route, Routes } from "react-router"
import { MenuProvider } from "./kit/Shell"
import { JourneyTracker } from "./kit/journey"
import Inicio from "./pages/Inicio"
import Proyecto from "./pages/Proyecto"
import Universos from "./pages/Universos"
import HubMon from "./pages/HubMon"
import HubSilvana from "./pages/HubSilvana"
import HubJuliana from "./pages/HubJuliana"
import JulianaMedida from "./pages/JulianaMedida"
import JulianaCoseme from "./pages/JulianaCoseme"
import JulianaDosDosDos from "./pages/JulianaDosDosDos"
import JulianaMarAdentro from "./pages/JulianaMarAdentro"
import Experiencia from "./pages/Experiencia"
import SilvanaCasa from "./pages/SilvanaCasa"
import SilvanaTeGuardo from "./pages/SilvanaTeGuardo"
import SilvanaCorriente from "./pages/SilvanaCorriente"
import SilvanaLluvias from "./pages/SilvanaLluvias"
import MonTuFalta from "./pages/MonTuFalta"
import MonHacerseObra from "./pages/MonHacerseObra"
import MonTrenza from "./pages/MonTrenza"
import MonNoCaber from "./pages/MonNoCaber"

export default function App() {
  return (
    <MenuProvider>
      <JourneyTracker />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyecto" element={<Proyecto />} />
        <Route path="/universos" element={<Universos />} />
        <Route path="/mon" element={<HubMon />} />
        <Route path="/silvana" element={<HubSilvana />} />
        <Route path="/juliana" element={<HubJuliana />} />
        <Route path="/mon-1" element={<MonNoCaber />} />
        <Route path="/mon-2" element={<MonTuFalta />} />
        <Route path="/mon-3" element={<MonHacerseObra />} />
        <Route path="/mon-4" element={<MonTrenza />} />
        <Route path="/silvana-1" element={<SilvanaCasa />} />
        <Route path="/silvana-2" element={<SilvanaTeGuardo />} />
        <Route path="/silvana-3" element={<SilvanaCorriente />} />
        <Route path="/silvana-4" element={<SilvanaLluvias />} />
        <Route path="/juliana-1" element={<JulianaCoseme />} />
        <Route path="/juliana-2" element={<JulianaDosDosDos />} />
        <Route path="/juliana-3" element={<JulianaMarAdentro />} />
        <Route path="/juliana-4" element={<JulianaMedida />} />
        <Route path="/experiencia" element={<Experiencia />} />
        <Route path="*" element={<Inicio />} />
      </Routes>
    </MenuProvider>
  )
}
