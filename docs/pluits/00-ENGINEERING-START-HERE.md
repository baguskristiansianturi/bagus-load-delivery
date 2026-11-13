# PLUITS Engineering — Start Here

Dokumen ini adalah pintu masuk untuk memahami susunan teknis PLUITS. Tidak perlu membaca atau menghafalkan kode terlebih dahulu.

## Urutan belajar yang disarankan

1. [Engineering Architecture Playbook](./ENGINEERING-ARCHITECTURE-PLAYBOOK.md) — cara kerja dan aturan pengembangan.
2. [Page, Route and Section Registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md) — halaman yang sudah ada, alamatnya, pemilik file, alias, dan placeholder.
3. [Development Workflow and Environment Readiness](./DEVELOPMENT-WORKFLOW-AND-ENVIRONMENT-READINESS.md) — local development, PR CI, hosted preview, production boundary, Supabase environment, and readiness gates.
4. [PLUITS System Architecture Audit](./PLUITS-SYSTEM-ARCHITECTURE-AUDIT-2026-11-13.md) — inventaris struktur repository, batas frontend/backend, dependency, dan kondisi live Supabase.
5. [PLUITS Security and Migration Reconciliation Audit](./PLUITS-SECURITY-AND-MIGRATION-RECONCILIATION-AUDIT-2026-11-13.md) — temuan RLS, fungsi SQL, Storage, migrasi live vs repository, dan gerbang validasi keamanan.
6. [Reuse-First Design and Component Policy](./REUSE-FIRST-DESIGN-AND-COMPONENT-POLICY.md) — aturan wajib mencari dan menggunakan kembali aset, token, komponen dan pola yang sudah ada sebelum membuat hal baru.
7. [Production Design Inventory and Registry](./PRODUCTION-DESIGN-INVENTORY-AND-REGISTRY.md) — baseline desain online, gudang aset, layout, komponen, halaman pengguna dan aturan perubahan.
8. [Design System and Component Standard](./DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md) — font, warna, ukuran, ikon, komponen, CSS.
9. [Frontend, Backend and VPS Boundaries](./FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md) — fungsi frontend/backend, alur data, dan persiapan VPS.
10. [Existing Frontend Module Map](./FRONTEND-MODULE-MAP.md) — pemetaan modul yang sudah ada, pemilik runtime saat ini, dan folder target.
11. [Existing Frontend Module Contracts](./FRONTEND-MODULE-CONTRACTS.md) — batas tanggung jawab dan aturan perubahan.
12. [PLUITS Application Architecture](./PLUITS-APPLICATION-ARCHITECTURE.md) — arsitektur aplikasi yang sudah menjadi baseline.

## Cara membaca folder kode

- `index.html`: pintu masuk dokumen web.
- `src/main.js`: bootstrap aplikasi.
- `src/app/router.js`: pemilih halaman berdasarkan route.
- `src/config/`: target konfigurasi non-rahasia dan metadata route; lihat README status.
- `src/pages/`: pemilik halaman/route.
- `src/features/`: fitur dan perilaku yang dapat dipakai kembali; README menandai fitur yang masih direncanakan.
- `src/components/`: komponen bersama.
- `src/design-system/`: target design tokens dan standar visual; gaya existing tetap authoritative sampai diekstrak.
- `src/styles/` dan `src/style.css`: stylesheet bersama/global yang masih berjalan.
- `src/services/`: komunikasi dengan layanan dan penyimpanan.
- `src/lib/`: SDK dan konfigurasi library.
- `src/platform/`: target adapter browser/native; belum ada implementasi native.
- `supabase/migrations/`: perubahan struktur database, policy dan fungsi SQL.
- `tests/`: pengujian otomatis.
- `scripts/verify-module-boundaries.mjs`: pemeriksaan otomatis arah dependensi modul, dijalankan melalui `npm test`.

## Status penting

Daftar halaman dalam registry adalah inventaris route dari kode saat ini, bukan jaminan semua alur sudah lengkap. Saat ini route Inbox yang aktif adalah `#/inbox` (alias lama `#/messages`) dan runtime-nya dimiliki `src/pages/messages/`. Folder Inbox Personal dan Inbox Toko hanya berisi README placeholder untuk roadmap; keduanya belum memiliki route, controller, atau runtime sendiri.

Folder scaffolding lain juga hanya penanda target ownership, bukan fitur runtime. Jangan memindahkan kode atau menyatakan fitur selesai hanya karena folder target sudah tersedia.
