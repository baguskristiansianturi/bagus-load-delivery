const K={cart:'bld_cart_v2',wish:'bld_wishlist_v1',orders:'bld_orders_v2',recent:'bld_recent_v1'};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>(localStorage.setItem(k,JSON.stringify(v)),v);
export const money=v=>new Intl.NumberFormat('id-ID').format(Number(v)||0);
const keyFor=item=>item.cartKey||`${item.id}::${item.supplierId||item.supplier||item.provider||'default'}`;
const normalize=item=>({...item,cartKey:keyFor(item)});
export const store={
 getCart:()=>read(K.cart,[]).map(normalize),
 setCart:v=>save(K.cart,v.map(normalize)),
 addToCart:(item,q=1)=>{const a=read(K.cart,[]).map(normalize),key=keyFor(item),x=a.find(i=>i.cartKey===key);x?x.quantity+=q:a.push({...normalize(item),quantity:q});return save(K.cart,a)},
 updateCart:(key,q)=>save(K.cart,read(K.cart,[]).map(x=>normalize(x).cartKey===key?{...normalize(x),quantity:Math.max(1,q)}:normalize(x))),
 removeFromCart:key=>save(K.cart,read(K.cart,[]).filter(x=>normalize(x).cartKey!==key)),
 clearCart:()=>save(K.cart,[]),cartCount:()=>read(K.cart,[]).reduce((n,x)=>n+(Number(x.quantity)||0),0),cartTotal:()=>read(K.cart,[]).reduce((n,x)=>n+(Number(x.price)||0)*(Number(x.quantity)||0),0),
 getWishlist:()=>read(K.wish,[]),isWishlisted:id=>read(K.wish,[]).some(x=>x.id===id),toggleWishlist:item=>{const a=read(K.wish,[]),i=a.findIndex(x=>x.id===item.id);i>=0?a.splice(i,1):a.push(item);return save(K.wish,a)},
 addRecent:item=>{const a=read(K.recent,[]).filter(x=>x.id!==item.id);a.unshift(item);return save(K.recent,a.slice(0,12))},getRecent:()=>read(K.recent,[]),
 getOrders:()=>read(K.orders,[]),getOrder:id=>read(K.orders,[]).find(x=>x.id===id),
 createOrder:p=>{const a=read(K.orders,[]),o={id:`BLD-${Date.now().toString().slice(-8)}`,createdAt:new Date().toISOString(),status:'pending',...p};a.unshift(o);save(K.orders,a);return o}
};