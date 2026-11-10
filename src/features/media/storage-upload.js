let tusModulePromise;
async function loadTusUpload(){if(!tusModulePromise)tusModulePromise=import('https://esm.sh/tus-js-client@4.3.1').then(module=>module.Upload).catch(()=>null);return tusModulePromise;}
export function createMediaUploader({supabase,bucket,supabaseUrl,publishableKey}){return async(file,path,mime,onProgress=()=>{})=>{
 if(file.size<=6*1024*1024){const result=await supabase.storage.from(bucket).upload(path,file,{contentType:mime,upsert:false});if(result.error)throw result.error;onProgress(100);return result;}
 const TusUpload=await loadTusUpload();
 if(!TusUpload){const fallback=await supabase.storage.from(bucket).upload(path,file,{contentType:mime,upsert:false});if(fallback.error)throw fallback.error;onProgress(100);return fallback;}
 const {data:{session},error}=await supabase.auth.getSession();if(error)throw error;if(!session?.access_token)throw new Error('Sesi login berakhir. Silakan masuk kembali.');
 const ref=new URL(supabaseUrl).hostname.split('.')[0];
 return new Promise((resolve,reject)=>{const upload=new TusUpload(file,{endpoint:`https://${ref}.storage.supabase.co/storage/v1/upload/resumable`,retryDelays:[0,3000,5000,10000,20000],headers:{authorization:'Bearer '+session.access_token,apikey:publishableKey,'x-upsert':'false'},uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,chunkSize:6*1024*1024,metadata:{bucketName:bucket,objectName:path,contentType:mime,cacheControl:'3600'},onProgress:(sent,total)=>onProgress(total?sent/total*100:0),onError:reject,onSuccess:()=>resolve({data:{path},error:null})});upload.findPreviousUploads().then(previous=>{if(previous.length)upload.resumeFromPreviousUpload(previous[0]);upload.start();}).catch(reject);});
};}
