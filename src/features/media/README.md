# Media

**Status:** Partially implemented; media type detection and upload helpers exist.

**Current runtime owner:** `src/features/media/` and `src/services/storage/`.

**Target responsibility:** Media selection, validation, preview, upload orchestration and media metadata UI.

**Implementation boundary:** Storage ownership, access and signed URLs are backend/service responsibilities.

This README records the planned module boundary only. It does not imply runtime implementation or a new route. Keep current working behavior in its existing owner until extraction has consumer mapping, regression tests and review.
