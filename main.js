import './style.css';
import './styles/home-layout.css';
import {route} from './app/router.js';
import {getItem} from './data/catalog.js';
import {home,bindHome} from './pages/home/index.js';
window.__PLUITS_GET_ITEM=getItem;
function render(){route(home);if(!location.hash||location.hash==='#/'||location.hash==='#'){queueMicrotask(bindHome)}}
window.addEventListener('hashchange',render);
window.addEventListener('load',render);
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch((error) => console.error('Pluits service worker registration failed:', error));
  });
}
