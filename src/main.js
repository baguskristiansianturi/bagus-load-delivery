import './style.css'

const STORAGE_CART = 'bagusCart'
const STORAGE_ORDERS = 'bagusOrders'
const STORAGE_WISHLIST = 'bagusWishlist'
const STORAGE_USER = 'bagusUser'

const rupiah = value =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const write = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))

const suppliers = [
  {
    id: 'sb',
    name: 'Supplier Besi Bali',
    location: 'Denpasar',
    initials: 'SB',
    rating: 4.8,
    reviews: 126
  },
  {
    id: 'tb',
    name: 'Toko Bangunan Bali',
    location: 'Badung',
    initials: 'TB',
    rating: 4.7,
    reviews: 98
  },
  {
    id: 'km',
    name: 'Kayu & Material Bali',
    location: 'Denpasar',
    initials: 'KM',
    rating: 4.8,
    reviews: 74
  }
]

const products = [
  {
    id: 'besi-10mm',
    name: 'Besi Beton 10 mm SNI',
    category: 'Besi & Baja',
    price: 89000,
    originalPrice: 99000,
    unit: 'batang',
    stock: 180,
    supplierId: 'sb',
    rating: 4.9,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    description:
      'Besi beton untuk kebutuhan struktur bangunan, proyek rumah, renovasi dan pekerjaan konstruksi.',
    specs: [
      ['Diameter', '10 mm'],
      ['Panjang', '12 meter'],
      ['Standar', 'SNI'],
      ['Satuan', 'Batang']
    ]
  },
  {
    id: 'besi-12mm',
    name: 'Besi Beton 12 mm SNI',
    category: 'Besi & Baja',
    price: 128000,
    originalPrice: 139000,
    unit: 'batang',
    stock: 120,
    supplierId: 'sb',
    rating: 4.8,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=900&q=80',
    description:
      'Besi beton diameter 12 mm untuk struktur beton bertulang dan kebutuhan proyek konstruksi.',
    specs: [
      ['Diameter', '12 mm'],
      ['Panjang', '12 meter'],
      ['Standar', 'SNI'],
      ['Satuan', 'Batang']
    ]
  },
  {
    id: 'semen',
    name: 'Semen Portland 50 kg',
    category: 'Semen',
    price: 76000,
    originalPrice: 80000,
    unit: 'sak',
    stock: 240,
    supplierId: 'tb',
    rating: 4.8,
    reviews: 61,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
    description:
      'Semen untuk pekerjaan struktur, pasangan, plesteran dan berbagai kebutuhan konstruksi.',
    specs: [
      ['Berat', '50 kg'],
      ['Jenis', 'Portland'],
      ['Kemasan', 'Sak'],
      ['Kondisi', 'Baru']
    ]
  },
  {
    id: 'triplek',
    name: 'Triplek 9 mm 122 x 244 cm',
    category: 'Kayu & Triplek',
    price: 145000,
    originalPrice: 159000,
    unit: 'lembar',
    stock: 75,
    supplierId: 'km',
    rating: 4.7,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
    description:
      'Triplek ukuran standar untuk bekisting, furniture dan berbagai pekerjaan interior.',
    specs: [
      ['Tebal', '9 mm'],
      ['Ukuran', '122 x 244 cm'],
      ['Satuan', 'Lembar'],
      ['Kondisi', 'Baru']
    ]
  },
  {
    id: 'kayu-usuk',
    name: 'Kayu Usuk 4 x 6 cm',
    category: 'Kayu & Triplek',
    price: 42000,
    originalPrice: 46000,
    unit: 'batang',
    stock: 110,
    supplierId: 'km',
    rating: 4.7,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=900&q=80',
    description:
      'Kayu usuk untuk rangka atap dan pekerjaan konstruksi ringan.',
    specs: [
      ['Ukuran', '4 x 6 cm'],
      ['Panjang', '4 meter'],
      ['Satuan', 'Batang'],
      ['Kondisi', 'Baru']
    ]
  },
  {
    id: 'paku',
    name: 'Paku Bangunan 5 cm',
    category: 'Paku & Hardware',
    price: 18000,
    unit: 'kg',
    stock: 320,
    supplierId: 'tb',
    rating: 4.6,
    reviews: 33,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80',
    description:
      'Paku bangunan untuk kebutuhan konstruksi dan pekerjaan kayu.',
    specs: [
      ['Panjang', '5 cm'],
      ['Satuan', 'Kilogram'],
      ['Material', 'Baja'],
      ['Kondisi', 'Baru']
    ]
  },
  {
    id: 'kawat',
    name: 'Kawat Bendrat 1 kg',
    category: 'Besi & Baja',
    price: 21000,
    unit: 'kg',
    stock: 140,
    supplierId: 'sb',
    rating: 4.7,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80',
    description:
      'Kawat bendrat untuk pengikatan tulangan beton dan pekerjaan konstruksi.',
    specs: [
      ['Berat', '1 kg'],
      ['Material', 'Baja'],
      ['Satuan', 'Kg'],
      ['Kondisi', 'Baru']
    ]
  },
  {
    id: 'batako',
    name: 'Batako Press',
    category: 'Material Dinding',
    price: 3200,
    originalPrice: 3500,
    unit: 'pcs',
    stock: 1500,
    supplierId: 'tb',
    rating: 4.6,
    reviews: 17,
    image: 'https://images.unsplash.com/photo-1590644365607-1c5a1f8f7f13?auto=format&fit=crop&w=900&q=80',
    description:
      'Batako press untuk pasangan dinding rumah, gudang dan bangunan lainnya.',
    specs: [
      ['Jenis', 'Press'],
      ['Satuan', 'Pcs'],
      ['Kondisi', 'Baru'],
      ['Minimum', '50 pcs']
    ]
  }
]

const categories = [
  'Semua',
  'Besi & Baja',
  'Semen',
  'Kayu & Triplek',
  'Material Dinding',
  'Paku & Hardware',
  'Atap',
  'Pipa',
  'Listrik'
]

const icons = {
  search: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M16 16l5 5"/>
    </svg>
  `,
  cart: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l2.2 11h10.5l2-8H6"/>
      <circle cx="9" cy="20" r="1"/>
      <circle cx="18" cy="20" r="1"/>
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 8.7c0 5-8.8 10.1-8.8 10.1S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>
    </svg>
  `,
  user: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5"/>
      <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"/>
    </svg>
  `,
  arrow: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13"/>
      <path d="m13 6 6 6-6 6"/>
    </svg>
  `,
  truck: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h11v10H3z"/>
      <path d="M14 10h4l3 3v3h-7z"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="18" cy="18" r="2"/>
    </svg>
  `,
  box: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 7 8-4 8 4-8 4-8-4Z"/>
      <path d="M4 7v10l8 4 8-4V7"/>
      <path d="M12 11v10"/>
    </svg>
  `,
  calendar: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2"/>
      <path d="M8 3v4M16 3v4M4 10h16"/>
    </svg>
  `,
  chat: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 20l1.5-3A7.5 7.5 0 1 1 20 11.5Z"/>
    </svg>
  `,
  close: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18"/>
    </svg>
  `,
  check: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6"/>
    </svg>
  `,
  location: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>
  `
}

function supplierById(id) {
  return suppliers.find(item => item.id === id)
}

function discountPercent(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )
}

function discountLabel(product) {
  const value = discountPercent(product)
  return value
    ? `<span class="discount-label">DISKON ${value}%</span>`
    : ''
}

function isWishlisted(id) {
  return read(STORAGE_WISHLIST, []).includes(id)
}

function productCard(product, compact = false) {
  const supplier = supplierById(product.supplierId)
  const wish = isWishlisted(product.id)

  if (compact) {
    return `
      <article class="compact-product">
        <a href="#/product/${product.id}" class="compact-image">
          ${discountLabel(product)}
          <img src="${product.image}" alt="${product.name}">
        </a>

        <div class="compact-content">
          <a href="#/product/${product.id}" class="compact-title">
            ${product.name}
          </a>

          <div class="compact-price">${rupiah(product.price)}</div>

          ${
            product.originalPrice
              ? `<div class="compact-old">${rupiah(product.originalPrice)}</div>`
              : ''
          }

          <div class="compact-meta">
            <span>★ ${product.rating}</span>
            <span>${supplier.location}</span>
          </div>

          <button
            class="compact-heart ${wish ? 'active' : ''}"
            data-wishlist="${product.id}"
            aria-label="Wishlist"
          >
            ${icons.heart}
          </button>
        </div>
      </article>
    `
  }

  return `
    <article class="product-card">
      <a href="#/product/${product.id}" class="product-image-wrap">
        ${discountLabel(product)}

        <button
          class="wishlist-button ${wish ? 'active' : ''}"
          data-wishlist="${product.id}"
          aria-label="Wishlist"
        >
          ${icons.heart}
        </button>

        <img class="product-image" src="${product.image}" alt="${product.name}">
      </a>

      <div class="product-info">
        <div class="product-category">${product.category}</div>

        <a href="#/product/${product.id}" class="product-title">
          ${product.name}
        </a>

        <div class="product-price">${rupiah(product.price)}</div>

        ${
          product.originalPrice
            ? `<div class="product-old-price">${rupiah(product.originalPrice)}</div>`
            : ''
        }

        <div class="product-bottom">
          <span>★ ${product.rating}</span>
          <span>${product.stock} stok</span>
        </div>

        <div class="product-supplier">
          ${supplier.name}
        </div>

        <button class="add-cart" data-add-cart="${product.id}">
          + Keranjang
        </button>
      </div>
    </article>
  `
}

function adSidebar() {
  return `
    <aside class="ad-sidebar">

      <a class="ad-card" href="#/booking">
        <div class="ad-visual ad-heavy">
          <span class="ad-badge">PROMO</span>

          <svg viewBox="0 0 240 130" aria-hidden="true">
            <rect x="20" y="65" width="145" height="35" rx="4"/>
            <rect x="165" y="72" width="45" height="28" rx="3"/>
            <path d="M45 65 65 35h60l20 30"/>
            <circle cx="55" cy="105" r="12"/>
            <circle cx="185" cy="105" r="12"/>
            <path d="M145 35 175 18h30"/>
            <path d="m175 18 15-10"/>
          </svg>
        </div>

        <div class="ad-body">
          <small>ALAT BERAT</small>
          <strong>Sewa Alat Berat Bali</strong>
          <p>Temukan alat berat untuk kebutuhan proyek Anda.</p>
          <span>Lihat selengkapnya ${icons.arrow}</span>
        </div>
      </a>

      <a class="ad-card" href="#/booking">
        <div class="ad-visual ad-truck">
          <span class="ad-badge">PARTNER</span>

          <svg viewBox="0 0 240 130" aria-hidden="true">
            <rect x="25" y="55" width="135" height="45" rx="5"/>
            <path d="M160 70h35l20 18v12h-55z"/>
            <circle cx="60" cy="105" r="13"/>
            <circle cx="190" cy="105" r="13"/>
            <path d="M38 55V40h107v15"/>
            <path d="M48 40V27h87v13"/>
          </svg>
        </div>

        <div class="ad-body">
          <small>BAGUS LOADING</small>
          <strong>Jasa Angkutan & Muatan</strong>
          <p>Truck, pickup, bongkar muat dan pengiriman proyek.</p>
          <span>Lihat layanan ${icons.arrow}</span>
        </div>
      </a>

      <a class="ad-card" href="#/products">
        <div class="ad-visual ad-business">
          <span class="ad-badge">PARTNER</span>

          <svg viewBox="0 0 240 130" aria-hidden="true">
            <path d="m30 100 25-50h40l25 50Z"/>
            <path d="m55 50 20-25 20 25"/>
            <path d="m120 100 25-40h40l25 40Z"/>
            <path d="m145 60 20-22 20 22"/>
            <path d="M58 72h34M151 80h34"/>
          </svg>
        </div>

        <div class="ad-body">
          <small>MITRA BISNIS</small>
          <strong>Produk & Jasa Proyek</strong>
          <p>Ruang promosi untuk produk dan layanan partner.</p>
          <span>Jelajahi ${icons.arrow}</span>
        </div>
      </a>

    </aside>
  `
}

function header() {
  const cart = read(STORAGE_CART, [])
  const user = read(STORAGE_USER, null)

  return `
    <header class="site-header">
      <div class="header-inner">

        <a class="brand" href="#/">
          <span class="brand-mark">BL</span>
          <span>
            <strong>Bagus</strong>
            <small>Load & Delivery</small>
          </span>
        </a>

        <form class="header-search" id="global-search">
          <span>${icons.search}</span>
          <input
            id="search-input"
            type="search"
            placeholder="Cari material, supplier, atau kebutuhan proyek..."
          >
          <button type="submit">Cari</button>
        </form>

        <nav class="desktop-nav">
          <a href="#/products">Material</a>
          <a href="#/booking">Pengiriman</a>
          <a href="#/chat">Chat</a>
          <a href="#/wishlist" class="nav-icon">
            ${icons.heart}
            <span>Wishlist</span>
          </a>
          <a href="#/cart" class="nav-icon cart-nav">
            ${icons.cart}
            <span>Keranjang</span>
            ${cart.length ? `<b>${cart.length}</b>` : ''}
          </a>
          <a href="#/login" class="nav-icon">
            ${icons.user}
            <span>${user ? 'Akun' : 'Masuk'}</span>
          </a>
        </nav>

      </div>
    </header>
  `
}

function categoryBar(active = 'Semua') {
  return `
    <div class="category-wrap">
      <div class="category-inner">
        ${categories.map(category => `
          <a
            href="${category === 'Semua' ? '#/' : `#/products?category=${encodeURIComponent(category)}`}"
            class="category-item ${active === category ? 'active' : ''}"
          >
            ${category}
          </a>
        `).join('')}
      </div>
    </div>
  `
}

function sectionTitle(title, subtitle = '', link = '#/products') {
  return `
    <div class="section-heading">
      <div>
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
      <a href="${link}">Lihat semua ${icons.arrow}</a>
    </div>
  `
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">

        <div>
          <div class="footer-brand">Bagus Load & Delivery</div>
          <p>
            Marketplace material dan layanan logistik untuk kebutuhan proyek.
          </p>
        </div>

        <div>
          <strong>Marketplace</strong>
          <a href="#/products">Semua Material</a>
          <a href="#/wishlist">Wishlist</a>
          <a href="#/cart">Keranjang</a>
        </div>

        <div>
          <strong>Layanan</strong>
          <a href="#/booking">Pengiriman</a>
          <a href="#/chat">Chat</a>
          <a href="#/orders">Pesanan</a>
        </div>

        <div>
          <strong>Bagus Load & Delivery</strong>
          <p>Bali • Indonesia</p>
        </div>

      </div>

      <div class="footer-bottom">
        © ${new Date().getFullYear()} Bagus Load & Delivery
      </div>
    </footer>
  `
}

function mobileNav() {
  const cart = read(STORAGE_CART, [])

  return `
    <nav class="mobile-bottom-nav">

      <a href="#/chat">
        ${icons.chat}
        <span>Chat</span>
      </a>

      <a href="#/wishlist">
        ${icons.heart}
        <span>Wishlist</span>
      </a>

      <a href="#/cart" class="mobile-cart">
        ${icons.cart}
        ${cart.length ? `<b>${cart.length}</b>` : ''}
        <span>Keranjang</span>
      </a>

      <a href="#/booking">
        ${icons.calendar}
        <span>Booking</span>
      </a>

    </nav>
  `
}

function homePage() {
  const featured = products.slice(0, 4)
  const popular = products.slice(2, 6)
  const recommendations = products.slice(4, 8)

  return `
    ${header()}

    <main>

      <section class="hero">
        <div class="hero-inner">

          <div class="hero-copy">
            <span class="hero-label">MATERIAL • LOGISTIK • PROYEK</span>
            <h1>Kebutuhan proyek,<br><em>lebih mudah ditemukan.</em></h1>
            <p>
              Cari material dari supplier, bandingkan harga,
              lalu atur pengiriman sesuai kebutuhan proyek Anda.
            </p>

            <div class="hero-actions">
              <a href="#/products" class="primary-button">
                Cari Material ${icons.arrow}
              </a>

              <a href="#/booking" class="secondary-button">
                Atur Pengiriman
              </a>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-panel">
              <span>PROJECT SUPPLY</span>
              <strong>Material sampai<br>ke lokasi proyek.</strong>

              <div class="hero-line"></div>

              <div class="hero-stat">
                <span>Supplier</span>
                <b>${suppliers.length}</b>
              </div>

              <div class="hero-stat">
                <span>Produk</span>
                <b>${products.length}+</b>
              </div>
            </div>
          </div>

        </div>
      </section>

      ${categoryBar()}

      <div class="market-layout">

        <div class="market-main">

          <section class="market-section">
            ${sectionTitle(
              'Pilihan Material',
              'Produk yang sedang banyak dicari untuk kebutuhan proyek.'
            )}

            <div class="product-grid">
              ${featured.map(product => productCard(product)).join('')}
            </div>
          </section>

          <section class="market-section">
            ${sectionTitle(
              'Produk Terlaris',
              'Material populer dari supplier di Bali.'
            )}

            <div class="product-grid">
              ${popular.map(product => productCard(product)).join('')}
            </div>
          </section>

          <section class="market-section">
            ${sectionTitle(
              'Rekomendasi Untuk Anda',
              'Pilihan material lain yang mungkin Anda perlukan.'
            )}

            <div class="compact-product-row">
              ${recommendations
                .map(product => productCard(product, true))
                .join('')}
            </div>
          </section>

          <section class="service-strip">
            <div>
              <span class="service-icon">${icons.truck}</span>
              <div>
                <strong>Pengiriman Proyek</strong>
                <p>Atur pengiriman sesuai volume dan kebutuhan.</p>
              </div>
            </div>

            <div>
              <span class="service-icon">${icons.box}</span>
              <div>
                <strong>Multi-Supplier</strong>
                <p>Belanja kebutuhan dari beberapa penyedia.</p>
              </div>
            </div>

            <div>
              <span class="service-icon">${icons.calendar}</span>
              <div>
                <strong>Pengiriman Terjadwal</strong>
                <p>Tentukan tanggal dan waktu pengiriman.</p>
              </div>
            </div>
          </section>

        </div>

        ${adSidebar()}

      </div>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function productListing() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '')
  const category = params.get('category')
  const query = params.get('q')

  let filtered = [...products]

  if (category) {
    filtered = filtered.filter(item => item.category === category)
  }

  if (query) {
    filtered = filtered.filter(item =>
      `${item.name} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  }

  return `
    ${header()}
    ${categoryBar(category || 'Semua')}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">MATERIAL</span>
          <h1>${category || 'Semua Produk'}</h1>
          <p>${filtered.length} produk tersedia</p>
        </div>

        <select class="sort-select">
          <option>Relevansi</option>
          <option>Harga terendah</option>
          <option>Harga tertinggi</option>
          <option>Rating tertinggi</option>
        </select>
      </div>

      <div class="market-layout">

        <div class="market-main">
          <div class="product-grid listing-grid">
            ${
              filtered.length
                ? filtered.map(product => productCard(product)).join('')
                : `
                  <div class="empty-state">
                    <h3>Produk tidak ditemukan</h3>
                    <p>Coba gunakan kata kunci atau kategori lain.</p>
                  </div>
                `
            }
          </div>
        </div>

        ${adSidebar()}

      </div>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function detailPage(id) {
  const product = products.find(item => item.id === id)

  if (!product) return notFound()

  const supplier = supplierById(product.supplierId)
  const related = products
    .filter(item => item.id !== product.id && item.category === product.category)
    .slice(0, 4)

  const similar = products
    .filter(item => item.id !== product.id && item.category !== product.category)
    .slice(0, 4)

  const providerProducts = products
    .filter(item => item.supplierId === product.supplierId && item.id !== product.id)
    .slice(0, 4)

  return `
    ${header()}

    <main class="detail-page">

      <div class="detail-breadcrumb">
        <a href="#/">Beranda</a>
        <span>/</span>
        <a href="#/products">${product.category}</a>
        <span>/</span>
        <strong>${product.name}</strong>
      </div>

      <section class="detail-top">

        <div class="detail-gallery">
          <div class="detail-image">
            ${discountLabel(product)}
            <button
              class="wishlist-button ${isWishlisted(product.id) ? 'active' : ''}"
              data-wishlist="${product.id}"
            >
              ${icons.heart}
            </button>
            <img src="${product.image}" alt="${product.name}">
          </div>
        </div>

        <div class="detail-summary">

          <span class="detail-category">${product.category}</span>

          <h1>${product.name}</h1>

          <div class="detail-rating">
            <strong>★ ${product.rating}</strong>
            <span>${product.reviews} ulasan</span>
            <span>•</span>
            <span>${product.stock} stok</span>
          </div>

          <div class="detail-price">
            ${rupiah(product.price)}
          </div>

          ${
            product.originalPrice
              ? `
                <div class="detail-old-price">
                  ${rupiah(product.originalPrice)}
                  <span>Hemat ${rupiah(product.originalPrice - product.price)}</span>
                </div>
              `
              : ''
          }

          <div class="detail-divider"></div>

          <div class="supplier-profile">
            <div class="supplier-avatar">${supplier.initials}</div>

            <div class="supplier-info">
              <strong>${supplier.name}</strong>
              <span>
                ★ ${supplier.rating} • ${supplier.reviews} ulasan
              </span>
              <small>${icons.location} ${supplier.location}</small>
            </div>

            <button class="outline-button">Lihat profil</button>
          </div>

          <div class="purchase-box">

            <label class="quantity-label">
              Jumlah
              <div class="quantity-control">
                <button data-qty-minus>-</button>
                <input id="detail-qty" value="1" min="1" type="number">
                <button data-qty-plus>+</button>
              </div>
              <span>${product.unit}</span>
            </label>

            <div class="detail-actions">
              <button class="secondary-button large" data-add-cart="${product.id}">
                ${icons.cart} Tambah ke Keranjang
              </button>

              <button class="primary-button large" data-buy-now="${product.id}">
                Beli Sekarang
              </button>
            </div>

          </div>

        </div>

      </section>

      <section class="detail-content">

        <div class="detail-main-column">

          <div class="detail-card">
            <div class="detail-card-title">Spesifikasi Produk</div>

            <div class="spec-grid">
              ${product.specs.map(item => `
                <div>
                  <span>${item[0]}</span>
                  <strong>${item[1]}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-card-title">Deskripsi Produk</div>

            <p class="description">
              ${product.description}
            </p>
          </div>

          <div class="detail-card">
            <div class="detail-card-title">
              Opsi Mendapatkan / Pengiriman
            </div>

            <div class="delivery-options">

              <label class="delivery-option">
                <input type="radio" name="delivery" checked>
                <div>
                  <strong>Ambil sendiri</strong>
                  <span>Gratis</span>
                  <small>Ambil langsung dari lokasi penyedia.</small>
                </div>
              </label>

              <label class="delivery-option">
                <input type="radio" name="delivery">
                <div>
                  <strong>Gratis ongkir dari toko</strong>
                  <span>Jika promo berlaku</span>
                  <small>Ketentuan mengikuti promo penyedia.</small>
                </div>
              </label>

              <label class="delivery-option">
                <input type="radio" name="delivery">
                <div>
                  <strong>Pengiriman by Bagus Loading</strong>
                  <span>Biaya dihitung saat checkout</span>
                  <small>L300, Carry, Engkel atau kendaraan sesuai volume.</small>
                </div>
              </label>

              <label class="delivery-option">
                <input type="radio" name="delivery">
                <div>
                  <strong>Pengiriman terjadwal</strong>
                  <span>Pilih tanggal & waktu</span>
                  <small>Jadwalkan pengiriman sesuai kebutuhan proyek.</small>
                </div>
              </label>

            </div>
          </div>

          <div class="detail-card">
            <div class="detail-card-title">Metode Pembayaran</div>

            <div class="payment-grid">
              <label><input type="radio" name="payment" checked> COD</label>
              <label><input type="radio" name="payment"> Transfer Bank</label>
              <label><input type="radio" name="payment"> QRIS</label>
              <label><input type="radio" name="payment"> OVO</label>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-card-title">
              Ulasan Pembeli
            </div>

            <div class="review-summary">
              <div>
                <strong>${product.rating}</strong>
                <span>★★★★★</span>
                <small>${product.reviews} ulasan</small>
              </div>

              <div class="review-bars">
                <span>5 <i style="width:92%"></i></span>
                <span>4 <i style="width:55%"></i></span>
                <span>3 <i style="width:20%"></i></span>
              </div>
            </div>

            <div class="review-item">
              <div class="review-avatar">AR</div>
              <div>
                <strong>Andi</strong>
                <span>★★★★★</span>
                <p>Barang sesuai pesanan dan prosesnya cepat.</p>
              </div>
            </div>

            <div class="review-item">
              <div class="review-avatar">DP</div>
              <div>
                <strong>Dimas</strong>
                <span>★★★★★</span>
                <p>Material bagus dan supplier responsif.</p>
              </div>
            </div>

          </div>

        </div>

        <aside class="detail-side">

          <div class="reputation-card">
            <span class="eyebrow">REPUTASI PENYEDIA</span>
            <div class="reputation-score">${supplier.rating}</div>
            <div class="stars">★★★★★</div>
            <p>${supplier.reviews} ulasan dari pembeli</p>

            <div class="reputation-line">
              <span>Respons chat</span>
              <strong>Baik</strong>
            </div>

            <div class="reputation-line">
              <span>Kesiapan produk</span>
              <strong>Baik</strong>
            </div>

            <div class="reputation-line">
              <span>Lokasi</span>
              <strong>${supplier.location}</strong>
            </div>
          </div>

          <div class="detail-note">
            <strong>Catatan</strong>
            <p>
              Harga dan ketersediaan dapat berubah.
              Informasi pengiriman akan dikonfirmasi pada tahap checkout.
            </p>
          </div>

        </aside>

      </section>

      ${
        providerProducts.length
          ? `
            <section class="discovery-section">
              ${sectionTitle(
                'Produk dari Penyedia Ini',
                supplier.name
              )}

              <div class="compact-product-row">
                ${providerProducts.map(item => productCard(item, true)).join('')}
              </div>
            </section>
          `
          : ''
      }

      ${
        related.length
          ? `
            <section class="discovery-section">
              ${sectionTitle(
                'Produk Serupa',
                'Pilihan lain dalam kategori yang sama.'
              )}

              <div class="compact-product-row">
                ${related.map(item => productCard(item, true)).join('')}
              </div>
            </section>
          `
          : ''
      }

      <section class="discovery-section">
        ${sectionTitle(
          'Rekomendasi Untuk Anda',
          'Material lain untuk melengkapi kebutuhan proyek.'
        )}

        <div class="compact-product-row">
          ${similar.map(item => productCard(item, true)).join('')}
        </div>
      </section>

    </main>

    <div class="detail-sticky">
      <button class="secondary-button" data-add-cart="${product.id}">
        ${icons.cart} + Keranjang
      </button>

      <button class="primary-button" data-buy-now="${product.id}">
        Beli Sekarang
      </button>
    </div>

    ${footer()}
    ${mobileNav()}
  `
}

function cartPage() {
  const cart = read(STORAGE_CART, [])

  const items = cart
    .map(row => ({
      ...row,
      product: products.find(product => product.id === row.id)
    }))
    .filter(row => row.product)

  const total = items.reduce(
    (sum, row) => sum + row.product.price * row.qty,
    0
  )

  return `
    ${header()}

    <main class="page-main cart-page">

      <div class="page-heading">
        <div>
          <span class="eyebrow">BELANJA</span>
          <h1>Keranjang</h1>
          <p>${items.length} produk</p>
        </div>
      </div>

      ${
        items.length
          ? `
            <div class="cart-layout">

              <div class="cart-items">

                ${items.map(row => `
                  <article class="cart-item">

                    <img src="${row.product.image}" alt="${row.product.name}">

                    <div class="cart-item-main">
                      <a href="#/product/${row.product.id}">
                        ${row.product.name}
                      </a>

                      <small>${supplierById(row.product.supplierId).name}</small>

                      <strong>${rupiah(row.product.price)}</strong>

                      <div class="cart-qty">
                        <button data-cart-minus="${row.id}">−</button>
                        <span>${row.qty}</span>
                        <button data-cart-plus="${row.id}">+</button>
                      </div>
                    </div>

                    <button
                      class="remove-button"
                      data-cart-remove="${row.id}"
                    >
                      ${icons.close}
                    </button>

                  </article>
                `).join('')}

              </div>

              <aside class="summary-card">
                <h2>Ringkasan</h2>

                <div>
                  <span>Total produk</span>
                  <strong>${rupiah(total)}</strong>
                </div>

                <div>
                  <span>Pengiriman</span>
                  <strong>Diatur saat checkout</strong>
                </div>

                <div class="summary-total">
                  <span>Total</span>
                  <strong>${rupiah(total)}</strong>
                </div>

                <a href="#/checkout" class="primary-button full">
                  Lanjut Checkout
                </a>
              </aside>

            </div>
          `
          : `
            <div class="empty-state large">
              <div class="empty-icon">${icons.cart}</div>
              <h2>Keranjang masih kosong</h2>
              <p>Pilih material yang Anda perlukan untuk proyek.</p>
              <a href="#/products" class="primary-button">
                Cari Material
              </a>
            </div>
          `
      }

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function checkoutPage() {
  const cart = read(STORAGE_CART, [])

  const items = cart
    .map(row => ({
      ...row,
      product: products.find(product => product.id === row.id)
    }))
    .filter(row => row.product)

  const total = items.reduce(
    (sum, row) => sum + row.product.price * row.qty,
    0
  )

  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">CHECKOUT</span>
          <h1>Konfirmasi Pesanan</h1>
          <p>Periksa kebutuhan sebelum membuat pesanan.</p>
        </div>
      </div>

      <div class="checkout-layout">

        <div>

          <section class="form-card">
            <h2>Lokasi Proyek</h2>

            <label>
              Nama penerima
              <input id="checkout-name" placeholder="Nama lengkap">
            </label>

            <label>
              Nomor WhatsApp
              <input id="checkout-phone" placeholder="08xxxxxxxxxx">
            </label>

            <label>
              Alamat proyek
              <textarea id="checkout-address" rows="4" placeholder="Alamat lengkap lokasi proyek"></textarea>
            </label>
          </section>

          <section class="form-card">
            <h2>Pengiriman</h2>

            <label class="choice-card">
              <input type="radio" name="checkout-delivery" checked>
              <span>
                <strong>Pengiriman by Bagus Loading</strong>
                <small>Biaya akan disesuaikan dengan volume dan lokasi.</small>
              </span>
            </label>

            <label class="choice-card">
              <input type="radio" name="checkout-delivery">
              <span>
                <strong>Ambil sendiri</strong>
                <small>Gratis.</small>
              </span>
            </label>

            <label class="choice-card">
              <input type="radio" name="checkout-delivery">
              <span>
                <strong>Pengiriman terjadwal</strong>
                <small>Tanggal dan waktu akan dikonfirmasi.</small>
              </span>
            </label>
          </section>

          <section class="form-card">
            <h2>Pembayaran</h2>

            <div class="payment-grid">
              <label><input type="radio" name="checkout-payment" checked> COD</label>
              <label><input type="radio" name="checkout-payment"> Transfer Bank</label>
              <label><input type="radio" name="checkout-payment"> QRIS</label>
              <label><input type="radio" name="checkout-payment"> OVO</label>
            </div>
          </section>

        </div>

        <aside class="summary-card checkout-summary">
          <h2>Pesanan</h2>

          ${items.map(row => `
            <div class="summary-product">
              <span>${row.product.name} × ${row.qty}</span>
              <strong>${rupiah(row.product.price * row.qty)}</strong>
            </div>
          `).join('')}

          <div class="summary-total">
            <span>Total material</span>
            <strong>${rupiah(total)}</strong>
          </div>

          <p class="checkout-note">
            Biaya pengiriman akan dikonfirmasi setelah detail lokasi dan
            volume pesanan diperiksa.
          </p>

          <button class="primary-button full" id="place-order">
            Buat Pesanan
          </button>
        </aside>

      </div>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function wishlistPage() {
  const ids = read(STORAGE_WISHLIST, [])
  const items = products.filter(product => ids.includes(product.id))

  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">SIMPANAN</span>
          <h1>Wishlist</h1>
          <p>Produk yang Anda simpan.</p>
        </div>
      </div>

      ${
        items.length
          ? `
            <div class="product-grid">
              ${items.map(product => productCard(product)).join('')}
            </div>
          `
          : `
            <div class="empty-state large">
              <div class="empty-icon">${icons.heart}</div>
              <h2>Belum ada wishlist</h2>
              <p>Simpan produk untuk melihatnya kembali nanti.</p>
              <a href="#/products" class="primary-button">
                Cari Material
              </a>
            </div>
          `
      }

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function loginPage() {
  return `
    <main class="access-page">

      <div class="access-card">

        <a href="#/" class="access-brand">
          <span class="brand-mark">BL</span>
          <strong>Bagus Load & Delivery</strong>
        </a>

        <h1>Masuk</h1>
        <p>Masuk untuk melanjutkan pesanan dan menyimpan produk.</p>

        <label>
          Nomor WhatsApp
          <input id="login-phone" placeholder="08xxxxxxxxxx">
        </label>

        <label>
          Nama
          <input id="login-name" placeholder="Nama Anda">
        </label>

        <button class="primary-button full" id="login-submit">
          Masuk
        </button>

        <a href="#/" class="back-home">Kembali ke beranda</a>

      </div>

    </main>
  `
}

function chatPage() {
  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">KOMUNIKASI</span>
          <h1>Chat</h1>
          <p>Komunikasikan kebutuhan Anda dengan penyedia.</p>
        </div>
      </div>

      <section class="chat-shell">

        <div class="chat-list">
          ${suppliers.map(supplier => `
            <button class="chat-contact">
              <span>${supplier.initials}</span>
              <div>
                <strong>${supplier.name}</strong>
                <small>Siap membantu kebutuhan material.</small>
              </div>
            </button>
          `).join('')}
        </div>

        <div class="chat-empty">
          ${icons.chat}
          <h2>Pilih penyedia</h2>
          <p>Pilih supplier untuk memulai percakapan.</p>
        </div>

      </section>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function bookingPage() {
  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">LOGISTIK</span>
          <h1>Booking Pengiriman</h1>
          <p>Atur kebutuhan pengiriman material proyek.</p>
        </div>
      </div>

      <div class="booking-layout">

        <section class="form-card">

          <h2>Detail Pengiriman</h2>

          <label>
            Jenis kendaraan
            <select id="booking-vehicle">
              <option>Pickup / Carry</option>
              <option>L300</option>
              <option>Engkel</option>
              <option>Kendaraan sesuai volume</option>
            </select>
          </label>

          <label>
            Lokasi pickup
            <input placeholder="Lokasi supplier">
          </label>

          <label>
            Lokasi tujuan
            <input placeholder="Lokasi proyek">
          </label>

          <label>
            Tanggal
            <input type="date">
          </label>

          <label>
            Catatan
            <textarea rows="4" placeholder="Volume material, akses jalan, kebutuhan bongkar muat, dan lainnya."></textarea>
          </label>

          <button class="primary-button full" id="booking-submit">
            Ajukan Pengiriman
          </button>

        </section>

        <aside class="booking-info">

          <div class="info-card">
            ${icons.truck}
            <strong>Kendaraan menyesuaikan muatan</strong>
            <p>Jenis kendaraan ditentukan berdasarkan kebutuhan dan volume.</p>
          </div>

          <div class="info-card">
            ${icons.calendar}
            <strong>Bisa dijadwalkan</strong>
            <p>Tentukan waktu pengiriman sesuai kebutuhan proyek.</p>
          </div>

        </aside>

      </div>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function ordersPage() {
  const orders = read(STORAGE_ORDERS, [])

  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">TRANSAKSI</span>
          <h1>Pesanan Saya</h1>
          <p>Riwayat dan status pesanan Anda.</p>
        </div>
      </div>

      ${
        orders.length
          ? `
            <div class="orders-list">
              ${orders.map(order => `
                <a href="#/orders/${order.id}" class="order-card">

                  <div class="order-head">
                    <strong>${order.id}</strong>
                    <span>${order.status}</span>
                  </div>

                  <div class="order-body">
                    <div>
                      ${order.items.length} produk
                    </div>
                    <strong>${rupiah(order.total)}</strong>
                  </div>

                  <small>${order.date}</small>

                </a>
              `).join('')}
            </div>
          `
          : `
            <div class="empty-state large">
              <div class="empty-icon">${icons.box}</div>
              <h2>Belum ada pesanan</h2>
              <p>Pesanan Anda akan muncul di halaman ini.</p>
              <a href="#/products" class="primary-button">
                Mulai Belanja
              </a>
            </div>
          `
      }

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function orderDetailPage(id) {
  const orders = read(STORAGE_ORDERS, [])
  const order = orders.find(item => item.id === id)

  if (!order) return notFound()

  const steps = [
    'Supplier Confirmed',
    'In Transit',
    'Received at Hub',
    'Ready for Delivery',
    'Out for Delivery',
    'Delivered'
  ]

  const current = steps.indexOf(order.status)

  return `
    ${header()}

    <main class="page-main">

      <div class="page-heading">
        <div>
          <span class="eyebrow">TRACKING</span>
          <h1>${order.id}</h1>
          <p>Status pengiriman pesanan.</p>
        </div>
      </div>

      <section class="tracking-card">

        <div class="tracking-line"></div>

        ${steps.map((step, index) => `
          <div class="tracking-step ${index <= current ? 'done' : ''}">
            <span>
              ${index <= current ? icons.check : ''}
            </span>
            <strong>${step}</strong>
            ${
              index === current
                ? `<small>Status saat ini</small>`
                : ''
            }
          </div>
        `).join('')}

      </section>

      <section class="order-detail-grid">

        <div class="form-card">
          <h2>Produk</h2>

          ${order.items.map(row => `
            <div class="order-product">
              <span>${row.name} × ${row.qty}</span>
              <strong>${rupiah(row.price * row.qty)}</strong>
            </div>
          `).join('')}
        </div>

        <aside class="summary-card">
          <h2>Ringkasan</h2>

          <div>
            <span>Status</span>
            <strong>${order.status}</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>${rupiah(order.total)}</strong>
          </div>

          <div>
            <span>Tujuan</span>
            <strong>${order.address || '-'}</strong>
          </div>
        </aside>

      </section>

    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function notFound() {
  return `
    ${header()}

    <main class="page-main">
      <div class="empty-state large">
        <h2>Halaman tidak ditemukan</h2>
        <p>Halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="primary-button">Kembali</a>
      </div>
    </main>

    ${footer()}
    ${mobileNav()}
  `
}

function addToCart(id, qty = 1) {
  const cart = read(STORAGE_CART, [])
  const found = cart.find(item => item.id === id)

  if (found) {
    found.qty += qty
  } else {
    cart.push({ id, qty })
  }

  write(STORAGE_CART, cart)
  showToast('Produk ditambahkan ke keranjang')
  render()
}

function toggleWishlist(id) {
  const list = read(STORAGE_WISHLIST, [])
  const index = list.indexOf(id)

  if (index >= 0) {
    list.splice(index, 1)
    showToast('Dihapus dari wishlist')
  } else {
    list.push(id)
    showToast('Disimpan ke wishlist')
  }

  write(STORAGE_WISHLIST, list)
  render()
}

function showToast(message) {
  const existing = document.querySelector('.toast')
  existing?.remove()

  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => toast.classList.add('show'), 20)

  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 200)
  }, 2200)
}

function buyNow(id) {
  const qty = Number(document.querySelector('#detail-qty')?.value || 1)

  write(STORAGE_CART, [{ id, qty }])
  location.hash = '#/checkout'
}

function placeOrder() {
  const cart = read(STORAGE_CART, [])

  if (!cart.length) {
    showToast('Keranjang masih kosong')
    return
  }

  const name = document.querySelector('#checkout-name')?.value.trim()
  const phone = document.querySelector('#checkout-phone')?.value.trim()
  const address = document.querySelector('#checkout-address')?.value.trim()

  if (!name || !phone || !address) {
    showToast('Lengkapi data lokasi proyek')
    return
  }

  const items = cart
    .map(row => {
      const product = products.find(item => item.id === row.id)
      return product
        ? {
            id: product.id,
            name: product.name,
            qty: row.qty,
            price: product.price
          }
        : null
    })
    .filter(Boolean)

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  const orders = read(STORAGE_ORDERS, [])

  const order = {
    id: `BLD-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleString('id-ID'),
    status: 'Supplier Confirmed',
    name,
    phone,
    address,
    items,
    total
  }

  orders.unshift(order)
  write(STORAGE_ORDERS, orders)
  write(STORAGE_CART, [])

  location.hash = `#/orders/${order.id}`
}

function bindEvents() {
  document.querySelectorAll('[data-add-cart]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()

      const id = button.dataset.addCart
      const qty = Number(
        document.querySelector('#detail-qty')?.value || 1
      )

      addToCart(id, qty)
    })
  })

  document.querySelectorAll('[data-buy-now]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      buyNow(button.dataset.buyNow)
    })
  })

  document.querySelectorAll('[data-wishlist]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      toggleWishlist(button.dataset.wishlist)
    })
  })

  const minus = document.querySelector('[data-qty-minus]')
  const plus = document.querySelector('[data-qty-plus]')
  const qtyInput = document.querySelector('#detail-qty')

  minus?.addEventListener('click', () => {
    const value = Math.max(1, Number(qtyInput.value) - 1)
    qtyInput.value = value
  })

  plus?.addEventListener('click', () => {
    qtyInput.value = Number(qtyInput.value) + 1
  })

  document.querySelector('#global-search')?.addEventListener(
    'submit',
    event => {
      event.preventDefault()

      const query =
        document.querySelector('#search-input')?.value.trim() || ''

      if (!query) {
        location.hash = '#/products'
        return
      }

      location.hash = `#/products?q=${encodeURIComponent(query)}`
    }
  )

  document.querySelectorAll('[data-cart-plus]').forEach(button => {
    button.addEventListener('click', () => {
      const cart = read(STORAGE_CART, [])
      const item = cart.find(row => row.id === button.dataset.cartPlus)

      if (item) item.qty++

      write(STORAGE_CART, cart)
      render()
    })
  })

  document.querySelectorAll('[data-cart-minus]').forEach(button => {
    button.addEventListener('click', () => {
      const cart = read(STORAGE_CART, [])
      const item = cart.find(row => row.id === button.dataset.cartMinus)

      if (item) item.qty = Math.max(1, item.qty - 1)

      write(STORAGE_CART, cart)
      render()
    })
  })

  document.querySelectorAll('[data-cart-remove]').forEach(button => {
    button.addEventListener('click', () => {
      const cart = read(STORAGE_CART, [])
        .filter(row => row.id !== button.dataset.cartRemove)

      write(STORAGE_CART, cart)
      render()
    })
  })

  document.querySelector('#place-order')?.addEventListener(
    'click',
    placeOrder
  )

  document.querySelector('#login-submit')?.addEventListener(
    'click',
    () => {
      const name = document.querySelector('#login-name')?.value.trim()
      const phone = document.querySelector('#login-phone')?.value.trim()

      if (!name || !phone) {
        showToast('Lengkapi nama dan nomor WhatsApp')
        return
      }

      write(STORAGE_USER, { name, phone })
      location.hash = '#/'
    }
  )

  document.querySelector('#booking-submit')?.addEventListener(
    'click',
    () => {
      showToast('Permintaan pengiriman berhasil dibuat')
    }
  )
}

function render() {
  const hash = location.hash || '#/'
  const path = hash.replace(/^#/, '').split('?')[0]
  const parts = path.split('/').filter(Boolean)

  let html

  if (!parts.length) {
    html = homePage()
  } else if (parts[0] === 'products') {
    html = productListing()
  } else if (parts[0] === 'product' && parts[1]) {
    html = detailPage(parts[1])
  } else if (parts[0] === 'wishlist') {
    html = wishlistPage()
  } else if (parts[0] === 'cart') {
    html = cartPage()
  } else if (parts[0] === 'checkout') {
    html = checkoutPage()
  } else if (parts[0] === 'login') {
    html = loginPage()
  } else if (parts[0] === 'chat') {
    html = chatPage()
  } else if (parts[0] === 'booking') {
    html = bookingPage()
  } else if (parts[0] === 'orders' && parts[1]) {
    html = orderDetailPage(parts[1])
  } else if (parts[0] === 'orders') {
    html = ordersPage()
  } else {
    html = notFound()
  }

  document.querySelector('#app').innerHTML = html
  window.scrollTo({ top: 0, behavior: 'auto' })
  bindEvents()
}

window.addEventListener('hashchange', render)
window.addEventListener('DOMContentLoaded', render)