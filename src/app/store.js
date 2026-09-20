const K={cart:'bld_cart_v1',wish:'bld_wishlist_v1',orders:'bld_orders_v1'};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>(localStorage.setItem(k,JSON.stringify(v)),v);
export const money=v=>new Intl.NumberFormat('id-ID').format(Number(v)||0);
export const store={
 getCart:()=>read(K.cart,[]), setCart:v=>save(K.cart,v),
 addToCart:(item,q=1)=>{const a=read(K.cart,[]),x=a.find(i=>i.id===item.id);x?x.quantity+=q:a.push({...item,quantity:q});return save(K.cart,a)},
 updateCart:(id,q)=>save(K.cart,read(K.cart,[]).map(x=>x.id===id?{...x,quantity:Math.max(1,q)}:x)),
 removeFromCart:id=>save(K.cart,read(K.cart,[]).filter(x=>x.id!==id)),
 clearCart:()=>save(K.cart,[]), cartCount:()=>read(K.cart,[]).reduce((n,x)=>n+x.quantity,0),
 cartTotal:()=>read(K.cart,[]).reduce((n,x)=>n+(x.price||0)*x.quantity,0),
 getWishlist:()=>read(K.wish,[]), isWishlisted:id=>read(K.wish,[]).some(x=>x.id===id),
 toggleWishlist:item=>{const a=read(K.wish,[]),i=a.findIndex(x=>x.id===item.id);i>=0?a.splice(i,1):a.push(item);return save(K.wish,a)},
 getOrders:()=>read(K.orders,[]), getOrder:id=>read(K.orders,[]).find(x=>x.id===id),
 createOrder:p=>{const a=read(K.orders,[]),o={id:`BLD-${Date.now().toString().slice(-8)}`,createdAt:new Date().toISOString(),status:'pending',...p};a.unshift(o);save(K.orders,a);return o}
};
