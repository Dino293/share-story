import '../styles/styles.css';

import App from './pages/app';
import routes from './routes/routes';

import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    navigationDrawer: document.querySelector('#navigation-drawer'),
    drawerButton: document.querySelector('#drawer-button'),
    content: document.querySelector('#main-content'),
  });

  app.init(); 
});
