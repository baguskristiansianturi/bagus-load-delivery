import './style.css'
import {
  MATERIAL_CATEGORIES,
  SERVICE_CATEGORIES,
  LOGISTICS_CATEGORIES,
  PROPERTY_TYPES,
} from './data/master-data.js'
import { route } from './app/router.js'
import { getItem } from './data/catalog.js'
window.__BLD_GET_ITEM = getItem

const state = {
  cartCount: 0,
  location: null,
  language: 'id',
}

const icon = {
  search: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5"></circle>
      <path d="m16 16 4.5 4.5"></path>
    </svg>`,

  heart: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 8.8c0 5.1-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 8 4c1.7 0 3.2.9 4 2.2C12.8 4.9 14.3 4 16 4a4.8 4.8 0 0 1 4.8 4.8Z"></path>
    </svg>`,

  cart: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"></path>
      <circle cx="10" cy="20" r="1"></circle>
      <circle cx="18" cy="20" r="1"></circle>
    </svg>`,

  user: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5"></circle>
      <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5"></path>
    </svg>`,

  location: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"></path>
      <circle cx="12" cy="10" r="2.5"></circle>
    </svg>`,

  chevron: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6"></path>
    </svg>`,

  arrow: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>`,

  menu: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>`,

  truck: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path>
      <circle cx="7" cy="18" r="2"></circle>
      <circle cx="18" cy="18" r="2"></circle>
    </svg>`,

  check: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6"></path>
    </svg>`,

  star: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"></path>
    </svg>`,

  app: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2"></rect>
      <path d="M10 18h4"></path>
    </svg>`,
}

const materialCategories = [
  {
    name: 'Besi & Baja',
    slug: 'besi-baja',
    visual: 'steel',
  },
  {
    name: 'Semen & Beton',
    slug: 'semen-beton',
    visual: 'cement',
  },
  {
    name: 'Pasir & Batu',
    slug: 'pasir-batu',
    visual: 'sand',
  },
  {
    name: 'Kayu',
    slug: 'kayu',
    visual: 'wood',
  },
  {
    name: 'Cat',
    slug: 'cat',
    visual: 'paint',
  },
  {
    name: 'Paku & Baut',
    slug: 'paku-baut',
    visual: 'nails',
  },
  {
    name: 'Listrik',
    slug: 'listrik',
    visual: 'electric',
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    visual: 'pipe',
  },
  {
    name: 'Keramik',
    slug: 'keramik',
    visual: 'tile',
  },
  {
    name: 'Atap',
    slug: 'atap',
    visual: 'roof',
  },
]

const products = [
  {
    id: 1,
    title: 'Besi Beton 10 mm',
    price: 78000,
    oldPrice: 85000,
    seller: 'Supplier Bangunan Nusantara',
    location: 'Tersedia di area terdekat',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Semen Portland 40 kg',
    price: 68500,
    oldPrice: 73000,
    seller: 'Mitra Material',
    location: 'Stok siap dikirim',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1590644365607-1c5a4b5e9bca?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Triplek 12 mm',
    price: 168000,
    oldPrice: 185000,
    seller: 'Toko Kayu Jaya',
    location: 'Stok tersedia',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1531835551805-16d864c8d1c6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Cat Tembok Interior 5 kg',
    price: 119000,
    oldPrice: 135000,
    seller: 'Pusat Cat Indonesia',
    location: 'Siap dikirim',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Pipa PVC 3/4 Inch',
    price: 28500,
    oldPrice: 32000,
    seller: 'Mitra Plumbing',
    location: 'Stok tersedia',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Batu Split 1/2',
    price: 340000,
    oldPrice: 375000,
    seller: 'Supplier Batu Mandiri',
    location: 'Pengiriman tersedia',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1590579491624-f98f36d4c763?auto=format&fit=crop&w=900&q=80',
  },
]

const services = [
  {
    title: 'Tukang Bangunan',
    text: 'Cari tenaga untuk pekerjaan proyek harian maupun borongan.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Instalasi Listrik',
    text: 'Temukan teknisi untuk instalasi dan perbaikan listrik.',
    image:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Plumbing',
    text: 'Pekerjaan pipa, sanitasi dan kebutuhan plumbing.',
    image:
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Renovasi',
    text: 'Dari pekerjaan kecil sampai renovasi ruang.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
  },
]

const logistics = [
  {
    title: 'Pickup',
    text: 'Untuk material dan barang proyek harian.',
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'L300',
    text: 'Pilihan praktis untuk muatan lebih banyak.',
    image:
      'https://images.unsplash.com/photo-1586191582056-d8e8b2a2f8b6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Truck Engkel',
    text: 'Untuk kebutuhan pengiriman material proyek.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Bongkar Muat',
    text: 'Bantuan tenaga untuk memindahkan material.',
    image:
      'https://images.unsplash.com/photo-1586528116493-da8b8c4a7c2e?auto=format&fit=crop&w=1000&q=80',
  },
]

const properties = [
  {
    title: 'Rumah',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Tanah',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Ruko',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Villa',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  },
]

const articles = [
  {
    title: 'Cara membandingkan harga material sebelum membeli',
    category: 'Panduan proyek',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Memilih ukuran besi sesuai kebutuhan konstruksi',
    category: 'Material',
    image:
      'https://images.unsplash.com/photo-1531835551805-16d864c8d1c6?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Berapa kapasitas truck yang cocok untuk proyek?',
    category: 'Logistik',
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=900&q=80',
  },
]

function money(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

function materialVisual(type) {
  const visuals = {
    steel: `
      <div class="material-visual steel">
        <span></span><span></span><span></span>
      </div>`,
    cement: `
      <div class="material-visual cement">
        <div class="bag-shape"></div>
      </div>`,
    sand: `
      <div class="material-visual sand">
        <span></span><span></span><span></span>
      </div>`,
    wood: `
      <div class="material-visual wood">
        <span></span><span></span>
      </div>`,
    paint: `
      <div class="material-visual paint">
        <span class="paint-can"></span>
        <span class="brush"></span>
      </div>`,
    nails: `
      <div class="material-visual nails">
        <span></span><span></span><span></span>
      </div>`,
    electric: `
      <div class="material-visual electric">
        <span class="wire"></span>
        <span class="socket"></span>
      </div>`,
    pipe: `
      <div class="material-visual pipe">
        <span></span><span></span>
      </div>`,
    tile: `
      <div class="material-visual tile">
        <span></span><span></span><span></span><span></span>
      </div>`,
    roof: `
      <div class="material-visual roof">
        <span></span><span></span><span></span>
      </div>`,
  }

  return visuals[type] || visuals.steel
}

function productCard(product) {
  const discount = discountPercent(product.price, product.oldPrice)

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${
          discount
            ? `<span class="discount-badge">-${discount}%</span>`
            : ''
        }
        <button class="product-wishlist" aria-label="Simpan">
          ${icon.heart}
        </button>
      </div>

      <div class="product-content">
        <h3>${product.title}</h3>

        <div class="product-price">
          <strong>Rp ${money(product.price)}</strong>
        </div>

        ${
          product.oldPrice
            ? `<div class="old-price">Rp ${money(product.oldPrice)}</div>`
            : ''
        }

        <div class="product-meta">
          <span>${icon.star} ${product.rating}</span>
          <span>${product.location}</span>
        </div>

        <div class="product-seller">
          ${product.seller}
        </div>
      </div>
    </article>
  `
}

function imageCard(item, type = 'service') {
  return `
    <article class="${type}-visual-card">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="visual-card-overlay"></div>
      <div class="visual-card-content">
        <h3>${item.title}</h3>
        ${item.text ? `<p>${item.text}</p>` : ''}
        <span class="visual-card-link">
          Lihat pilihan ${icon.arrow}
        </span>
      </div>
    </article>
  `
}

function header() {
  return `
    <header class="site-header">
      <div class="header-inner">

        <button class="mobile-menu-button" aria-label="Menu">
          ${icon.menu}
        </button>

        <a href="#/" class="brand">
          <span class="brand-mark">B</span>
          <span class="brand-copy">
            <strong>BAGUS</strong>
            <small>LOAD & DELIVERY</small>
          </span>
        </a>

        <button class="category-trigger">
          Kategori
          ${icon.chevron}
        </button>

        <form class="header-search" id="header-search">
          <span>${icon.search}</span>
          <input
            type="search"
            placeholder="Cari material, jasa, logistik, properti..."
            aria-label="Cari"
          >
        </form>

        <button class="location-trigger" id="location-trigger">
          ${icon.location}
          <span>
            <small>Lokasi</small>
            <strong>Pilih lokasi</strong>
          </span>
          ${icon.chevron}
        </button>

        <div class="header-actions">
          <a href="#/wishlist" class="header-action" aria-label="Wishlist">
            ${icon.heart}
          </a>

          <a href="#/cart" class="header-action cart-action" aria-label="Keranjang">
            ${icon.cart}
            <span class="cart-count">0</span>
          </a>

          <a href="#/login" class="header-login">
            ${icon.user}
            <span>Masuk</span>
          </a>
        </div>

      </div>

      <nav class="main-nav">
        <div class="nav-inner">
          <a href="#/material">Material</a>
          <a href="#/jasa">Jasa</a>
          <a href="#/logistik">Logistik</a>
          <a href="#/properti">Properti</a>
          <a href="#/promo">Promo</a>
          <a href="#/blog">Panduan Proyek</a>
        </div>
      </nav>
    </header>
  `
}

function hero() {
  return `
    <section class="hero">
      <div class="hero-container">

        <div class="hero-copy">
          <span class="hero-label">PLATFORM KEBUTUHAN PROYEK</span>

          <h1>
            Cari kebutuhan proyek,
            <em>lebih mudah.</em>
          </h1>

          <p>
            Bandingkan material, temukan jasa, atur pengiriman,
            dan cari kebutuhan proyek dari satu tempat.
          </p>

          <form class="hero-search" id="hero-search">
            <span>${icon.search}</span>
            <input
              type="search"
              placeholder="Cari besi, semen, tukang, truck..."
              aria-label="Cari kebutuhan proyek"
            >
            <button type="submit">Cari</button>
          </form>

          <div class="hero-suggestions">
            <span>Sering dicari:</span>
            <a href="#/search?q=besi+beton">Besi beton</a>
            <a href="#/search?q=semen">Semen</a>
            <a href="#/search?q=truck">Truck</a>
            <a href="#/search?q=tukang">Tukang</a>
          </div>
        </div>

        <div class="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85"
            alt="Pekerjaan proyek konstruksi"
          >

          <div class="hero-floating-card hero-floating-top">
            <span class="floating-check">${icon.check}</span>
            <div>
              <strong>Bandingkan sebelum membeli</strong>
              <small>Harga & ketersediaan</small>
            </div>
          </div>

          <div class="hero-floating-card hero-floating-bottom">
            <span>${icon.truck}</span>
            <div>
              <strong>Atur pengiriman</strong>
              <small>Material sampai ke proyek</small>
            </div>
          </div>
        </div>

      </div>
    </section>
  `
}

function categorySection() {
  return `
    <section class="section category-section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">MATERIAL</span>
            <h2>Yang sering dicari</h2>
          </div>
          <a href="#/material" class="view-all">
            Lihat semua
            ${icon.arrow}
          </a>
        </div>

        <div class="category-grid">
          ${materialCategories
            .map(
              (category) => `
                <a
                  href="#/material/${category.slug}"
                  class="material-category"
                >
                  <div class="category-visual">
                    ${materialVisual(category.visual)}
                  </div>
                  <strong>${category.name}</strong>
                </a>
              `,
            )
            .join('')}
        </div>

      </div>
    </section>
  `
}

function promoSection() {
  return `
    <section class="section promo-section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">PENAWARAN</span>
            <h2>Temukan harga yang menarik</h2>
          </div>

          <a href="#/promo" class="view-all">
            Semua promo
            ${icon.arrow}
          </a>
        </div>

        <div class="promo-grid">
          <a href="#/promo" class="promo-main">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80"
              alt="Promo material"
              loading="lazy"
            >
            <div>
              <span>UNTUK PROYEK ANDA</span>
              <h3>Bandingkan harga material sebelum berangkat ke toko.</h3>
              <p>Cek pilihan penyedia dan harga dari satu tempat.</p>
            </div>
          </a>

          <a href="#/promo" class="promo-small">
            <div class="promo-small-image">
              <img
                src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80"
                alt="Promo cat"
                loading="lazy"
              >
            </div>
            <div>
              <span>PROMO MATERIAL</span>
              <h3>Cat & perlengkapan proyek</h3>
              <p>Lihat penawaran dari penyedia.</p>
            </div>
          </a>

          <a href="#/promo" class="promo-small">
            <div class="promo-small-image">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=800&q=80"
                alt="Promo logistik"
                loading="lazy"
              >
            </div>
            <div>
              <span>LOGISTIK</span>
              <h3>Butuh kendaraan angkut?</h3>
              <p>Cari kendaraan sesuai kebutuhan muatan.</p>
            </div>
          </a>
        </div>

      </div>
    </section>
  `
}

function productSection() {
  return `
    <section class="section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">MATERIAL</span>
            <h2>Material yang banyak dicari</h2>
          </div>

          <a href="#/material" class="view-all">
            Lihat semua
            ${icon.arrow}
          </a>
        </div>

        <div class="product-grid">
          ${products.map(productCard).join('')}
        </div>

      </div>
    </section>
  `
}

function serviceSection() {
  return `
    <section class="section soft-section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">JASA</span>
            <h2>Butuh tenaga untuk proyek?</h2>
          </div>

          <a href="#/jasa" class="view-all">
            Lihat semua jasa
            ${icon.arrow}
          </a>
        </div>

        <div class="visual-grid">
          ${services.map((item) => imageCard(item, 'service')).join('')}
        </div>

      </div>
    </section>
  `
}

function logisticsSection() {
  return `
    <section class="section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">LOGISTIK</span>
            <h2>Material perlu diantar?</h2>
          </div>

          <a href="#/logistik" class="view-all">
            Lihat semua
            ${icon.arrow}
          </a>
        </div>

        <div class="visual-grid">
          ${logistics.map((item) => imageCard(item, 'logistics')).join('')}
        </div>

      </div>
    </section>
  `
}

function locationSection() {
  return `
    <section class="section location-section">
      <div class="section-container">

        <div class="location-banner">

          <div class="location-banner-copy">
            <span class="section-kicker">DI SEKITAR ANDA</span>
            <h2>Cari material dan jasa berdasarkan lokasi.</h2>
            <p>
              Pilih lokasi proyek untuk menemukan penyedia,
              harga, stok, jasa dan pengiriman yang relevan.
            </p>

            <button class="primary-button" id="location-button">
              ${icon.location}
              Pilih lokasi
            </button>
          </div>

          <div class="location-map-visual">
            <div class="map-grid"></div>
            <div class="map-pin">${icon.location}</div>
            <span class="map-label label-one">Material</span>
            <span class="map-label label-two">Jasa</span>
            <span class="map-label label-three">Logistik</span>
          </div>

        </div>

      </div>
    </section>
  `
}

function providerSection() {
  return `
    <section class="section soft-section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">PENYEDIA</span>
            <h2>Temukan penyedia di sekitar proyek</h2>
          </div>

          <a href="#/penyedia" class="view-all">
            Semua penyedia
            ${icon.arrow}
          </a>
        </div>

        <div class="provider-grid">

          <a href="#/penyedia" class="provider-card">
            <div class="provider-avatar">SB</div>
            <div>
              <strong>Supplier Bangunan</strong>
              <span>${icon.star} 4.8 · Material</span>
              <small>Beragam kebutuhan proyek</small>
            </div>
          </a>

          <a href="#/penyedia" class="provider-card">
            <div class="provider-avatar">TM</div>
            <div>
              <strong>Toko Material</strong>
              <span>${icon.star} 4.7 · Material</span>
              <small>Harga dan stok diperbarui</small>
            </div>
          </a>

          <a href="#/penyedia" class="provider-card">
            <div class="provider-avatar">MJ</div>
            <div>
              <strong>Mitra Jasa</strong>
              <span>${icon.star} 4.9 · Jasa</span>
              <small>Tenaga proyek profesional</small>
            </div>
          </a>

          <a href="#/penyedia" class="provider-card">
            <div class="provider-avatar">ML</div>
            <div>
              <strong>Mitra Logistik</strong>
              <span>${icon.star} 4.8 · Logistik</span>
              <small>Kendaraan berbagai kapasitas</small>
            </div>
          </a>

        </div>

      </div>
    </section>
  `
}

function propertySection() {
  return `
    <section class="section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">PROPERTI</span>
            <h2>Cari properti untuk kebutuhan Anda</h2>
          </div>

          <a href="#/properti" class="view-all">
            Lihat properti
            ${icon.arrow}
          </a>
        </div>

        <div class="property-grid">
          ${properties
            .map(
              (item) => `
                <a href="#/properti" class="property-card">
                  <img src="${item.image}" alt="${item.title}" loading="lazy">
                  <div>
                    <span>PROPERTI</span>
                    <h3>${item.title}</h3>
                    <strong>Lihat pilihan</strong>
                  </div>
                </a>
              `,
            )
            .join('')}
        </div>

      </div>
    </section>
  `
}

function projectSection() {
  return `
    <section class="section project-section">
      <div class="section-container">

        <div class="project-panel">

          <div class="project-panel-copy">
            <span class="section-kicker">DARI AWAL SAMPAI SELESAI</span>

            <h2>
              Satu proyek,
              banyak kebutuhan.
            </h2>

            <p>
              Cari material, tenaga kerja dan kendaraan pengiriman
              tanpa harus berpindah-pindah platform.
            </p>

            <div class="project-flow">
              <div>
                <b>01</b>
                <span>Material</span>
              </div>
              <div>
                <b>02</b>
                <span>Jasa</span>
              </div>
              <div>
                <b>03</b>
                <span>Logistik</span>
              </div>
              <div>
                <b>04</b>
                <span>Proyek</span>
              </div>
            </div>

            <a href="#/material" class="primary-button">
              Mulai mencari
              ${icon.arrow}
            </a>
          </div>

          <div class="project-panel-image">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85"
              alt="Proyek konstruksi"
              loading="lazy"
            >
          </div>

        </div>

      </div>
    </section>
  `
}

function articleSection() {
  return `
    <section class="section">
      <div class="section-container">

        <div class="section-heading">
          <div>
            <span class="section-kicker">PANDUAN</span>
            <h2>Informasi untuk membantu proyek Anda</h2>
          </div>

          <a href="#/blog" class="view-all">
            Baca semua
            ${icon.arrow}
          </a>
        </div>

        <div class="article-grid">
          ${articles
            .map(
              (article) => `
                <a href="#/blog" class="article-card">
                  <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                  </div>
                  <div class="article-content">
                    <span>${article.category}</span>
                    <h3>${article.title}</h3>
                    <strong>Baca selengkapnya ${icon.arrow}</strong>
                  </div>
                </a>
              `,
            )
            .join('')}
        </div>

      </div>
    </section>
  `
}

function benefitSection() {
  const benefits = [
    {
      title: 'Bandingkan harga',
      text: 'Lihat beberapa penawaran sebelum memutuskan membeli.',
    },
    {
      title: 'Cari penyedia',
      text: 'Temukan toko, supplier, jasa dan logistik sesuai lokasi.',
    },
    {
      title: 'Cek ketersediaan',
      text: 'Informasi stok membantu Anda merencanakan pembelian.',
    },
    {
      title: 'Atur pengiriman',
      text: 'Pilih kebutuhan kendaraan dan pengiriman proyek.',
    },
  ]

  return `
    <section class="benefit-section">
      <div class="section-container">

        <div class="section-heading centered">
          <span class="section-kicker">KENAPA BAGUS?</span>
          <h2>Belanja kebutuhan proyek dengan cara yang lebih praktis.</h2>
        </div>

        <div class="benefit-grid">
          ${benefits
            .map(
              (item, index) => `
                <div class="benefit-item">
                  <span class="benefit-number">0${index + 1}</span>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </div>
              `,
            )
            .join('')}
        </div>

      </div>
    </section>
  `
}

function appSection() {
  return `
    <section class="section">
      <div class="section-container">

        <div class="app-card">

          <div class="app-copy">
            <span class="section-kicker">COMING SOON</span>

            <h2>
              Kebutuhan proyek,
              nanti cukup dari HP.
            </h2>

            <p>
              Bagus Load & Delivery sedang disiapkan untuk
              pengalaman mobile yang lebih cepat dan praktis.
            </p>

            <div class="app-buttons">
              <span class="store-button">
                <small>COMING SOON ON</small>
                <strong>App Store</strong>
              </span>

              <span class="store-button">
                <small>COMING SOON ON</small>
                <strong>Google Play</strong>
              </span>
            </div>
          </div>

          <div class="phone-preview">
            <div class="phone-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen">
                <div class="phone-logo">B</div>
                <div class="phone-search"></div>
                <div class="phone-row"></div>
                <div class="phone-row short"></div>
                <div class="phone-products">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `
}

function footer() {
  return `
    <footer class="site-footer">

      <div class="footer-main">
        <div class="footer-container">

          <div class="footer-brand">
            <a href="#/" class="brand footer-logo">
              <span class="brand-mark">B</span>
              <span class="brand-copy">
                <strong>BAGUS</strong>
                <small>LOAD & DELIVERY</small>
              </span>
            </a>

            <p>
              Platform kebutuhan proyek untuk membantu mencari
              material, jasa, logistik dan properti dari satu tempat.
            </p>

            <div class="footer-social">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="YouTube">YT</a>
              <a href="#" aria-label="TikTok">TK</a>
            </div>
          </div>

          <div class="footer-column">
            <h3>Belanja</h3>
            <a href="#/material">Material</a>
            <a href="#/material/besi-baja">Besi & Baja</a>
            <a href="#/material/semen-beton">Semen & Beton</a>
            <a href="#/material/kayu">Kayu</a>
            <a href="#/promo">Promo</a>
          </div>

          <div class="footer-column">
            <h3>Jasa</h3>
            <a href="#/jasa">Semua Jasa</a>
            <a href="#/jasa/tukang">Tukang</a>
            <a href="#/jasa/listrik">Listrik</a>
            <a href="#/jasa/plumbing">Plumbing</a>
            <a href="#/jasa/renovasi">Renovasi</a>
          </div>

          <div class="footer-column">
            <h3>Logistik</h3>
            <a href="#/logistik">Semua Logistik</a>
            <a href="#/logistik/pickup">Pickup</a>
            <a href="#/logistik/l300">L300</a>
            <a href="#/logistik/truck">Truck</a>
            <a href="#/logistik/bongkar-muat">Bongkar Muat</a>
          </div>

          <div class="footer-column">
            <h3>Properti</h3>
            <a href="#/properti">Semua Properti</a>
            <a href="#/properti/dijual">Dijual</a>
            <a href="#/properti/disewa">Disewa</a>
            <a href="#/properti/dijual/rumah">Rumah</a>
            <a href="#/properti/dijual/tanah">Tanah</a>
          </div>

          <div class="footer-column">
            <h3>Bantuan</h3>
            <a href="#/help">Pusat Bantuan</a>
            <a href="#/faq">FAQ</a>
            <a href="#/blog">Panduan Proyek</a>
            <a href="#/provider">Untuk Penyedia</a>
            <a href="#/contact">Hubungi Kami</a>
          </div>

        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-container footer-bottom-inner">

          <div>
            <strong>© 2026 Bagus Load & Delivery</strong>
            <span>Platform kebutuhan proyek Indonesia</span>
          </div>

          <div class="footer-bottom-links">
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Bahasa Indonesia</a>
          </div>

        </div>
      </div>

    </footer>
  `
}

function mobileBottomNav() {
  return `
    <nav class="mobile-bottom-nav">

      <a href="#/" class="active">
        <span>${icon.app}</span>
        <small>Beranda</small>
      </a>

      <a href="#/material">
        <span>${icon.menu}</span>
        <small>Kategori</small>
      </a>

      <a href="#/orders">
        <span>${icon.check}</span>
        <small>Pesanan</small>
      </a>

      <a href="#/login">
        <span>${icon.user}</span>
        <small>Akun</small>
      </a>

    </nav>
  `
}

function homePage() {
  return `
    ${header()}

    <main>

      ${hero()}

      ${categorySection()}

      ${promoSection()}

      ${productSection()}

      ${serviceSection()}

      ${logisticsSection()}

      ${locationSection()}

      ${providerSection()}

      ${propertySection()}

      ${projectSection()}

      ${articleSection()}

      ${benefitSection()}

      ${appSection()}

    </main>

    ${footer()}

    ${mobileBottomNav()}
  `
}


function bindHomeEvents() {
  ;[document.querySelector('#header-search'),document.querySelector('#hero-search')].forEach(form=>{
    if(!form)return
    form.addEventListener('submit',e=>{
      e.preventDefault()
      const q=form.querySelector('input')?.value?.trim()
      if(q) location.hash=`/search?q=${encodeURIComponent(q)}`
    })
  })
  document.querySelector('#location-trigger')?.addEventListener('click',showLocationModal)
}
function showLocationModal(){
 const old=document.querySelector('.location-modal-backdrop');if(old){old.remove();return}
 const modal=document.createElement('div');modal.className='location-modal-backdrop';modal.innerHTML=`<div class="location-modal"><button class="modal-close">×</button><span class="section-kicker">LOKASI PROYEK</span><h2>Pilih lokasi Anda</h2><p>Lokasi membantu menampilkan hasil yang lebih relevan.</p><label>Provinsi<select id="loc-province"><option value="">Pilih provinsi</option><option>Bali</option><option>Lampung</option><option>DKI Jakarta</option><option>Jawa Timur</option></select></label><label>Kota / Kabupaten<select id="loc-city"><option value="">Pilih kota</option><option>Denpasar</option><option>Badung</option><option>Gianyar</option><option>Tabanan</option></select></label><button class="primary-button modal-save">Simpan lokasi</button></div>`;
 document.body.appendChild(modal);modal.querySelector('.modal-close').onclick=()=>modal.remove();modal.querySelector('.modal-save').onclick=()=>{const c=modal.querySelector('#loc-city').value;localStorage.setItem('bld_location_v1',JSON.stringify({province:modal.querySelector('#loc-province').value,city:c}));document.querySelector('#location-trigger strong')?.replaceChildren(document.createTextNode(c||'Lokasi dipilih'));modal.remove()};modal.onclick=e=>{if(e.target===modal)modal.remove()}
}
function renderApp(){route(homePage);if(!location.hash||location.hash==='#/'||location.hash==='#')bindHomeEvents()}
window.addEventListener('hashchange',renderApp)
renderApp()
