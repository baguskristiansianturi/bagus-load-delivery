-- Cover foreign keys introduced by GeoDirectory to keep joins and cascades bounded.
create index if not exists directory_categories_parent_idx on public.directory_categories(parent_id) where parent_id is not null;
create index if not exists directory_entities_created_by_idx on public.directory_entities(created_by) where created_by is not null;
create index if not exists directory_entities_merged_into_idx on public.directory_entities(merged_into) where merged_into is not null;
create index if not exists directory_entity_categories_category_idx on public.directory_entity_categories(category_id);
create index if not exists directory_locations_entity_idx on public.directory_locations(entity_id);
create index if not exists directory_entity_sources_entity_idx on public.directory_entity_sources(entity_id);
create index if not exists directory_claims_entity_idx on public.directory_claims(entity_id);
create index if not exists directory_claims_applicant_idx on public.directory_claims(applicant_user_id);
create index if not exists directory_claims_reviewer_idx on public.directory_claims(reviewer_user_id) where reviewer_user_id is not null;
create index if not exists directory_memberships_granted_by_idx on public.directory_memberships(granted_by) where granted_by is not null;
create index if not exists directory_media_uploaded_by_idx on public.directory_media(uploaded_by);
create index if not exists directory_relationships_created_by_idx on public.directory_relationships(created_by) where created_by is not null;
create index if not exists user_interest_preferences_category_idx on public.user_interest_preferences(category_id);
create index if not exists user_activity_events_category_idx on public.user_activity_events(category_id,created_at desc) where category_id is not null;
create index if not exists user_recommendation_feedback_entity_idx on public.user_recommendation_feedback(entity_id) where entity_id is not null;
create index if not exists user_recommendation_feedback_category_idx on public.user_recommendation_feedback(category_id) where category_id is not null;
create index if not exists user_post_directory_entities_tagged_by_idx on public.user_post_directory_entities(tagged_by);
