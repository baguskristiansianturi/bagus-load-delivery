# PLUITS Engineering — Start Here

Dokumen ini adalah pintu masuk untuk memahami susunan teknis PLUITS. Tidak perlu membaca atau menghafalkan kode terlebih dahulu.

## Urutan belajar yang disarankan

1. [Engineering Architecture Playbook](./ENGINEERING-ARCHITECTURE-PLAYBOOK.md) — cara kerja dan aturan pengembangan.
2. [Page, Route and Section Registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md) — halaman yang sudah ada, alamatnya, pemilik file, alias, dan placeholder.
3. [Design System and Component Standard](./DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md) — font, warna, ukuran, ikon, komponen, CSS.
4. [Frontend, Backend and VPS Boundaries](./FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md) — fungsi frontend/backend, alur data, dan persiapan VPS.
5. [Existing Frontend Module Map](./FRONTEND-MODULE-MAP.md) — pemetaan modul yang sudah ada.
6. [Existing Frontend Module Contracts](./FRONTEND-MODULE-CONTRACTS.md) — batas tanggung jawab dan aturan perubahan.
7. [PLUITS Application Architecture](./PLUITS-APPLICATION-ARCHITECTURE.md) — arsitektur aplikasi yang sudah menjadi baseline.

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
