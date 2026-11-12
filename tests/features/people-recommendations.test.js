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
 const html=renderPeopleRecommendations({people:[{...profile('new'),isNew:true}]});
 assert.match(html,/Orang yang Mungkin Anda Kenal/);
 assert.match(html,/Baru bergabung/);
 assert.match(html,/data-people-follow="new"/);
});
