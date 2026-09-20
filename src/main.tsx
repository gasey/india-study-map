import React from 'react';
import ReactDOM from 'react-dom/client';
import { Root } from './Root';
import 'leaflet/dist/leaflet.css';
import './styles/tokens.css';
import './styles/motion.css';
import './styles/globals.css';
/* After globals.css: the collectible skin overrides chrome that globals
   sets (.surface, .subject-chip, scrollbars), so it has to win on order. */
import './styles/collectible.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
