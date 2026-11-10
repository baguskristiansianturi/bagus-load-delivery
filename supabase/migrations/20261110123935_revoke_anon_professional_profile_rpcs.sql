-- These RPCs require a signed-in user; review additionally requires an admin/moderator claim.
-- Keep authenticated access intact while removing anonymous execution.
revoke execute on function public.review_professional_profile(uuid, text, text) from public, anon;
revoke execute on function public.submit_professional_profile(uuid) from public, anon;
grant execute on function public.review_professional_profile(uuid, text, text) to authenticated;
grant execute on function public.submit_professional_profile(uuid) to authenticated;
