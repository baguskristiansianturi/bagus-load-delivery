# Supabase Database Tests

**Status:** structure only; isolated migration replay is blocked by migration reconciliation.

Use pgTAP/SQL tests for backend contracts that frontend tests cannot prove. Run only against isolated local/test databases, never production by default.

Required coverage: anonymous vs authenticated reads, owner vs non-owner access, cross-user/cross-store isolation, RLS, Storage paths, RPC grants and state transitions.
