import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import AuthModel from '../models/auth-model.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #protectedRoutes = ['/', '/add-story', '/about'];

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupAuthHandler();
    this._checkInitialAuth();
  }

  init() {
    window.addEventListener('hashchange', () => {
      this.renderPage();
      this._handleRouteProtection();
    });

    this.renderPage(); 
  }

  _setupAuthHandler() {
    window.addEventListener('auth-change', () => {
      this._updateAuthUI();
      this._handleRouteProtection();
    });

    document.getElementById('logout-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this._handleLogout();
    });
  }

  _checkInitialAuth() {
    this._updateAuthUI();
    this._handleRouteProtection();
  }

  _handleLogout() {
    AuthModel.removeToken();
    AuthModel.removeUser();
    window.dispatchEvent(new CustomEvent('auth-change'));
    window.location.hash = '#/login';
  }

  _updateAuthUI() {
    const isLoggedIn = !!AuthModel.getToken();
    const authElements = this.#navigationDrawer.querySelectorAll('[data-auth]');

    authElements.forEach(el => {
      el.style.display = el.dataset.auth === (isLoggedIn ? 'logged-in' : 'logged-out')
        ? 'block'
        : 'none';
    });
  }

  _handleRouteProtection() {
    const currentRoute = getActiveRoute();
    const isProtected = this.#protectedRoutes.includes(currentRoute);
    const isLoggedIn = !!AuthModel.getToken();

    if (!['/login', '/register'].includes(currentRoute) && !isLoggedIn) {
      window.location.hash = '#/login';
      return;
    }

    if (['/login', '/register'].includes(currentRoute) && isLoggedIn) {
      window.location.hash = '/';
      return;
    }

    if (isProtected && !isLoggedIn) {
      window.location.hash = '#/login';
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', isOpen);
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }
    });
  }

  async renderPage() {
    this.#content.innerHTML = '<p class="loading">Loading...</p>'; 
    
    const url = getActiveRoute();
    const page = routes[url] || routes['/404']; 
  
    this.#content.innerHTML = await page.render();
    if (typeof page.afterRender === 'function') {
      await page.afterRender();
    }

    if (!document.startViewTransition) {
      await this._renderPageContent(page);
      return;
    }

    const transition = document.startViewTransition(() => {
      this._renderPageContent(page);
    });

    try {
      await transition.finished;
    } catch (error) {
      console.error('View transition failed:', error);
    }
  }

  async _renderPageContent(page) {
    try {
      this.#content.innerHTML = '';
      const newContent = await page.render();
      this.#content.innerHTML = newContent;
      await page.afterRender();
    } catch (error) {
      console.error('Error rendering page:', error);
      window.location.hash = '#/';
    }
  }
}

export default App;
