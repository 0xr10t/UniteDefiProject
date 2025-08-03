/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/App.jsx */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import Fusion from "./pages/Fusion";  
import FusionMaker from "./pages/FusionMaker";
import FusionResolver from "./pages/FusionResolver";
import LimitOrders from "./pages/LimitOrder";

// Components
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fusion" element={<Fusion />} />
            <Route path="/fusion/maker" element={<FusionMaker />} />
            <Route path="/fusion/resolver" element={<FusionResolver />} />
            <Route path="/limit-orders" element={<LimitOrders />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;