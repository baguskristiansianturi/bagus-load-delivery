import { supabase as presenceDb } from './lib/supabase/client.js';
let globalPresenceChannel = null;
let activePresenceUserId = null;

async function syncGlobalPresence(session) {
  const userId = session?.user?.id || null;
  if (userId === activePresenceUserId && globalPresenceChannel) return;
  if (globalPresenceChannel) {
    await presenceDb.removeChannel(globalPresenceChannel);
    globalPresenceChannel = null;
  }
  activePresenceUserId = userId;
  if (!userId) return;
  globalPresenceChannel = presenceDb.channel('pluits-online-v1', { config: { presence: { key: userId } } });
  globalPresenceChannel.subscribe(async status => {
    if (status === 'SUBSCRIBED') {
      await globalPresenceChannel.track({ user_id: userId, online_at: new Date().toISOString() });
    }
  });
}

presenceDb.auth.getSession().then(({ data }) => syncGlobalPresence(data.session));
presenceDb.auth.onAuthStateChange((_event, session) => {
  queueMicrotask(() => syncGlobalPresence(session));
});

import './style.css';
import './styles/brand.css';
import './styles/page-transitions.css';
import './styles/social-navigation.css';
import '../styles/home-layout.css';
import { route } from './app/router.js';
import { home, bindHome } from './pages/home/index.js';

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
  await route(home);
  // A delayed route or auth lookup must never paint the previous page over
  // the page the visitor has navigated to in the meantime.
  if (sequence !== renderSequence || (location.hash || '#/') !== expectedHash) return;
  if ((!path || path === 'guest') && document.querySelector('#pl-public-feed')) {
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
