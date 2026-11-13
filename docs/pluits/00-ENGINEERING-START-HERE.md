# PLUITS Engineering — Start Here

Dokumen ini adalah pintu masuk untuk memahami susunan teknis PLUITS. Tidak perlu membaca atau menghafalkan kode terlebih dahulu.

## Urutan belajar yang disarankan

1. [Engineering Architecture Playbook](./ENGINEERING-ARCHITECTURE-PLAYBOOK.md) — cara kerja dan aturan pengembangan.
2. [Page, Route and Section Registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md) — halaman yang sudah ada, alamatnya, pemilik file, alias, dan placeholder.
3. [Reuse-First Design and Component Policy](./REUSE-FIRST-DESIGN-AND-COMPONENT-POLICY.md) — aturan wajib mencari dan menggunakan kembali aset, token, komponen dan pola yang sudah ada sebelum membuat hal baru.
4. [Production Design Inventory and Registry](./PRODUCTION-DESIGN-INVENTORY-AND-REGISTRY.md) — baseline desain online, gudang aset, layout, komponen, halaman pengguna dan aturan perubahan.
5. [Design System and Component Standard](./DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md) — font, warna, ukuran, ikon, komponen, CSS.
6. [Frontend, Backend and VPS Boundaries](./FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md) — fungsi frontend/backend, alur data, dan persiapan VPS.
7. [Existing Frontend Module Map](./FRONTEND-MODULE-MAP.md) — pemetaan modul yang sudah ada.
8. [Existing Frontend Module Contracts](./FRONTEND-MODULE-CONTRACTS.md) — batas tanggung jawab dan aturan perubahan.
9. [PLUITS Application Architecture](./PLUITS-APPLICATION-ARCHITECTURE.md) — arsitektur aplikasi yang sudah menjadi baseline.

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

Daftar halaman dalam registry adalah inventaris route dari kode saat ini, bukan jaminan semua alur sudah lengkap. Folder Inbox Personal dan Inbox Toko yang disiapkan hanya placeholder; keduanya belum didaftarkan sebagai route dan belum mengubah halaman Inbox yang sedang aktif.
