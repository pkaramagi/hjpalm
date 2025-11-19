import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "tabler-react-ui/dist/style.css";

import { App } from '@/app';
import '@/services/apiClient';
import '@/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
