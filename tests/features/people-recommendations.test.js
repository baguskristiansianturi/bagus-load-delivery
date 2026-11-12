import test from 'node:test';
import assert from 'node:assert/strict';
import {rankPeopleRecommendations,renderPeopleRecommendations} from '../../src/features/discovery/people-recommendations.js';
const now=Date.parse('2026-11-12T12:00:00Z');
const profile=(id,overrides={})=>({id,display_name:id,username:id,visibility:'public',created_at:'2026-11-10T12:00:00Z',...overrides});
test('recommendations exclude viewer, followed, blocked, related and private accounts',()=>{
 const people=rankPeopleRecommendations({
  viewerId:'me',profiles:[profile('me'),profile('followed'),profile('blocked'),profile('related'),profile('private',{visibility:'private'}),profile('eligible')],
  followingIds:['followed'],blockedIds:['blocked'],relationships:[{follower_id:'related',following_id:'me',status:'pending'}],now
 });
 assert.deepEqual(people.map(x=>x.id),['eligible']);
});
test('new accounts and mutual connections receive ranking priority',()=>{
 const people=rankPeopleRecommendations({
  viewerId:'me',profiles:[profile('older',{created_at:'2026-08-01T12:00:00Z'}),profile('new'),profile('mutual',{created_at:'2026-08-01T12:00:00Z'})],
  mutualCounts:{mutual:2},now
 });
 assert.deepEqual(people.map(x=>x.id),['mutual','new','older']);
 assert.equal(people[1].isNew,true);
 assert.equal(people[0].mutualCount,2);
});
test('recommendation renderer has a truthful empty state and profile actions',()=>{
 assert.match(renderPeopleRecommendations({people:[]}),/Belum ada rekomendasi akun baru/);
 const html=renderPeopleRecommendations({people:[{...profile('new'),isNew:true,public_city:'Jakarta'}]});
 assert.match(html,/Orang yang Mungkin Anda Kenal/);
 assert.match(html,/>NEW</);
 assert.match(html,/From Jakarta/);
 assert.doesNotMatch(html,/@new/);
 assert.doesNotMatch(html,/<a class="ua-people-profile"/);
 assert.ok(html.includes('<span aria-hidden="true">+</span>'));
 assert.match(html,/data-people-follow="new"/);
});

test('profile image framing is independent, bounded, and applied to recommendation cards',async()=>{
 const {normalizeProfileImageFrame,profileImageFrameCss}=await import('../../src/features/profile/image-framing.js');
 const normalized=normalizeProfileImageFrame({avatar_x:140,avatar_y:-10,avatar_zoom:3,card_x:25,card_y:60,card_zoom:1.2});
 assert.deepEqual(normalized,{avatar_x:100,avatar_y:0,avatar_zoom:2.5,card_x:25,card_y:60,card_zoom:1.2});
 assert.match(profileImageFrameCss(normalized,'avatar'),/--ua-image-x:100%;--ua-image-y:0%;--ua-image-zoom:2.5/);
 const html=renderPeopleRecommendations({people:[{...profile('new'),isNew:true,public_city:'Jakarta',avatar_path:'avatar.jpg'}],avatarUrls:new Map([['avatar.jpg','https://example.test/avatar.jpg']]),imageFrames:new Map([['new',{card_x:20,card_y:35,card_zoom:1.3}]])});
 assert.match(html,/--ua-image-x:20%;--ua-image-y:35%;--ua-image-zoom:1.3/);
});
