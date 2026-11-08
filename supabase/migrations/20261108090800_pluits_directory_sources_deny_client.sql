create policy directory_entity_sources_deny_client_access on public.directory_entity_sources
for all to anon, authenticated
using (false)
with check (false);
