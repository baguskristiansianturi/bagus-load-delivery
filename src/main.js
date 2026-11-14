import { supabase as presenceDb } from './lib/supabase/client.js';
import { startGlobalPresence } from './services/realtime/presence/index.js';

void startGlobalPresence(presenceDb);


import './design-system/tokens/foundation.css';
import './design-system/layouts/foundation.css';
import './style.css';
import './styles/brand.css';
import './styles/page-transitions.css';
import './styles/social-navigation.css';
import './pages/account/circle-story-layout.css';
import { route } from './app/router.js';

let renderSequence = 0;

async function render() {
  const sequence = ++renderSequence;
  const initialHash = location.hash || '#/';
  let path = initialHash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
  // Keep one canonical URL for the public home; older aliases resolve to #/.
  if (['home', 'feed', 'beranda'].includes(path)) {
    history.replaceState(null, '', location.pathname + location.search + '#/');
    path = '';
  }
  const expectedHash = location.hash || '#/';
  await route();
  // A delayed route or auth lookup must never paint the previous page over
  // the page the visitor has navigated to in the meantime.
  if (sequence !== renderSequence || (location.hash || '#/') !== expectedHash) return;
  if ((!path || path === 'guest') && document.querySelector('#pl-public-feed')) {
    const {bindHome}=await import('./pages/home/index.js');
    await bindHome();
  }
}

window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
        updateViaCache: 'none'
      });
      await registration.update();
    } catch (error) {
      console.error('Pluits service worker update failed:', error);
    }
  });
}
