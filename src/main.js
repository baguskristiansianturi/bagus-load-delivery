import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const presenceDb = createClient('https://ytndswhqxayqpftszwfh.supabase.co', 'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65');
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

function render() {
  const hash = location.hash || '#/';
  let path = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/$/, '');
  // Keep one canonical URL for the public home; older aliases resolve to #/.
  if (['home', 'feed', 'beranda'].includes(path)) {
    history.replaceState(null, '', location.pathname + location.search + '#/');
    path = '';
  }
  route(home);
  if (!path || path === 'guest') queueMicrotask(bindHome);
}

window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch((error) => console.error('Pluits service worker registration failed:', error));
  });
}
