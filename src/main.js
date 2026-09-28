import './style.css';
import {route} from './app/router.js';
import {getItem} from './data/catalog.js';
import {home,bindHome} from './pages/home/index.js';
window.__BLD_GET_ITEM=getItem;
function render(){route(home);if(!location.hash||location.hash==='#/'||location.hash==='#'){queueMicrotask(bindHome)}}
window.addEventListener('hashchange',render);
render();
