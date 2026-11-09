import './style.css';
import './styles/page-transitions.css';
import '../styles/home-layout.css';
import { route } from './app/router.js';
import { home, bindHome } from './pages/home/index.js';

function render() {
  const hash = location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
  route(home);

  // Older shared links used /home, /feed and /beranda. Keep them on the
  // current social home instead of falling through to a legacy/unknown page.
  if (!path || ['home', 'feed', 'beranda'].includes(path)) {
    queueMicrotask(bindHome);
  }
}

window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch((error) => console.error('Pluits service worker registration failed:', error));
  });
}
