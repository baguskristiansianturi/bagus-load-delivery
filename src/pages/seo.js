const BASE='https://baguskristiansianturi.github.io/pluits/';
export function updateSEO({title='Pluits — Komunitas Indonesia',description='Temukan komunitas, pengalaman, tempat, dan usaha lokal di Pluits.',path=''}={}){
 const suffix=String(path||'').replace(/^\//,'');
 const href=BASE+suffix;
 document.title=title;
 const set=(selector,attrs)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');document.head.appendChild(el)}Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v))};
 set('meta[name="description"]',{name:'description',content:description});
 set('meta[property="og:type"]',{property:'og:type',content:'website'});
 set('meta[property="og:title"]',{property:'og:title',content:title});
 set('meta[property="og:description"]',{property:'og:description',content:description});
 set('meta[property="og:url"]',{property:'og:url',content:href});
 set('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
 let c=document.head.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=href;
}
