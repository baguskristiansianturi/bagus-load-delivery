/**
 * App-wide Supabase Realtime presence lifecycle.
 * Inject the client so the lifecycle can be tested without a live project.
 */
export function createPresenceManager(client, { now = () => new Date().toISOString() } = {}) {
  let channel = null;
  let activeUserId = null;
  let queue = Promise.resolve();

  function sync(session) {
    const task = queue.then(async () => {
      const userId = session?.user?.id || null;
      if (userId === activeUserId && channel) return;

      if (channel) {
        const previous = channel;
        channel = null;
        await client.removeChannel(previous);
      }

      activeUserId = userId;
      if (!userId) return;

      const nextChannel = client.channel('pluits-online-v1', {
        config: { presence: { key: userId } }
      });
      channel = nextChannel;
      nextChannel.subscribe(async status => {
        if (status !== 'SUBSCRIBED' || channel !== nextChannel) return;
        await nextChannel.track({ user_id: userId, online_at: now() });
      });
    });
    queue = task.catch(() => {});
    return task;
  }

  function stop() {
    const task = queue.then(async () => {
      const previous = channel;
      channel = null;
      activeUserId = null;
      if (previous) await client.removeChannel(previous);
    });
    queue = task.catch(() => {});
    return task;
  }

  return { sync, stop };
}

export function startGlobalPresence(client, options) {
  const manager = createPresenceManager(client, options);

  client.auth.getSession()
    .then(({ data }) => manager.sync(data?.session))
    .catch(error => console.error('Pluits initial presence sync failed:', error));

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    queueMicrotask(() => {
      manager.sync(session).catch(error => console.error('Pluits presence sync failed:', error));
    });
  });

  return async () => {
    data?.subscription?.unsubscribe();
    await manager.stop();
  };
}
