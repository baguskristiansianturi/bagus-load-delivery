const DB_NAME='pluits-private-drafts-v1';
const STORE_NAME='drafts';
function openDraftDB(){
 if(!('indexedDB' in window))return Promise.reject(new Error('Penyimpanan draf lokal tidak didukung browser ini.'));
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB_NAME,1);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE_NAME)){const store=db.createObjectStore(STORE_NAME,{keyPath:'id'});store.createIndex('user_id','user_id',{unique:false});}};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||new Error('Database draf tidak dapat dibuka.'));
 });
}
function draftRequest(mode,run){
 return openDraftDB().then(db=>new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE_NAME,mode),store=tx.objectStore(STORE_NAME);
  let result;
  try{result=run(store);}catch(error){db.close();reject(error);return;}
  tx.oncomplete=()=>{db.close();resolve(result?.result??result??null);};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Penyimpanan draf gagal.'));};
  tx.onabort=()=>{db.close();reject(tx.error||new Error('Penyimpanan draf dibatalkan.'));};
 }));
}
export async function listPrivateDrafts(userId){
 const rows=await draftRequest('readonly',store=>store.index('user_id').getAll(userId));
 return (rows||[]).sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
}
export async function getPrivateDraft(userId,id){
 const row=await draftRequest('readonly',store=>store.get(id));
 return row?.user_id===userId?row:null;
}
export async function savePrivateDraft(draft){
 if(!draft?.id||!draft?.user_id)throw new Error('Identitas draf tidak lengkap.');
 return draftRequest('readwrite',store=>store.put(draft));
}
export async function deletePrivateDraft(userId,id){
 const row=await getPrivateDraft(userId,id);
 if(!row)return false;
 await draftRequest('readwrite',store=>store.delete(id));
 return true;
}
