import "./style.css";

/* =========================================================
   BAGUS LOAD & DELIVERY
   FRONTEND DEMO
========================================================= */

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_CART = "bagusCart";
const STORAGE_ORDERS = "bagusOrders";
const STORAGE_WISHLIST = "bagusWishlist";
const STORAGE_USER = "bagusUser";
const STORAGE_PENDING_ROUTE = "bagusPendingRoute";

/* =========================================================
   DEMO DATA
========================================================= */

const suppliers = [
  {
    id: 1,
    name: "Supplier Besi Bali",
    location: "Denpasar",
    initials: "SB",
  },
  {
    id: 2,
    name: "Toko Bangunan Bali",
    location: "Badung",
    initials: "TB",
  },
  {
    id: 3,
    name: "Kayu & Material Bali",
    location: "Denpasar",
    initials: "KM",
  },
];

const products = [
  {
    id: 1,
    name: "Besi Ulir 10 mm",
    price: 89000,
    unit: "batang",
    stock: 120,
    supplierId: 1,
    category: "Besi",
    icon: "🔩",
    description:
      "Besi ulir 10 mm untuk kebutuhan struktur dan pekerjaan konstruksi.",
  },
  {
    id: 2,
    name: "Besi Ulir 12 mm",
    price: 126000,
    unit: "batang",
    stock: 85,
    supplierId: 1,
    category: "Besi",
    icon: "🔩",
    description:
      "Besi ulir 12 mm untuk berbagai kebutuhan struktur bangunan.",
  },
  {
    id: 3,
    name: "Besi Ulir 16 mm",
    price: 218000,
    unit: "batang",
    stock: 60,
    supplierId: 1,
    category: "Besi",
    icon: "🔩",
    description:
      "Besi ulir 16 mm untuk pekerjaan konstruksi dengan kebutuhan diameter lebih besar.",
  },
  {
    id: 4,
    name: "Besi Polos 8 mm",
    price: 58000,
    unit: "batang",
    stock: 150,
    supplierId: 1,
    category: "Besi",
    icon: "🔧",
    description:
      "Besi polos 8 mm untuk kebutuhan konstruksi dan pekerjaan bangunan.",
  },
  {
    id: 5,
    name: "Semen 50 kg",
    price: 68000,
    unit: "zak",
    stock: 250,
    supplierId: 2,
    category: "Semen",
    icon: "🧱",
    description:
      "Semen 50 kg untuk kebutuhan pekerjaan struktur, pasangan dan finishing.",
  },
  {
    id: 6,
    name: "Kawat Bendrat",
    price: 28000,
    unit: "kg",
    stock: 180,
    supplierId: 2,
    category: "Lainnya",
    icon: "〰️",
    description:
      "Kawat bendrat untuk mengikat tulangan dan kebutuhan konstruksi.",
  },
  {
    id: 7,
    name: "Triplek 12 mm",
    price: 185000,
    unit: "lembar",
    stock: 48,
    supplierId: 3,
    category: "Kayu",
    icon: "📐",
    description:
      "Triplek 12 mm untuk bekisting, interior dan berbagai kebutuhan proyek.",
  },
  {
    id: 8,
    name: "Triplek 9 mm",
    price: 145000,
    unit: "lembar",
    stock: 55,
    supplierId: 3,
    category: "Kayu",
    icon: "📐",
    description:
      "Triplek 9 mm untuk kebutuhan proyek, interior dan pekerjaan umum.",
  },
];

/* =========================================================
   UTILITIES
========================================================= */

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CART)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_WISHLIST)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(list));
}

function isWishlisted(id) {
  return getWishlist().includes(Number(id));
}

function toggleWishlist(id) {
  const productId = Number(id);
  const list = getWishlist();

  const index = list.indexOf(productId);

  if (index >= 0) {
    list.splice(index, 1);
    saveWishlist(list);
    return false;
  }

  list.push(productId);
  saveWishlist(list);
  return true;
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER)) || null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getUser());
}

function findProduct(id) {
  return products.find((product) => product.id === Number(id));
}

function findSupplier(id) {
  return suppliers.find((supplier) => supplier.id === Number(id));
}

function cartCount() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((total, item) => {
    const product = findProduct(item.productId);

    if (!product) return total;

    return total + product.price * item.qty;
  }, 0);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function orderStatus(order) {
  return order.status || "Pesanan dibuat";
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function toast(message) {
  let element = document.querySelector(".toast");

  if (!element) {
    element = document.createElement("div");
    element.className = "toast";
    document.body.appendChild(element);
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
}

/* =========================================================
   HEADER
========================================================= */

function header() {
  return `
    <header class="site-header">
      <div class="nav">

        <a href="#home" class="brand">
          <span class="brand-mark">BLD</span>

          <span>
            <strong>Bagus Load</strong>
            <small>& Delivery</small>
          </span>
        </a>

        <nav class="nav-links" aria-label="Navigasi utama">
          <a href="#home">Beranda</a>
          <a href="#products">Material</a>
          <a href="#orders">Pesanan</a>
        </nav>

        <a href="#cart" class="cart-button">
          🛒
          <span>Keranjang</span>
          <span class="cart-count" id="headerCartCount">
            ${cartCount()}
          </span>
        </a>

      </div>
    </header>
  `;
}

/* =========================================================
   FOOTER
========================================================= */

function footer() {
  return `
    <footer class="site-footer">
      <div class="container">
        <p>
          Bagus Load & Delivery — Demo marketplace material
          dan layanan pengiriman untuk kebutuhan proyek.
        </p>
      </div>
    </footer>
  `;
}

/* =========================================================
   MOBILE BOTTOM NAV
========================================================= */

function mobileBottomNav() {
  return `
    <nav
      class="mobile-bottom-nav"
      id="mobileBottomNav"
      aria-label="Navigasi utama"
    >

      <button
        type="button"
        data-mobile-action="chat"
        aria-label="Chat supplier"
      >
        <span class="nav-icon">💬</span>
        <span class="nav-label">Chat</span>
      </button>

      <a
        href="#wishlist"
        aria-label="Wishlist"
      >
        <span class="nav-icon">♡</span>
        <span class="nav-label">Wishlist</span>
        <span
          class="nav-badge"
          data-wishlist-badge
          hidden
        >0</span>
      </a>

      <a
        href="#cart"
        aria-label="Keranjang"
      >
        <span class="nav-icon">🛒</span>
        <span class="nav-label">Keranjang</span>
        <span
          class="nav-badge"
          data-cart-badge
          hidden
        >0</span>
      </a>

      <button
        type="button"
        data-mobile-action="booking"
        aria-label="Booking"
      >
        <span class="nav-icon">▣</span>
        <span class="nav-label">Booking</span>
      </button>

    </nav>
  `;
}

function ensureMobileBottomNav() {
  let nav = document.querySelector("#mobileBottomNav");

  if (!nav) {
    document.body.insertAdjacentHTML(
      "beforeend",
      mobileBottomNav()
    );

    nav = document.querySelector("#mobileBottomNav");

    nav
      .querySelectorAll("[data-mobile-action]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.mobileAction;

          const route =
            action === "chat"
              ? "#chat"
              : "#booking";

          localStorage.setItem(
            STORAGE_PENDING_ROUTE,
            route
          );

          location.hash = route;
        });
      });
  }

  updateMobileBottomNav();
}

function updateMobileBottomNav() {
  const nav = document.querySelector(
    "#mobileBottomNav"
  );

  if (!nav) return;

  const cartBadge =
    nav.querySelector("[data-cart-badge]");

  const wishlistBadge =
    nav.querySelector("[data-wishlist-badge]");

  const cart = cartCount();
  const wishlist = getWishlist().length;

  if (cartBadge) {
    cartBadge.textContent = cart;
    cartBadge.hidden = !cart;
  }

  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist;
    wishlistBadge.hidden = !wishlist;
  }

  const hash = location.hash || "#home";

  nav
    .querySelectorAll("a,button")
    .forEach((element) => {
      element.classList.remove("active");
    });

  if (hash === "#wishlist") {
    nav
      .querySelector('a[href="#wishlist"]')
      ?.classList.add("active");
  }

  if (
    hash === "#cart" ||
    hash === "#checkout"
  ) {
    nav
      .querySelector('a[href="#cart"]')
      ?.classList.add("active");
  }

  if (hash === "#chat") {
    nav
      .querySelector(
        '[data-mobile-action="chat"]'
      )
      ?.classList.add("active");
  }

  if (hash === "#booking") {
    nav
      .querySelector(
        '[data-mobile-action="booking"]'
      )
      ?.classList.add("active");
  }
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(product) {
  const supplier = findSupplier(product.supplierId);
  const liked = isWishlisted(product.id);

  return `
    <article class="product-card">

      <a href="#product/${product.id}">

        <div class="product-image">
          <div class="material-icon">
            ${product.icon}
          </div>
        </div>

      </a>

      <button
        type="button"
        class="wishlist-btn ${liked ? "active" : ""}"
        data-wishlist="${product.id}"
        aria-label="Simpan ke wishlist"
      >
        ${liked ? "♥" : "♡"}
      </button>

      <div class="product-body">

        <div class="supplier-mini">
          <span class="supplier-dot"></span>
          <span>${supplier?.name || "Penyedia"}</span>
        </div>

        <a href="#product/${product.id}">
          <h3>${product.name}</h3>
        </a>

        <div class="product-meta">
          <span>${rupiah(product.price)}</span>
          <small>/ ${product.unit}</small>
        </div>

        <div class="stock">
          Stok ${product.stock} ${product.unit}
        </div>

        <button
          type="button"
          class="primary-btn full-btn"
          data-add-cart="${product.id}"
        >
          + Keranjang
        </button>

      </div>
    </article>
  `;
}

/* =========================================================
   HOME
========================================================= */

function homePage() {
  return `
    <main>

      <section class="hero">
        <div class="container">
          <div class="hero-copy">

            <span class="eyebrow">
              Material & Delivery Bali
            </span>

            <h1>
              Cari material.
              Bandingkan.
              Kirim.
            </h1>

            <p>
              Temukan kebutuhan proyek dari berbagai
              penyedia material, lalu atur pengiriman
              sesuai kebutuhan.
            </p>

            <form
              class="hero-search"
              id="searchForm"
            >
              <input
                id="searchInput"
                type="search"
                placeholder="Cari besi, semen, triplek..."
                autocomplete="off"
              />

              <button type="submit">
                Cari
              </button>
            </form>

            <div class="quick-search">
              <span>Sering dicari:</span>

              <button
                type="button"
                data-quick-search="Besi"
              >
                Besi
              </button>

              <button
                type="button"
                data-quick-search="Semen"
              >
                Semen
              </button>

              <button
                type="button"
                data-quick-search="Triplek"
              >
                Triplek
              </button>

            </div>

          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">

          <div class="section-heading">
            <div>
              <h2>Material proyek</h2>
              <p>
                Pilih material yang sedang Anda butuhkan.
              </p>
            </div>

            <span class="result-count">
              ${products.length} produk
            </span>
          </div>

          <div class="category-bar">
            ${categoryButtons()}
          </div>

          <div
            class="product-grid"
            id="productGrid"
          >
            ${products
              .map(productCard)
              .join("")}
          </div>

        </div>
      </section>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   CATEGORY
========================================================= */

function categoryButtons(active = "Semua") {
  const categories = [
    "Semua",
    "Besi",
    "Semen",
    "Kayu",
    "Lainnya",
  ];

  return categories
    .map(
      (category) => `
        <button
          type="button"
          class="category-btn ${
            active === category ? "active" : ""
          }"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

function productsPage() {
  return `
    <main class="section">
      <div class="container">

        <div class="page-heading">
          <h1>Material</h1>
          <p>
            Cari dan pilih kebutuhan material
            untuk proyek Anda.
          </p>
        </div>

        <div class="category-bar">
          ${categoryButtons()}
        </div>

        <div
          class="product-grid"
          id="productGrid"
        >
          ${products
            .map(productCard)
            .join("")}
        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function productPage(product) {
  const supplier = findSupplier(product.supplierId);
  const liked = isWishlisted(product.id);

  return `
    <main class="detail-page">
      <div class="container">

        <a
          href="#products"
          class="back-link"
        >
          ← Kembali ke material
        </a>

        <div class="detail-layout">

          <div class="detail-image">
            <div>${product.icon}</div>
          </div>

          <div class="detail-content">

            <div class="supplier-mini">
              <span class="supplier-dot"></span>
              ${supplier?.name || "Penyedia"}
            </div>

            <h1>${product.name}</h1>

            <div class="detail-price">
              ${rupiah(product.price)}
              <small>/ ${product.unit}</small>
            </div>

            <p>
              ${product.description}
            </p>

            <div class="detail-stock">
              Tersedia ${product.stock} ${product.unit}
            </div>

            <div class="detail-actions">

              <button
                type="button"
                class="primary-btn"
                data-detail-add="${product.id}"
              >
                + Tambah ke keranjang
              </button>

              <button
                type="button"
                class="secondary-btn"
                data-detail-wishlist="${product.id}"
              >
                ${liked ? "♥ Tersimpan" : "♡ Simpan"}
              </button>

              <a
                href="#cart"
                class="secondary-btn"
              >
                Lihat keranjang
              </a>

              <a
                href="#chat"
                class="secondary-btn"
              >
                Chat penyedia
              </a>

            </div>

          </div>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   WISHLIST
========================================================= */

function wishlistPage() {
  const ids = getWishlist();

  const savedProducts = ids
    .map((id) => findProduct(id))
    .filter(Boolean);

  return `
    <main class="section">
      <div class="container">

        <div class="page-heading">
          <h1>Wishlist</h1>
          <p>
            Material yang Anda simpan untuk
            dilihat kembali nanti.
          </p>
        </div>

        ${
          savedProducts.length
            ? `
              <div class="product-grid">
                ${savedProducts
                  .map(productCard)
                  .join("")}
              </div>
            `
            : `
              <div class="empty-state">

                <h2>
                  Belum ada material tersimpan
                </h2>

                <p>
                  Saat menemukan material yang menarik,
                  tekan ikon ♡ untuk menyimpannya.
                </p>

                <a
                  href="#products"
                  class="primary-btn"
                >
                  Jelajahi material
                </a>

              </div>
            `
        }

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   ACCESS PAGE
========================================================= */

function accessRequiredPage(
  title,
  description,
  pendingRoute
) {
  localStorage.setItem(
    STORAGE_PENDING_ROUTE,
    pendingRoute
  );

  return `
    <main class="access-page">
      <div class="container">

        <div class="access-card">

          <div class="access-icon">
            🔐
          </div>

          <h1>${title}</h1>

          <p>
            ${description}
          </p>

          <div class="access-actions">

            <a
              href="#login"
              class="primary-btn"
            >
              Login / Lanjut di Web
            </a>

            <button
              type="button"
              class="secondary-btn"
              data-app-download
            >
              Download App
            </button>

          </div>

          <p>
            Anda tetap bisa menjelajah material
            dan menambahkannya ke keranjang
            tanpa login.
          </p>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   LOGIN
========================================================= */

function loginPage() {
  return `
    <main class="access-page">
      <div class="container">

        <div class="access-card login-card">

          <div class="access-icon">
            👤
          </div>

          <h1>
            Masuk ke Bagus Load
          </h1>

          <p>
            Login demo untuk menyimpan pesanan,
            membuka keranjang, chat supplier
            dan booking pengiriman.
          </p>

          <form id="loginForm">

            <div class="form-section">

              <label for="loginName">
                Nama
              </label>

              <input
                id="loginName"
                name="name"
                type="text"
                placeholder="Nama Anda"
                required
              />

              <label for="loginPhone">
                Nomor WhatsApp
              </label>

              <input
                id="loginPhone"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                required
              />

            </div>

            <button
              type="submit"
              class="primary-btn full-btn"
            >
              Masuk
            </button>

          </form>

          <p>
            Ini masih mode demo.
            Belum ada autentikasi produksi.
          </p>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   CHAT
========================================================= */

function chatPage() {
  const user = getUser();

  return `
    <main class="access-page">
      <div class="container">

        <div class="access-card">

          <div class="access-icon">
            💬
          </div>

          <h1>
            Chat Supplier
          </h1>

          <p>
            Halo ${user?.name || ""},
            fitur chat supplier sedang
            disiapkan dalam demo.
          </p>

          <a
            href="#products"
            class="primary-btn"
          >
            Cari Material
          </a>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   BOOKING
========================================================= */

function bookingPage() {
  const user = getUser();

  return `
    <main class="access-page">
      <div class="container">

        <div class="access-card">

          <div class="access-icon">
            🚚
          </div>

          <h1>
            Booking Pengiriman
          </h1>

          <p>
            Halo ${user?.name || ""},
            fitur booking pengiriman akan
            digunakan untuk mengatur jadwal
            pengiriman material proyek.
          </p>

          <a
            href="#products"
            class="primary-btn"
          >
            Pilih Material
          </a>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   CART
========================================================= */

function groupedCart() {
  const cart = getCart();

  const groups = {};

  cart.forEach((item) => {
    const product = findProduct(item.productId);

    if (!product) return;

    const supplier = findSupplier(
      product.supplierId
    );

    const key = product.supplierId;

    if (!groups[key]) {
      groups[key] = {
        supplier,
        items: [],
      };
    }

    groups[key].items.push({
      ...item,
      product,
    });
  });

  return Object.values(groups);
}

function cartPage() {
  const groups = groupedCart();

  if (!groups.length) {
    return `
      <main class="cart-page">
        <div class="container">

          <div class="page-heading">
            <h1>Keranjang</h1>
            <p>
              Belum ada material di keranjang Anda.
            </p>
          </div>

          <div class="empty-state">

            <h2>
              Keranjang masih kosong
            </h2>

            <p>
              Cari material yang Anda butuhkan
              untuk mulai membuat pesanan.
            </p>

            <a
              href="#products"
              class="primary-btn"
            >
              Cari Material
            </a>

          </div>

        </div>
      </main>

      ${footer()}
    `;
  }

  const subtotal = cartSubtotal();

  return `
    <main class="cart-page">
      <div class="container">

        <div class="page-heading">
          <h1>Keranjang</h1>
          <p>
            Periksa material dari beberapa penyedia
            sebelum melanjutkan pesanan.
          </p>
        </div>

        <div class="cart-layout">

          <div class="cart-items">

            ${groups
              .map(
                (group) => `
                  <section>

                    <div
                      class="section-title"
                      style="margin-top:0"
                    >
                      <h2>
                        ${group.supplier?.name || "Penyedia"}
                      </h2>
                    </div>

                    ${group.items
                      .map(
                        (item) => `
                          <div class="cart-item">

                            <div
                              style="
                                width:44px;
                                height:44px;
                                flex:0 0 44px;
                                display:grid;
                                place-items:center;
                                border-radius:10px;
                                background:#f1f1ef;
                                font-size:22px;
                              "
                            >
                              ${item.product.icon}
                            </div>

                            <div style="min-width:0;flex:1">
                              <strong>
                                ${item.product.name}
                              </strong>

                              <small>
                                ${rupiah(item.product.price)}
                                / ${item.product.unit}
                              </small>
                            </div>

                            <div class="qty-control">

                              <button
                                type="button"
                                data-qty-minus="${item.product.id}"
                              >
                                −
                              </button>

                              <span>
                                ${item.qty}
                              </span>

                              <button
                                type="button"
                                data-qty-plus="${item.product.id}"
                              >
                                +
                              </button>

                            </div>

                          </div>
                        `
                      )
                      .join("")}

                  </section>
                `
              )
              .join("")}

          </div>

          <aside class="summary-card">

            <h3>
              Ringkasan
            </h3>

            <div class="summary-line">
              <span>
                Jumlah item
              </span>

              <strong>
                ${cartCount()}
              </strong>
            </div>

            <div class="summary-line">
              <span>
                Material
              </span>

              <strong>
                ${rupiah(subtotal)}
              </strong>
            </div>

            <div class="summary-line">
              <span>
                Pengiriman
              </span>

              <span>
                Dihitung kemudian
              </span>
            </div>

            <div class="summary-total">
              <span>
                Total material
              </span>

              <strong>
                ${rupiah(subtotal)}
              </strong>
            </div>

            <div style="height:12px"></div>

            <a
              href="#checkout"
              class="primary-btn full-btn"
            >
              Lanjut Pesanan
            </a>

          </aside>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   CHECKOUT
========================================================= */

function checkoutPage() {
  const cart = getCart();

  if (!cart.length) {
    return `
      <main class="checkout-page">
        <div class="container">

          <div class="empty-state">
            <h2>
              Keranjang masih kosong
            </h2>

            <p>
              Tambahkan material terlebih dahulu
              sebelum membuat pesanan.
            </p>

            <a
              href="#products"
              class="primary-btn"
            >
              Cari Material
            </a>
          </div>

        </div>
      </main>

      ${footer()}
    `;
  }

  const subtotal = cartSubtotal();

  return `
    <main class="checkout-page">
      <div class="container">

        <a
          href="#cart"
          class="back-link"
        >
          ← Kembali ke keranjang
        </a>

        <div class="page-heading">
          <h1>
            Buat Pesanan
          </h1>

          <p>
            Masukkan informasi pengiriman
            untuk melanjutkan.
          </p>
        </div>

        <div class="cart-layout">

          <form
            class="form-card"
            id="checkoutForm"
          >

            <div class="form-section">

              <h2>
                Lokasi pengiriman
              </h2>

              <label for="checkoutAddress">
                Alamat
              </label>

              <textarea
                id="checkoutAddress"
                name="address"
                placeholder="Alamat proyek / lokasi pengiriman"
                required
              ></textarea>

              <label for="checkoutPhone">
                Nomor WhatsApp
              </label>

              <input
                id="checkoutPhone"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                required
              />

            </div>

            <div class="form-section">

              <h2>
                Waktu pengiriman
              </h2>

              <label class="choice">

                <input
                  type="radio"
                  name="delivery"
                  value="Secepatnya"
                  checked
                />

                <span>
                  <strong>
                    Secepatnya
                  </strong>

                  <small>
                    Setelah material dikonfirmasi.
                  </small>
                </span>

              </label>

              <label class="choice">

                <input
                  type="radio"
                  name="delivery"
                  value="Terjadwal"
                />

                <span>
                  <strong>
                    Terjadwal
                  </strong>

                  <small>
                    Jadwal dapat diatur kemudian.
                  </small>
                </span>

              </label>

            </div>

            <button
              type="submit"
              class="primary-btn full-btn"
            >
              Buat Pesanan
            </button>

          </form>

          <aside class="summary-card">

            <h3>
              Ringkasan
            </h3>

            <div class="summary-line">
              <span>
                Item
              </span>

              <strong>
                ${cartCount()}
              </strong>
            </div>

            <div class="summary-total">
              <span>
                Total material
              </span>

              <strong>
                ${rupiah(subtotal)}
              </strong>
            </div>

          </aside>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   CREATE ORDER
========================================================= */

function createOrder(formData) {
  const cart = getCart();

  if (!cart.length) return;

  const orders = getOrders();

  const number =
    "BLD-" +
    Date.now()
      .toString()
      .slice(-8);

  const order = {
    id: Date.now(),
    number,
    createdAt: new Date().toISOString(),

    customer: {
      name: getUser()?.name || "",
      phone: formData.get("phone"),
      address: formData.get("address"),
    },

    delivery: formData.get("delivery"),

    status: "Supplier Confirmed",

    items: cart.map((item) => {
      const product = findProduct(
        item.productId
      );

      return {
        productId: item.productId,
        name: product?.name,
        qty: item.qty,
        price: product?.price || 0,
        supplierId: product?.supplierId,
      };
    }),

    subtotal: cartSubtotal(),
  };

  orders.unshift(order);

  saveOrders(orders);

  saveCart([]);

  toast("Pesanan berhasil dibuat");

  setTimeout(() => {
    location.hash = `#order/${order.number}`;
  }, 400);
}

/* =========================================================
   ORDERS
========================================================= */

function ordersPage() {
  const orders = getOrders();

  if (!orders.length) {
    return `
      <main class="orders-page">
        <div class="container">

          <div class="page-heading">
            <h1>Pesanan</h1>
            <p>
              Riwayat pesanan Anda akan muncul di sini.
            </p>
          </div>

          <div class="empty-state">

            <h2>
              Belum ada pesanan
            </h2>

            <p>
              Pesanan yang sudah dibuat akan
              dapat dipantau dari halaman ini.
            </p>

            <a
              href="#products"
              class="primary-btn"
            >
              Mulai Belanja
            </a>

          </div>

        </div>
      </main>

      ${footer()}
    `;
  }

  return `
    <main class="orders-page">
      <div class="container">

        <div class="page-heading">
          <h1>Pesanan</h1>
          <p>
            Pantau material dan proses pengiriman.
          </p>
        </div>

        <div class="order-list">
          ${orders.map(orderCard).join("")}
        </div>

      </div>
    </main>

    ${footer()}
  `;
}

function orderCard(order) {
  const itemCount = order.items.reduce(
    (total, item) => total + item.qty,
    0
  );

  return `
    <a
      href="#order/${order.number}"
      class="order-card"
      style="display:block"
    >

      <div class="order-card-top">

        <div>
          <div class="order-number">
            ${order.number}
          </div>

          <small>
            ${formatDate(order.createdAt)}
          </small>
        </div>

        <span class="status-pill">
          ${orderStatus(order)}
        </span>

      </div>

      <div class="order-card-main">

        <strong>
          ${itemCount} item
        </strong>

        <span>
          ${rupiah(order.subtotal)}
        </span>

      </div>

    </a>
  `;
}

/* =========================================================
   ORDER DETAIL
========================================================= */

function progressSteps(order) {
  const steps = [
    "Supplier Confirmed",
    "In Transit",
    "Received at Hub",
    "Ready for Delivery",
    "Out for Delivery",
    "Delivered",
  ];

  const current =
    steps.indexOf(order.status);

  return `
    <div
      style="
        display:grid;
        gap:8px;
        margin-top:20px;
      "
    >

      ${steps
        .map(
          (step, index) => `
            <div
              style="
                display:flex;
                align-items:center;
                gap:10px;
                padding:10px 0;
                border-bottom:1px solid #f0f0ee;
                color:${
                  index <= current
                    ? "#171717"
                    : "#aaa"
                };
              "
            >

              <span
                style="
                  width:25px;
                  height:25px;
                  flex:0 0 25px;
                  display:grid;
                  place-items:center;
                  border-radius:50%;
                  background:${
                    index <= current
                      ? "#171717"
                      : "#eeeeec"
                  };
                  color:${
                    index <= current
                      ? "#fff"
                      : "#888"
                  };
                  font-size:10px;
                  font-weight:800;
                "
              >
                ${
                  index <= current
                    ? "✓"
                    : index + 1
                }
              </span>

              <span
                style="
                  font-size:12px;
                  font-weight:${
                    index === current
                      ? "800"
                      : "600"
                  };
                "
              >
                ${step}
              </span>

            </div>
          `
        )
        .join("")}

    </div>
  `;
}

function orderDetailPage(order) {
  return `
    <main class="order-detail-page">
      <div class="container">

        <a
          href="#orders"
          class="back-link"
        >
          ← Kembali ke pesanan
        </a>

        <div class="page-heading">

          <h1>
            ${order.number}
          </h1>

          <p>
            Dibuat ${formatDate(order.createdAt)}
          </p>

        </div>

        <div class="tracking-card">

          <div class="tracking-card-head">

            <h2>
              Status pengiriman
            </h2>

            <span class="status-pill">
              ${order.status}
            </span>

          </div>

          ${progressSteps(order)}

        </div>

        <div class="section-title">
          <h2>
            Material
          </h2>
        </div>

        <div class="order-list">

          ${order.items
            .map(
              (item) => `
                <div class="order-card">

                  <div class="order-card-main">

                    <strong>
                      ${item.name}
                    </strong>

                    <span>
                      ${item.qty} ×
                      ${rupiah(item.price)}
                    </span>

                  </div>

                </div>
              `
            )
            .join("")}

        </div>

        <div class="section-title">
          <h2>
            Pengiriman
          </h2>
        </div>

        <div class="tracking-card">

          <div class="summary-line">
            <span>
              Penerima
            </span>

            <strong>
              ${order.customer.name}
            </strong>
          </div>

          <div class="summary-line">
            <span>
              WhatsApp
            </span>

            <strong>
              ${order.customer.phone}
            </strong>
          </div>

          <div class="summary-line">
            <span>
              Jadwal
            </span>

            <strong>
              ${order.delivery}
            </strong>
          </div>

          <div
            style="
              margin-top:15px;
              padding-top:15px;
              border-top:1px solid #e7e7e5;
              color:#727272;
              font-size:12px;
              line-height:1.6;
            "
          >
            ${order.customer.address}
          </div>

        </div>

        <div class="section-title">
          <h2>
            Total
          </h2>
        </div>

        <div class="summary-card">

          <div class="summary-total">
            <span>
              Total material
            </span>

            <strong>
              ${rupiah(order.subtotal)}
            </strong>
          </div>

        </div>

      </div>
    </main>

    ${footer()}
  `;
}

/* =========================================================
   TRACKING ALIAS
========================================================= */

function trackingPage() {
  const orders = getOrders();

  if (!orders.length) {
    return `
      <main class="orders-page">
        <div class="container">

          <div class="empty-state">
            <h2>
              Belum ada pengiriman
            </h2>

            <p>
              Buat pesanan terlebih dahulu
              untuk melihat tracking.
            </p>

            <a
              href="#products"
              class="primary-btn"
            >
              Cari Material
            </a>
          </div>

        </div>
      </main>

      ${footer()}
    `;
  }

  return orderDetailPage(orders[0]);
}

/* =========================================================
   BIND HOME
========================================================= */

function bindHome() {
  const searchForm =
    document.querySelector("#searchForm");

  if (searchForm) {
    searchForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        const input =
          document.querySelector("#searchInput");

        const keyword =
          input?.value.trim() || "";

        location.hash =
          keyword
            ? `#products?search=${encodeURIComponent(
                keyword
              )}`
            : "#products";
      }
    );
  }

  document
    .querySelectorAll("[data-quick-search]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const keyword =
          button.dataset.quickSearch;

        location.hash =
          `#products?search=${encodeURIComponent(
            keyword
          )}`;
      });
    });

  bindCategoryButtons();
  bindAddCartButtons();
}

/* =========================================================
   CATEGORY FILTER
========================================================= */

function bindCategoryButtons() {
  document
    .querySelectorAll("[data-category]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const category =
          button.dataset.category;

        const grid =
          document.querySelector("#productGrid");

        if (!grid) return;

        document
          .querySelectorAll("[data-category]")
          .forEach((item) => {
            item.classList.remove("active");
          });

        button.classList.add("active");

        const filtered =
          category === "Semua"
            ? products
            : products.filter(
                (product) =>
                  product.category ===
                  category
              );

        grid.innerHTML = filtered
          .map(productCard)
          .join("");

        bindAddCartButtons();
        bindWishlistButtons();
      });
    });
}

/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId, qty = 1) {
  const product = findProduct(productId);

  if (!product) return;

  const cart = getCart();

  const existing =
    cart.find(
      (item) =>
        item.productId === product.id
    );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      productId: product.id,
      qty,
    });
  }

  saveCart(cart);

  updateHeader();
  updateMobileBottomNav();

  toast(
    `${product.name} ditambahkan ke keranjang`
  );
}

function bindAddCartButtons() {
  document
    .querySelectorAll("[data-add-cart]")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        addToCart(
          Number(button.dataset.addCart)
        );
      });
    });
}

/* =========================================================
   PRODUCT DETAIL BINDING
========================================================= */

function bindProduct() {
  document
    .querySelectorAll("[data-detail-add]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        addToCart(
          Number(button.dataset.detailAdd)
        );
      });
    });

  document
    .querySelectorAll(
      "[data-detail-wishlist]"
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        const id =
          Number(
            button.dataset.detailWishlist
          );

        const active =
          toggleWishlist(id);

        button.textContent =
          active
            ? "♥ Tersimpan"
            : "♡ Simpan";

        updateMobileBottomNav();

        toast(
          active
            ? "Material disimpan"
            : "Material dihapus dari wishlist"
        );
      });
    });
}

/* =========================================================
   WISHLIST BINDING
========================================================= */

function bindWishlistButtons() {
  document
    .querySelectorAll("[data-wishlist]")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const active =
          toggleWishlist(
            Number(
              button.dataset.wishlist
            )
          );

        button.classList.toggle(
          "active",
          active
        );

        button.textContent =
          active ? "♥" : "♡";

        updateMobileBottomNav();

        toast(
          active
            ? "Material disimpan ke wishlist"
            : "Material dihapus dari wishlist"
        );

        if (
          location.hash === "#wishlist"
        ) {
          render();
        }
      });
    });
}

/* =========================================================
   HEADER UPDATE
========================================================= */

function updateHeader() {
  const count =
    document.querySelector(
      "#headerCartCount"
    );

  if (count) {
    count.textContent = cartCount();
  }

  updateMobileBottomNav();
}

/* =========================================================
   CART BINDING
========================================================= */

function bindCart() {
  document
    .querySelectorAll("[data-qty-minus]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        changeQty(
          Number(
            button.dataset.qtyMinus
          ),
          -1
        );
      });
    });

  document
    .querySelectorAll("[data-qty-plus]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        changeQty(
          Number(
            button.dataset.qtyPlus
          ),
          1
        );
      });
    });
}

function changeQty(productId, amount) {
  const cart = getCart();

  const item =
    cart.find(
      (entry) =>
        entry.productId === productId
    );

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    const index =
      cart.indexOf(item);

    cart.splice(index, 1);
  }

  saveCart(cart);

  render();
}

/* =========================================================
   CHECKOUT BINDING
========================================================= */

function bindCheckout() {
  const form =
    document.querySelector(
      "#checkoutForm"
    );

  if (!form) return;

  const user = getUser();

  const phone =
    form.querySelector(
      '[name="phone"]'
    );

  if (
    phone &&
    user?.phone
  ) {
    phone.value =
      user.phone;
  }

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      createOrder(
        new FormData(form)
      );
    }
  );
}

/* =========================================================
   LOGIN BINDING
========================================================= */

function bindLogin() {
  const form =
    document.querySelector(
      "#loginForm"
    );

  if (!form) return;

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData =
        new FormData(form);

      const name =
        formData
          .get("name")
          .trim();

      const phone =
        formData
          .get("phone")
          .trim();

      if (!name || !phone) {
        toast(
          "Nama dan nomor WhatsApp wajib diisi"
        );

        return;
      }

      const user = {
        name,
        phone,
        loggedInAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_USER,
        JSON.stringify(user)
      );

      const next =
        localStorage.getItem(
          STORAGE_PENDING_ROUTE
        ) || "#home";

      localStorage.removeItem(
        STORAGE_PENDING_ROUTE
      );

      toast(
        `Selamat datang, ${user.name}`
      );

      setTimeout(() => {
        location.hash = next;
      }, 400);
    }
  );
}

/* =========================================================
   ACCESS ACTIONS
========================================================= */

function bindAccessActions() {
  document
    .querySelectorAll(
      "[data-app-download]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          toast(
            "Aplikasi mobile belum tersedia pada demo ini."
          );
        }
      );
    });
}

/* =========================================================
   SEARCH / FILTER FROM URL
========================================================= */

function getSearchFromHash() {
  const hash =
    location.hash || "";

  const questionIndex =
    hash.indexOf("?");

  if (questionIndex === -1) {
    return "";
  }

  const query =
    hash.slice(
      questionIndex + 1
    );

  const params =
    new URLSearchParams(query);

  return (
    params.get("search") || ""
  ).trim();
}

function renderProducts() {
  const grid =
    document.querySelector(
      "#productGrid"
    );

  if (!grid) return;

  const keyword =
    getSearchFromHash()
      .toLowerCase();

  const category =
    document.querySelector(
      ".category-btn.active"
    )?.dataset.category ||
    "Semua";

  let filtered =
    products.slice();

  if (keyword) {
    filtered =
      filtered.filter(
        (product) => {
          const supplier =
            findSupplier(
              product.supplierId
            );

          const text = [
            product.name,
            product.category,
            supplier?.name,
            supplier?.location,
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(
            keyword
          );
        }
      );
  }

  if (category !== "Semua") {
    filtered =
      filtered.filter(
        (product) =>
          product.category ===
          category
      );
  }

  grid.innerHTML =
    filtered.length
      ? filtered
          .map(productCard)
          .join("")
      : `
          <div
            class="empty-state"
            style="grid-column:1/-1"
          >
            <h2>
              Material tidak ditemukan
            </h2>

            <p>
              Coba gunakan kata pencarian
              yang berbeda.
            </p>

            <a
              href="#products"
              class="secondary-btn"
            >
              Lihat semua material
            </a>
          </div>
        `;

  bindAddCartButtons();
  bindWishlistButtons();
}

/* =========================================================
   ORDER DETAIL BINDING
========================================================= */

function bindOrderDetail() {
  document
    .querySelectorAll(
      "[data-simulate-status]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const number =
            button.dataset
              .simulateStatus;

          simulateNextStatus(
            number
          );
        }
      );
    });
}

/* =========================================================
   SIMULATION
========================================================= */

function simulateNextStatus(number) {
  const orders =
    getOrders();

  const order =
    orders.find(
      (item) =>
        item.number === number
    );

  if (!order) return;

  const statuses = [
    "Supplier Confirmed",
    "In Transit",
    "Received at Hub",
    "Ready for Delivery",
    "Out for Delivery",
    "Delivered",
  ];

  const index =
    statuses.indexOf(
      order.status
    );

  if (
    index >=
    statuses.length - 1
  ) {
    toast(
      "Pesanan sudah delivered"
    );

    return;
  }

  order.status =
    statuses[index + 1];

  saveOrders(orders);

  toast(
    `Status: ${order.status}`
  );

  render();
}

/* =========================================================
   ROUTER
========================================================= */

function render() {
  const app =
    document.querySelector(
      "#app"
    );

  if (!app) return;

  let hash =
    location.hash || "#home";

  /*
    Pisahkan route dari query.
    Contoh:
    #products?search=besi
  */
  const route =
    hash.split("?")[0];

  let content = "";

  /* -------------------------------------------------------
     HOME
  ------------------------------------------------------- */

  if (
    route === "#home" ||
    route === ""
  ) {
    content =
      header() +
      homePage();
  }

  /* -------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------- */

  else if (
    route === "#products"
  ) {
    content =
      header() +
      productsPage();
  }

  /* -------------------------------------------------------
     PRODUCT DETAIL
  ------------------------------------------------------- */

  else if (
    route.startsWith(
      "#product/"
    )
  ) {
    const id =
      route.split("/")[1];

    const product =
      findProduct(id);

    content =
      header() +
      (
        product
          ? productPage(product)
          : `
              <main class="section">
                <div class="container">
                  <div class="empty-state">
                    <h2>
                      Material tidak ditemukan
                    </h2>

                    <a
                      href="#products"
                      class="primary-btn"
                    >
                      Kembali
                    </a>
                  </div>
                </div>
              </main>

              ${footer()}
            `
      );
  }

  /* -------------------------------------------------------
     WISHLIST
  ------------------------------------------------------- */

  else if (
    route === "#wishlist"
  ) {
    content =
      header() +
      wishlistPage();
  }

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  else if (
    route === "#cart"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? cartPage()
          : accessRequiredPage(
              "Login untuk membuka keranjang",
              "Anda bebas menjelajah dan menambahkan material. Untuk membuka keranjang dan melanjutkan pesanan, login terlebih dahulu.",
              "#cart"
            )
      );
  }

  /* -------------------------------------------------------
     CHECKOUT
  ------------------------------------------------------- */

  else if (
    route === "#checkout"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? checkoutPage()
          : accessRequiredPage(
              "Login untuk melanjutkan pesanan",
              "Checkout membutuhkan akun agar alamat, pesanan, dan status pengiriman dapat tersimpan.",
              "#checkout"
            )
      );
  }

  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  else if (
    route === "#login"
  ) {
    content =
      header() +
      loginPage();
  }

  /* -------------------------------------------------------
     CHAT
  ------------------------------------------------------- */

  else if (
    route === "#chat"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? chatPage()
          : accessRequiredPage(
              "Login untuk chat supplier",
              "Chat dengan penyedia material tersedia setelah login.",
              "#chat"
            )
      );
  }

  /* -------------------------------------------------------
     BOOKING
  ------------------------------------------------------- */

  else if (
    route === "#booking"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? bookingPage()
          : accessRequiredPage(
              "Login untuk booking",
              "Booking pengiriman dan jadwal proyek tersedia setelah login.",
              "#booking"
            )
      );
  }

  /* -------------------------------------------------------
     ORDERS
  ------------------------------------------------------- */

  else if (
    route === "#orders"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? ordersPage()
          : accessRequiredPage(
              "Login untuk melihat pesanan",
              "Riwayat dan status pesanan tersimpan pada akun Anda.",
              "#orders"
            )
      );
  }

  /* -------------------------------------------------------
     ORDER DETAIL
  ------------------------------------------------------- */

  else if (
    route.startsWith(
      "#order/"
    )
  ) {
    if (!isLoggedIn()) {
      content =
        header() +
        accessRequiredPage(
          "Login untuk melihat pesanan",
          "Detail pesanan hanya dapat dibuka setelah login.",
          hash
        );
    } else {
      const number =
        decodeURIComponent(
          route.slice(7)
        );

      const order =
        getOrders().find(
          (item) =>
            item.number === number
        );

      content =
        header() +
        (
          order
            ? orderDetailPage(order)
            : `
                <main class="section">
                  <div class="container">
                    <div class="empty-state">
                      <h2>
                        Pesanan tidak ditemukan
                      </h2>

                      <a
                        href="#orders"
                        class="primary-btn"
                      >
                        Kembali ke pesanan
                      </a>
                    </div>
                  </div>
                </main>

                ${footer()}
              `
        );
    }
  }

  /* -------------------------------------------------------
     TRACKING
  ------------------------------------------------------- */

  else if (
    route === "#tracking"
  ) {
    content =
      header() +
      (
        isLoggedIn()
          ? trackingPage()
          : accessRequiredPage(
              "Login untuk melihat tracking",
              "Status pengiriman tersimpan pada akun Anda.",
              "#tracking"
            )
      );
  }

  /* -------------------------------------------------------
     FALLBACK
  ------------------------------------------------------- */

  else {
    content =
      header() +
      homePage();
  }

  app.innerHTML =
    `<div class="app-shell">${content}</div>`;

  ensureMobileBottomNav();

  bindHome();
  bindProduct();
  bindCart();
  bindCheckout();
  bindLogin();
  bindAccessActions();
  bindOrderDetail();
  bindWishlistButtons();

  /*
    Setelah halaman products dirender,
    terapkan query pencarian.
  */
  if (
    route === "#products"
  ) {
    renderProducts();
  }

  updateHeader();
  updateMobileBottomNav();
}

/* =========================================================
   HASH CHANGE
========================================================= */

window.addEventListener(
  "hashchange",
  render
);

/* =========================================================
   INITIAL RENDER
========================================================= */

render();