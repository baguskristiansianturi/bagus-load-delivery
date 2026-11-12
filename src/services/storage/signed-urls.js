export async function createSignedUrlMap(storage,bucket,paths,expiresIn=3600,batchSize=100){
 const unique=[...new Set((paths||[]).filter(path=>typeof path==='string'&&path.trim()).map(path=>path.trim()))];
 const urls=new Map();
 if(!unique.length)return urls;
 const size=Math.max(1,Math.min(100,batchSize||100));
 for(let offset=0;offset<unique.length;offset+=size){
  const batch=unique.slice(offset,offset+size);
  const result=await storage.from(bucket).createSignedUrls(batch,expiresIn);
  if(result.error){
   const fallback=await Promise.all(batch.map(async path=>{
    const item=await storage.from(bucket).createSignedUrl(path,expiresIn);
    return [path,item.error?'':(item.data?.signedUrl||'')];
   }));
   for(const [path,url] of fallback)if(url)urls.set(path,url);
   continue;
  }
  for(const item of result.data||[]){
   if(item.path&&item.signedUrl&&!item.error)urls.set(item.path,item.signedUrl);
  }
 }
 return urls;
}


/**
 * Create sharp, consistently sized portrait URLs for profile cards.
 * Keeps the original upload untouched; if Storage image rendering is unavailable,
 * gracefully falls back to the original signed image URL.
 */
export async function createProfileImageUrlMap(storage,bucket,paths,expiresIn=3600){
 const unique=[...new Set((paths||[]).filter(path=>typeof path==='string'&&path.trim()).map(path=>path.trim()))];
 const urls=new Map();
 await Promise.all(unique.map(async path=>{
  const optimized=await storage.from(bucket).createSignedUrl(path,expiresIn,{
   transform:{width:640,height:960,resize:'cover',quality:88}
  });
  if(!optimized.error&&optimized.data?.signedUrl){urls.set(path,optimized.data.signedUrl);return;}
  const fallback=await storage.from(bucket).createSignedUrl(path,expiresIn);
  if(!fallback.error&&fallback.data?.signedUrl)urls.set(path,fallback.data.signedUrl);
 }));
 return urls;
}
