# PLUITS Engineering — Start Here

Dokumen ini adalah pintu masuk untuk memahami susunan teknis PLUITS. Tidak perlu membaca atau menghafalkan kode terlebih dahulu.

## Urutan belajar yang disarankan

1. [Engineering Architecture Playbook](./ENGINEERING-ARCHITECTURE-PLAYBOOK.md) — cara kerja dan aturan pengembangan.
2. [Page, Route and Section Registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md) — halaman yang sudah ada, alamatnya, pemilik file, alias, dan placeholder.
3. [PLUITS System Architecture Audit](./PLUITS-SYSTEM-ARCHITECTURE-AUDIT-2026-11-13.md) — inventaris struktur repository, batas frontend/backend, dependency, dan kondisi live Supabase.
4. [PLUITS Security and Migration Reconciliation Audit](./PLUITS-SECURITY-AND-MIGRATION-RECONCILIATION-AUDIT-2026-11-13.md) — temuan RLS, fungsi SQL, Storage, migrasi live vs repository, dan gerbang validasi keamanan.
5. [Reuse-First Design and Component Policy](./REUSE-FIRST-DESIGN-AND-COMPONENT-POLICY.md) — aturan wajib mencari dan menggunakan kembali aset, token, komponen dan pola yang sudah ada sebelum membuat hal baru.
6. [Production Design Inventory and Registry](./PRODUCTION-DESIGN-INVENTORY-AND-REGISTRY.md) — baseline desain online, gudang aset, layout, komponen, halaman pengguna dan aturan perubahan.
7. [Design System and Component Standard](./DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md) — font, warna, ukuran, ikon, komponen, CSS.
8. [Frontend, Backend and VPS Boundaries](./FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md) — fungsi frontend/backend, alur data, dan persiapan VPS.
9. [Existing Frontend Module Map](./FRONTEND-MODULE-MAP.md) — pemetaan modul yang sudah ada.
10. [Existing Frontend Module Contracts](./FRONTEND-MODULE-CONTRACTS.md) — batas tanggung jawab dan aturan perubahan.
11. [PLUITS Application Architecture](./PLUITS-APPLICATION-ARCHITECTURE.md) — arsitektur aplikasi yang sudah menjadi baseline.

## Cara membaca folder kode

- `index.html`: pintu masuk dokumen web.
- `src/main.js`: bootstrap aplikasi.
- `src/app/router.js`: pemilih halaman berdasarkan route.
- `src/pages/`: pemilik halaman/route.
- `src/features/`: fitur dan perilaku yang dapat dipakai oleh halaman.
- `src/components/`: komponen bersama.
- `src/styles/` dan `src/style.css`: stylesheet bersama/global.
- `src/services/`: komunikasi dengan layanan dan penyimpanan.
- `src/lib/`: library/integrasi dasar.
- `supabase/migrations/`: perubahan struktur database, policy dan fungsi SQL.
- `tests/`: pengujian otomatis.

## Status penting

Daftar halaman dalam registry adalah inventaris route dari kode saat ini, bukan jaminan semua alur sudah lengkap. Saat ini route Inbox yang aktif adalah `#/inbox` (alias lama `#/messages`) dan runtime-nya dimiliki `src/pages/messages/`. Folder Inbox Personal dan Inbox Toko hanya berisi README placeholder untuk roadmap; keduanya belum memiliki route, controller, atau runtime sendiri. Jangan menganggap placeholder itu sebagai implementasi aktif.
