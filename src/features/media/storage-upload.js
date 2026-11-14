let tusModulePromise;
async function loadTusUpload(){
 if(!tusModulePromise)tusModulePromise=import('https://esm.sh/tus-js-client@4.3.1').then(module=>module.Upload).catch(()=>null);
 return tusModulePromise;
}
function responseStatus(error){
 const response=error?.originalResponse;
 try{return Number(response?.getStatus?.()||response?.statusCode||error?.statusCode||0);}catch{return 0;}
}
async function standardUpload(supabase,bucket,path,file,contentType,onProgress){
 const result=await supabase.storage.from(bucket).upload(path,file,{contentType,upsert:false});
 if(result.error)throw result.error;
 onProgress(100);
 return result;
}
export function createMediaUploader({supabase,bucket,supabaseUrl,publishableKey}){
 return async(file,path,mime,onProgress=()=>{})=>{
  if(!file||!path)throw new Error('File atau lokasi penyimpanan tidak tersedia.');
  const contentType=String(mime||file.type||'application/octet-stream').split(';')[0].trim();
  if(file.size<=6*1024*1024)return standardUpload(supabase,bucket,path,file,contentType,onProgress);
  const TusUpload=await loadTusUpload();
  if(!TusUpload)return standardUpload(supabase,bucket,path,file,contentType,onProgress);
  const {data:{session},error}=await supabase.auth.getSession();
  if(error)throw error;
  if(!session?.access_token)throw new Error('Sesi login berakhir. Silakan masuk kembali.');
  const ref=new URL(supabaseUrl).hostname.split('.')[0];
  const endpoint=`https://${ref}.storage.supabase.co/storage/v1/upload/resumable`;
  try{
   return await new Promise((resolve,reject)=>{
    const upload=new TusUpload(file,{
     endpoint,
     retryDelays:[0,3000,5000,10000,20000],
     headers:{authorization:'Bearer '+session.access_token,apikey:publishableKey,'x-upsert':'false'},
     uploadDataDuringCreation:true,
     removeFingerprintOnSuccess:true,
     chunkSize:6*1024*1024,
     // The object path is part of the fingerprint. Re-selecting the same video
     // for a new post must never resume an earlier upload into a different path.
     fingerprint:(selected,options)=>Promise.resolve([options.endpoint,bucket,path,selected.name,selected.size,selected.lastModified].join(':')),
     metadata:{bucketName:bucket,objectName:path,contentType,cacheControl:'3600'},
     onProgress:(sent,total)=>onProgress(total?sent/total*100:0),
     onError:reject,
     onSuccess:()=>resolve({data:{path},error:null})
    });
    upload.findPreviousUploads().then(previous=>{
     if(previous.length)upload.resumeFromPreviousUpload(previous[0]);
     upload.start();
    }).catch(reject);
   });
  }catch(error){
   const status=responseStatus(error);
   // Authentication, permission, validation and quota errors are not transient.
   if(status>=400&&status<500)throw error;
   // A network interruption may leave an incomplete resumable object. Remove
   // only this fresh, owner-scoped path before attempting the SDK fallback.
   const cleanup=await supabase.storage.from(bucket).remove([path]);
   if(cleanup.error)throw error;
   return standardUpload(supabase,bucket,path,file,contentType,onProgress);
  }
 };
}
