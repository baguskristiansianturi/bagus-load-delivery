import {ALL_CATALOG,PRODUCTS,getItem} from '../data/catalog.js';
import {SUPPLIERS,offersFor} from '../data/marketplace.js';
const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9\\s.\\-]/g,' ').replace(/\\s+/g,' ').trim();
const corrections={semn:'semen',semenn:'semen',smen:'semen',cement:'semen',duluxx:'dulux',gypsm:'gypsum',gypsumboar:'gypsum board',truk:'truck',angkutan:'truck'};
const correct=q=>q.split(' ').filter(Boolean).map(t=>corrections[t]||t).join(' ');
export const searchService={
 normalize,
 suggest(query){const q=normalize(query),c=correct(q);const titles=[...new Set(ALL_CATALOG.map(x=>x.title))];return {query:q,corrected:c,changed:c!==q,suggestions:titles.filter(x=>normalize(x).includes(c)||normalize(x).includes(q)).slice(0,6),categories:['Besi & Baja','Semen & Beton','Pasir & Batu','Cat & Finishing','Plumbing'].filter(x=>normalize(x).includes(c)||c.includes(normalize(x).split(' ')[0])).slice(0,5)}},
 search(query,options={}){const q=normalize(query),c=correct(q),terms=[q,c].filter(Boolean);let items=ALL_CATALOG.map(x=>{const hay=normalize([x.title,x.provider,x.category,x.type].join(' '));let score=0;terms.forEach(term=>term.split(' ').forEach(t=>{if(hay.includes(t))score+=hay.startsWith(t)?4:2}));return {...x,_score:score}}).filter(x=>x._score>0);if(options.type)items=items.filter(x=>x.type===options.type);items.sort((a,b)=>options.sort==='price_asc'?a.price-b.price:options.sort==='price_desc'?b.price-a.price:options.sort==='rating'?(b.rating||0)-(a.rating||0):b._score-a._score);return {query:q,corrected:c,changed:c!==q,items:items.map(({_score,...x})=>x)}}
};
export const productService={getById:getItem,list:()=>PRODUCTS,offers:product=>offersFor(product)};
export const supplierService={list:()=>SUPPLIERS,getById:id=>SUPPLIERS.find(x=>x.id===id)||null,offers:product=>offersFor(product)};
export const categoryService={list:()=>[]};
export const procurementService={recommend(items=[]){const subtotal=items.reduce((n,x)=>n+(Number(x.price)||0)*(Number(x.quantity)||1),0);const suppliers=[...new Set(items.map(x=>x.supplier||x.provider||'Supplier'))];const delivery=items.length?95000:0;return {suppliers,subtotal,delivery,total:subtotal+delivery,strategy:'balanced'}}};
export const deliveryService={estimate({weight=0,stops=1}={})=>({method:weight>1000?'truck':'l300',stops,eta:stops>1?'Today · coordinated pickup':'Today · scheduled'})};
export const paymentService={createIntent:async()=>({status:'not_connected',message:'Payment gateway will be connected to the backend'})};
export const settlementService={status:()=>({status:'pending',message:'Settlement is backend-controlled'})};
export const reviewService={};export const promotionService={};
export const authService={getSession:()=>{try{return JSON.parse(localStorage.getItem('bld_user_v1'))}catch{return null}},clear:()=>localStorage.removeItem('bld_user_v1')};