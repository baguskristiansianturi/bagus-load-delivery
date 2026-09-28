export const SUPPLIERS=[
{id:'sup-a',name:'Mitra Bangunan Bali',rating:4.9,areas:['Denpasar','Badung','Gianyar']},
{id:'sup-b',name:'Bali Material Center',rating:4.8,areas:['Denpasar','Badung','Ubud']},
{id:'sup-c',name:'Supplier Proyek Nusantara',rating:4.7,areas:['Bali']}
];
export const SUPPLIER_PRODUCTS={};
export function offersFor(product){return SUPPLIERS.map((s,i)=>({supplierId:s.id,supplier:s.name,price:Math.max(1000,Number(product.price)+(i===1?-2000:i===2?1500:0)),stock:[50,100,200][i],availability:i===0?'Same-day':'Scheduled'}));}
export const PROCUREMENT_STAGES=['confirmed','supplier-preparing','pickup','loading','in-transit','delivered'];