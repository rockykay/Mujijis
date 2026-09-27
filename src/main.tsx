import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { WeddingDataProvider } from './hooks/useWeddingData';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeddingDataProvider>
      <App />
    </WeddingDataProvider>
  </StrictMode>
);
