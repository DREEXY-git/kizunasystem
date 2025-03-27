import React from 'react';
import { FarmProvider } from './contexts/FarmContext';
import IntegratedFarmApp from './components/IntegratedFarmApp';

function App() {
  return (
    <FarmProvider>
      <IntegratedFarmApp />
    </FarmProvider>
  );
}

export default App; 