import test from 'node:test';
import assert from 'node:assert/strict';
import { createPresenceManager } from '../../src/services/realtime/presence/index.js';

function createFakeClient() {
  const channels = [];
  const removed = [];
  const client = {
    channel(name, options) {
      const channel = {
        name,
        options,
        tracked: [],
        subscribe(callback) { this.onStatus = callback; return this; },
        async track(payload) { this.tracked.push(payload); }
      };
      channels.push(channel);
      return channel;
    },
    async removeChannel(channel) { removed.push(channel); }
  };
  return { client, channels, removed };
}

test('presence tracks one channel per active account and avoids duplicates', async () => {
  const { client, channels, removed } = createFakeClient();
  const manager = createPresenceManager(client, { now: () => '2026-11-13T00:00:00.000Z' });

  await manager.sync({ user: { id: 'user-a' } });
  await manager.sync({ user: { id: 'user-a' } });
  assert.equal(channels.length, 1);
  assert.deepEqual(channels[0].options.config.presence, { key: 'user-a' });

  await channels[0].onStatus('SUBSCRIBED');
  assert.deepEqual(channels[0].tracked, [{
    user_id: 'user-a',
    online_at: '2026-11-13T00:00:00.000Z'
  }]);
  assert.equal(removed.length, 0);
});

test('presence removes the previous account channel on account change and sign-out', async () => {
  const { client, channels, removed } = createFakeClient();
  const manager = createPresenceManager(client);

  await manager.sync({ user: { id: 'user-a' } });
  await manager.sync({ user: { id: 'user-b' } });
  assert.equal(channels.length, 2);
  assert.deepEqual(removed, [channels[0]]);

  await manager.sync(null);
  assert.deepEqual(removed, [channels[0], channels[1]]);
  await manager.stop();
  assert.equal(removed.length, 2);
});
