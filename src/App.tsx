import React from "react";
import IntegratedFarmApp from "./components/IntegratedFarmApp";
import { FarmProvider } from "./contexts/FarmContext";

const App: React.FC = () => {
  return (
    <FarmProvider>
      <IntegratedFarmApp />
    </FarmProvider>
  );
};

export default App;
