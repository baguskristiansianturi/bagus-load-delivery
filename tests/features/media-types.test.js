import test from 'node:test';
import assert from 'node:assert/strict';
import {getMediaMime,getMediaExtension,validateMediaFile} from '../../src/features/media/media-types.js';
const file=(name,type='',size=1024)=>({name,type,size});
test('recognizes Android 3G2 when picker MIME is generic',()=>{
 const selected=file('VID_20261110.3g2','application/octet-stream');
 assert.equal(getMediaMime(selected),'video/3gpp2');
 assert.equal(getMediaExtension(selected),'3g2');
 assert.equal(validateMediaFile(selected).valid,true);
});
test('recognizes 3GPP and normal video formats',()=>{
 assert.equal(getMediaMime(file('clip.3gp','')),'video/3gpp');
 assert.equal(getMediaMime(file('clip.bin','video/3gpp2')),'video/3gpp2');
 assert.equal(getMediaMime(file('clip.MP4','application/octet-stream')),'video/mp4');
 assert.equal(getMediaMime(file('clip.mov','video/quicktime')),'video/quicktime');
 assert.equal(getMediaMime(file('clip.webm','video/webm')),'video/webm');
});
test('rejects unsupported/empty media and enforces 50 MB',()=>{
 assert.equal(validateMediaFile(file('clip.mkv','video/x-matroska')).reason,'unsupported');
 assert.equal(validateMediaFile(file('empty.mp4','video/mp4',0)).reason,'empty');
 assert.equal(validateMediaFile(file('large.mp4','video/mp4',50*1024*1024+1)).reason,'too-large');
 assert.equal(validateMediaFile(file('limit.mp4','video/mp4',50*1024*1024)).valid,true);
});

test('accepts MOV, MP4 and 3GP when Android provides no MIME type',()=>{
 assert.equal(getMediaMime(file('clip.mp4','')),'video/mp4');
 assert.equal(getMediaMime(file('clip.mov','')),'video/quicktime');
 assert.equal(getMediaMime(file('clip.3gp','')),'video/3gpp');
});
