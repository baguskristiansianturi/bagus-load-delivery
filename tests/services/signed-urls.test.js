import test from 'node:test';
import assert from 'node:assert/strict';
import {createSignedUrlMap} from '../../src/services/storage/signed-urls.js';
test('deduplicates paths and signs them in batches',async()=>{
 const calls=[];
 const storage={from(bucket){return {createSignedUrls:async(paths,expires)=>{calls.push({bucket,paths,expires});return {data:paths.map(path=>({path,signedUrl:'signed:'+path})),error:null};}};}};
 const urls=await createSignedUrlMap(storage,'private-media',['a.jpg','b.mp4','a.jpg','',null],1800,2);
 assert.equal(calls.length,1);
 assert.deepEqual(calls[0].paths,['a.jpg','b.mp4']);
 assert.equal(urls.get('a.jpg'),'signed:a.jpg');
});
test('splits more than 100 paths into bounded requests',async()=>{
 const sizes=[];
 const storage={from(){return {createSignedUrls:async paths=>{sizes.push(paths.length);return {data:paths.map(path=>({path,signedUrl:'signed:'+path})),error:null};}};}};
 const urls=await createSignedUrlMap(storage,'media',Array.from({length:205},(_,i)=>'file-'+i));
 assert.deepEqual(sizes,[100,100,5]);
 assert.equal(urls.size,205);
});
test('falls back to individual signing only if batch fails',async()=>{
 const calls=[];
 const storage={from(){return {
  createSignedUrls:async()=>({data:null,error:new Error('batch unavailable')}),
  createSignedUrl:async path=>{calls.push(path);return {data:{signedUrl:'fallback:'+path},error:null};}
 };}};
 const urls=await createSignedUrlMap(storage,'media',['one','two']);
 assert.deepEqual(calls,['one','two']);
 assert.equal(urls.get('two'),'fallback:two');
});
test('does not call Storage for empty paths',async()=>{
 let called=false;
 const storage={from(){called=true;throw new Error('should not run');}};
 assert.equal((await createSignedUrlMap(storage,'media',[null,''])).size,0);
 assert.equal(called,false);
});
