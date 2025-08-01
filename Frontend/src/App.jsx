import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/HomePage.jsx";
import Fusion from "./pages/Fusion.jsx";
import LimitOrders from "./pages/LimitOrder.jsx";
import HelpOverlay from "./components/Help.jsx";
import FusionMaker from "./pages/FusionMaker.jsx";
import FusionResolver from "./pages/FusionResolver.jsx";

function App() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fusion" element={<Fusion />} />
          <Route path="/fusion/maker" element={<FusionMaker />} />
          <Route path="/fusion/resolver" element={<FusionResolver />} />
          <Route path="/limit-orders" element={<LimitOrders />} />
        </Routes>
        {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
        
      </div>
    </Router>
  );
}

export default App;
