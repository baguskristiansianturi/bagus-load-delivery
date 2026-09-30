import {store} from '../../app/store.js';
import {shell,card,bind,pageHeading,icon} from '../../app/ui.js';

export function wishlist(){
  const a=store.getWishlist();
  const h=shell(
    '<div class="wishlist-page">'+
    pageHeading('SAVED','Your wishlist','Save materials you are comparing now and return when you are ready to order.','<a class="primary-button" href="#/material">'+icon.arrow+' Continue shopping</a>')+
    (a.length
      ? '<div class="wishlist-toolbar"><b>'+a.length+' saved item'+(a.length>1?'s':'')+'</b><span>Compare price, supplier and availability on each product page.</span></div><div class="catalog-grid wishlist-grid">'+a.map(card).join('')+'</div>'
      : '<div class="empty-state large"><h2>Your wishlist is empty</h2><p>Tap the heart on any material to save it here.</p><a class="primary-button" href="#/material">Explore materials</a></div>')+
    '</div>',
    'Wishlist'
  );
  queueMicrotask(bind);
  return h;
}