-- Tighten API table privileges; RLS remains the row-level boundary.
revoke all on public.directory_entity_sources from public, anon, authenticated;

revoke all on public.directory_claims from public, anon;
revoke all on public.directory_memberships from public, anon;

revoke all on public.user_discovery_preferences,
  public.user_interest_preferences,
  public.user_activity_events,
  public.user_recommendation_feedback,
  public.user_saved_items,
  public.user_recent_items
from public, anon;

revoke all on public.directory_categories,
  public.directory_entities,
  public.directory_entity_categories,
  public.directory_locations
from public;

grant select on public.directory_categories,
  public.directory_entities,
  public.directory_entity_categories,
  public.directory_locations to anon, authenticated;

grant select, insert on public.directory_claims to authenticated;
grant select on public.directory_memberships to authenticated;

grant select, insert, update, delete on public.user_discovery_preferences,
  public.user_interest_preferences,
  public.user_recommendation_feedback,
  public.user_saved_items,
  public.user_recent_items to authenticated;

grant select, insert, delete on public.user_activity_events to authenticated;
