import "./style.css";

/* =========================================================
   BAGUS LOAD & DELIVERY
   FRONTEND DEMO
========================================================= */

const STORAGE_CART = "bagusCart";
const STORAGE_ORDERS = "bagusOrders";

/* =========================================================
   DEMO SUPPLIERS
========================================================= */

const suppliers = {
  besi: {
    id: "SUP-001",
    name: "Supplier Besi Bali",
    location: "Denpasar",
    initials: "SB"
  },

  bangunan: {
    id: "SUP-002",
    name: "Toko Bangunan Bali",
    location: "Badung",
    initials: "TB"
  },

  kayu: {
    id: "SUP-003",
    name: "Kayu & Material Bali",
    location: "Denpasar",
    initials: "KM"
  }
};

/* =========================================================
   DEMO PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    name: "Besi Ulir 10 mm",
    category: "Besi",
    price: 89000,
    unit: "batang",
    stock: 120,
    icon: "Ø10",
    supplierId: "besi",
    description:
      "Besi ulir 10 mm untuk kebutuhan struktur dan pekerjaan konstruksi umum."
  },

  {
    id: 2,
    name: "Besi Ulir 12 mm",
    category: "Besi",
    price: 126000,
    unit: "batang",
    stock: 85,
    icon: "Ø12",
    supplierId: "besi",
    description:
      "Besi ulir 12 mm untuk pekerjaan struktur beton dan kebutuhan proyek."
  },

  {
    id: 3,
    name: "Besi Ulir 16 mm",
    category: "Besi",
    price: 218000,
    unit: "batang",
    stock: 60,
    icon: "Ø16",
    supplierId: "besi",
    description:
      "Besi ulir 16 mm untuk pekerjaan struktur dengan kebutuhan diameter lebih besar."
  },

  {
    id: 4,
    name: "Besi Polos 8 mm",
    category: "Besi",
    price: 58000,
    unit: "batang",
    stock: 150,
    icon: "Ø8",
    supplierId: "besi",
    description:
      "Besi polos 8 mm untuk kebutuhan konstruksi, begel, dan pekerjaan pendukung."
  },

  {
    id: 5,
    name: "Semen 50 kg",
    category: "Semen",
    price: 68000,
    unit: "zak",
    stock: 250,
    icon: "50K",
    supplierId: "bangunan",
    description:
      "Semen kemasan 50 kg untuk kebutuhan pembangunan dan pekerjaan beton."
  },

  {
    id: 6,
    name: "Kawat Bendrat",
    category: "Pendukung",
    price: 28000,
    unit: "kg",
    stock: 180,
    icon: "KB",
    supplierId: "bangunan",
    description:
      "Kawat bendrat untuk kebutuhan pengikatan tulangan dan pekerjaan konstruksi."
  },

  {
    id: 7,
    name: "Triplek 12 mm",
    category: "Kayu",
    price: 185000,
    unit: "lembar",
    stock: 48,
    icon: "12",
    supplierId: "kayu",
    description:
      "Triplek 12 mm untuk bekisting, pekerjaan interior, dan kebutuhan proyek."
  },

  {
    id: 8,
    name: "Triplek 9 mm",
    category: "Kayu",
    price: 145000,
    unit: "lembar",
    stock: 55,
    icon: "9",
    supplierId: "kayu",
    description:
      "Triplek 9 mm untuk pekerjaan proyek yang membutuhkan material lembaran."
  }
];

/* =========================================================
   UTILITIES
========================================================= */

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
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

function findProduct(id) {
  return products.find((product) => product.id === Number(id));
}

function findSupplier(id) {
  return suppliers[id];
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

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function orderStatus(order) {
  if (!order) return "Belum diproses";

  const supplierStatuses = order.suppliers || [];

  if (
    supplierStatuses.some(
      (supplier) => supplier.status !== "received"
    )
  ) {
    return "Supplier memproses";
  }

  if (order.hubStatus !== "ready") {
    return "Menuju Hub";
  }

  if (order.deliveryStatus === "delivered") {
    return "Selesai";
  }

  if (order.deliveryStatus === "out") {
    return "Dalam pengiriman";
  }

  return "Siap dikirim";
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
  const count = cartCount();

  return `
    <header class="site-header">

      <div class="container nav">

        <a href="#home" class="brand">

          <div class="brand-mark">
            BL
          </div>

          <div>
            <strong>Bagus Load</strong>
            <small>& Delivery</small>
          </div>

        </a>

        <nav class="desktop-nav">

          <a href="#home">Beranda</a>

          <a href="#products">Material</a>

          <a href="#orders">
            Pesanan
            ${
              getOrders().length
                ? `<span class="nav-order-badge">${getOrders().length}</span>`
                : ""
            }
          </a>

        </nav>

        <a href="#cart" class="cart-button">

          <span>${count}</span>

          Keranjang

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
    <footer>

      <div class="container footer-inner">

        <div>
          <strong>Bagus Load & Delivery</strong>

          <p>
            Pengadaan material proyek dan delivery yang terkoordinasi.
          </p>
        </div>

        <div class="footer-note">
          Demo frontend — data supplier dan harga masih simulasi.
        </div>

      </div>

    </footer>
  `;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(product) {
  const supplier = findSupplier(product.supplierId);

  return `
    <article class="product-card">

      <a href="#product/${product.id}" class="product-image">

        <span>${product.category}</span>

        <div class="material-icon">
          ${product.icon}
        </div>

      </a>

      <div class="product-body">

        <div class="supplier-mini">

          <span class="supplier-dot"></span>

          ${supplier.name}

        </div>

        <h3>
          <a href="#product/${product.id}">
            ${product.name}
          </a>
        </h3>

        <div class="product-meta">

          <span>${rupiah(product.price)}</span>

          <small>/${product.unit}</small>

        </div>

        <div class="stock">
          Stok tersedia ${product.stock} ${product.unit}
        </div>

        <button
          class="primary-btn add-btn"
          data-add="${product.id}"
        >
          Tambah ke keranjang
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
    ${header()}

    <main>

      <!-- HERO -->

      <section class="hero">

        <div class="container hero-grid">

          <div class="hero-copy">

            <div class="eyebrow">
              MATERIAL • PROCUREMENT • DELIVERY
            </div>

            <h1>
              Apa yang Anda butuhkan untuk proyek?
            </h1>

            <p>
              Cari material dari berbagai supplier, gabungkan kebutuhan
              dalam satu pesanan, lalu atur pengiriman menuju proyek.
            </p>

            <form class="hero-search" id="heroSearch">

              <input
                id="heroSearchInput"
                type="search"
                placeholder="Cari besi, semen, triplek..."
                autocomplete="off"
              />

              <button type="submit">
                Cari Material
              </button>

            </form>

            <div class="quick-search">

              <span>Cepat:</span>

              <button data-search="Besi">Besi</button>

              <button data-search="Semen">Semen</button>

              <button data-search="Triplek">Triplek</button>

              <button data-search="Kawat">Kawat</button>

            </div>

          </div>

          <div class="hero-panel">

            <div class="panel-label">
              CONTOH ALUR PESANAN
            </div>

            <div class="order-preview">

              <div class="preview-top">

                <span>Order #BLD-240921</span>

                <b>PROSES</b>

              </div>

              <h3>
                Material proyek
              </h3>

              <div class="preview-items">

                <div>
                  <span>Besi Ulir 12 mm × 20</span>
                  <strong>Rp2,52 jt</strong>
                </div>

                <div>
                  <span>Semen 50 kg × 20</span>
                  <strong>Rp1,36 jt</strong>
                </div>

                <div>
                  <span>Triplek 12 mm × 5</span>
                  <strong>Rp925 rb</strong>
                </div>

              </div>

              <div class="preview-route">

                <div>
                  <small>SUPPLIER A</small>
                  <strong>Besi</strong>
                </div>

                <span>→</span>

                <div>
                  <small>SUPPLIER B</small>
                  <strong>Bangunan</strong>
                </div>

                <span>→</span>

                <div>
                  <small>HUB</small>
                  <strong>Konsolidasi</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- TRUST -->

      <section class="trust-section">

        <div class="container trust-grid">

          <div>
            <strong>Multi-Supplier</strong>
            <span>Belanja dari beberapa supplier.</span>
          </div>

          <div>
            <strong>Hub Konsolidasi</strong>
            <span>Barang dapat dikumpulkan sebelum dikirim.</span>
          </div>

          <div>
            <strong>Tracking Pesanan</strong>
            <span>Pantau proses supplier hingga proyek.</span>
          </div>

        </div>

      </section>


      <!-- PRODUCTS -->

      <section class="section" id="products">

        <div class="container">

          <div class="section-heading">

            <div>
              <div class="eyebrow">
                MATERIAL PROYEK
              </div>

              <h2>
                Cari material
              </h2>
            </div>

            <div
              class="result-count"
              id="resultCount"
            >
              ${products.length} material
            </div>

          </div>

          <div class="category-bar">

            <button
              class="category-btn active"
              data-category="Semua"
            >
              Semua
            </button>

            <button
              class="category-btn"
              data-category="Besi"
            >
              Besi
            </button>

            <button
              class="category-btn"
              data-category="Semen"
            >
              Semen
            </button>

            <button
              class="category-btn"
              data-category="Kayu"
            >
              Kayu
            </button>

            <button
              class="category-btn"
              data-category="Pendukung"
            >
              Pendukung
            </button>

          </div>

          <div
            class="product-grid"
            id="productGrid"
          >
            ${products.map(productCard).join("")}
          </div>

        </div>

      </section>


      <!-- PROCESS -->

      <section class="section process-section">

        <div class="container">

          <div class="section-heading">

            <div>

              <div class="eyebrow">
                CARA KERJA
              </div>

              <h2>
                Dari material sampai proyek
              </h2>

            </div>

          </div>

          <div class="process-grid">

            <div class="process-card">
              <span>01</span>
              <h3>Cari</h3>
              <p>
                Cari material berdasarkan kebutuhan proyek.
              </p>
            </div>

            <div class="process-card">
              <span>02</span>
              <h3>Pilih</h3>
              <p>
                Pilih material dari supplier yang tersedia.
              </p>
            </div>

            <div class="process-card">
              <span>03</span>
              <h3>Konsolidasi</h3>
              <p>
                Barang dari beberapa supplier dapat diarahkan ke Hub.
              </p>
            </div>

            <div class="process-card">
              <span>04</span>
              <h3>Kirim</h3>
              <p>
                Material diteruskan bersama menuju lokasi proyek.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function productPage(id) {
  const product = findProduct(id);

  if (!product) {
    return `
      ${header()}

      <main class="empty-page">

        <div class="empty-box">

          <div class="empty-icon">!</div>

          <h1>Material tidak ditemukan</h1>

          <p>Produk yang Anda cari tidak tersedia.</p>

          <a class="primary-btn" href="#home">
            Kembali
          </a>

        </div>

      </main>

      ${footer()}
    `;
  }

  const supplier = findSupplier(product.supplierId);

  return `
    ${header()}

    <main class="detail-page">

      <div class="container">

        <a href="#home" class="back-link">
          ← Kembali ke material
        </a>

        <div class="detail-grid">

          <div class="detail-image">

            <span>${product.category}</span>

            <div>
              ${product.icon}
            </div>

          </div>

          <div class="detail-content">

            <div class="supplier-mini">

              <span class="supplier-dot"></span>

              ${supplier.name} · ${supplier.location}

            </div>

            <h1>
              ${product.name}
            </h1>

            <div class="detail-price">

              ${rupiah(product.price)}

              <small>
                /${product.unit}
              </small>

            </div>

            <p>
              ${product.description}
            </p>

            <div class="detail-stock">
              Stok tersedia:
              <strong>
                ${product.stock} ${product.unit}
              </strong>
            </div>

            <div class="detail-actions">

              <button
                class="primary-btn"
                id="detailAdd"
                data-id="${product.id}"
              >
                Tambah ke keranjang
              </button>

              <a
                class="secondary-btn"
                href="#cart"
              >
                Lihat keranjang
              </a>

            </div>

            <div class="info-box">

              <strong>
                Pengiriman proyek
              </strong>

              <span>
                Material dapat digabung dengan pembelian dari supplier lain
                dalam satu pesanan.
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   CART
========================================================= */

function groupCartBySupplier() {
  const cart = getCart();

  const groups = {};

  cart.forEach((item) => {

    const product = findProduct(item.productId);

    if (!product) return;

    const supplier = findSupplier(product.supplierId);

    if (!groups[product.supplierId]) {
      groups[product.supplierId] = {
        supplier,
        items: []
      };
    }

    groups[product.supplierId].items.push({
      ...item,
      product
    });

  });

  return Object.values(groups);
}

function cartPage() {
  const cart = getCart();

  if (!cart.length) {

    return `
      ${header()}

      <main class="empty-page">

        <div class="empty-box">

          <div class="empty-icon">
            +
          </div>

          <h1>
            Keranjang masih kosong
          </h1>

          <p>
            Tambahkan material yang Anda butuhkan untuk proyek.
          </p>

          <a
            href="#home"
            class="primary-btn"
          >
            Cari Material
          </a>

        </div>

      </main>

      ${footer()}
    `;
  }

  const groups = groupCartBySupplier();
  const subtotal = cartSubtotal();
  const delivery = 25000;
  const total = subtotal + delivery;

  return `
    ${header()}

    <main class="cart-page">

      <div class="container">

        <a href="#home" class="back-link">
          ← Lanjut belanja
        </a>

        <div class="page-heading">

          <h1>
            Keranjang
          </h1>

          <p>
            Material dari ${groups.length} supplier.
          </p>

        </div>

        <div class="supplier-summary">

          ${groups.map((group) => `
            <div class="supplier-summary-item">

              <div class="supplier-avatar">
                ${group.supplier.initials}
              </div>

              <div>

                <strong>
                  ${group.supplier.name}
                </strong>

                <small>
                  ${group.items.length} material
                </small>

              </div>

            </div>
          `).join("")}

        </div>

        <div class="cart-layout">

          <div>

            ${groups.map((group) => `

              <div class="cart-supplier">

                <div class="cart-supplier-head">

                  <div>
                    <strong>
                      ${group.supplier.name}
                    </strong>

                    <small>
                      ${group.supplier.location}
                    </small>
                  </div>

                  <span>
                    ${group.items.length} item
                  </span>

                </div>

                ${group.items.map((item) => `

                  <div class="cart-item">

                    <div>

                      <strong>
                        ${item.product.name}
                      </strong>

                      <small>
                        ${rupiah(item.product.price)}
                        /${item.product.unit}
                      </small>

                    </div>

                    <div class="qty-control">

                      <button
                        data-minus="${item.product.id}"
                      >
                        −
                      </button>

                      <span>
                        ${item.qty}
                      </span>

                      <button
                        data-plus="${item.product.id}"
                      >
                        +
                      </button>

                    </div>

                    <strong>
                      ${rupiah(
                        item.product.price * item.qty
                      )}
                    </strong>

                  </div>

                `).join("")}

              </div>

            `).join("")}

          </div>

          <aside class="summary-card">

            <div class="summary-line">

              <span>
                Subtotal
              </span>

              <span>
                ${rupiah(subtotal)}
              </span>

            </div>

            <div class="summary-line">

              <span>
                Delivery
              </span>

              <span>
                ${rupiah(delivery)}
              </span>

            </div>

            <div class="summary-total">

              <span>
                Total
              </span>

              <strong>
                ${rupiah(total)}
              </strong>

            </div>

            <p class="summary-note">
              Biaya delivery demo. Perhitungan realtime akan
              menggunakan lokasi, berat, volume, kendaraan,
              dan rute aktual.
            </p>

            <a
              href="#checkout"
              class="primary-btn full-btn"
            >
              Lanjut Checkout
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
    location.hash = "#cart";
    return "";
  }

  const subtotal = cartSubtotal();
  const delivery = 25000;
  const total = subtotal + delivery;
  const groups = groupCartBySupplier();

  return `
    ${header()}

    <main class="checkout-page">

      <div class="container">

        <a href="#cart" class="back-link">
          ← Kembali ke keranjang
        </a>

        <div class="page-heading">

          <h1>
            Checkout
          </h1>

          <p>
            Tentukan lokasi dan waktu pengiriman material.
          </p>

        </div>

        <div class="checkout-layout">

          <form
            class="form-card"
            id="checkoutForm"
          >

            <div class="form-section">

              <h2>
                Informasi penerima
              </h2>

              <label>
                Nama penerima

                <input
                  name="name"
                  required
                  placeholder="Nama tukang / mandor / penerima"
                />

              </label>

              <label>
                WhatsApp

                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                />

              </label>

            </div>


            <div class="form-section">

              <h2>
                Lokasi proyek
              </h2>

              <label>
                Alamat proyek

                <textarea
                  name="address"
                  required
                  placeholder="Alamat lengkap lokasi proyek"
                ></textarea>

              </label>

              <label>
                Kecamatan

                <input
                  name="district"
                  required
                  placeholder="Contoh: Denpasar Selatan"
                />

              </label>

              <label>
                Patokan lokasi

                <input
                  name="landmark"
                  placeholder="Contoh: dekat minimarket..."
                />

              </label>

            </div>


            <div class="form-section">

              <h2>
                Waktu pengiriman
              </h2>

              <div class="delivery-choice">

                <label class="choice">

                  <input
                    type="radio"
                    name="deliveryType"
                    value="now"
                    checked
                  />

                  <span>
                    <strong>
                      Secepatnya
                    </strong>

                    <small>
                      Diproses setelah supplier dikonfirmasi.
                    </small>
                  </span>

                </label>

                <label class="choice">

                  <input
                    type="radio"
                    name="deliveryType"
                    value="schedule"
                  />

                  <span>
                    <strong>
                      Jadwalkan
                    </strong>

                    <small>
                      Tentukan tanggal dan waktu.
                    </small>
                  </span>

                </label>

              </div>

              <div
                class="schedule-fields"
                id="scheduleFields"
              >

                <input
                  type="date"
                  name="date"
                />

                <input
                  type="time"
                  name="time"
                />

              </div>

            </div>


            <div class="form-section">

              <h2>
                Catatan
              </h2>

              <label>

                Catatan untuk pengiriman

                <textarea
                  name="note"
                  placeholder="Contoh: material diturunkan di sisi timur bangunan."
                ></textarea>

              </label>

            </div>


            <button
              class="primary-btn full-btn"
              type="submit"
            >
              Buat Pesanan
            </button>

          </form>


          <aside>

            <div class="summary-card">

              <h3>
                Ringkasan
              </h3>

              ${cart.map((item) => {

                const product = findProduct(item.productId);

                return `
                  <div class="checkout-item">

                    <span>
                      ${product.name} × ${item.qty}
                    </span>

                    <strong>
                      ${rupiah(product.price * item.qty)}
                    </strong>

                  </div>
                `;

              }).join("")}

              <div class="summary-line">

                <span>
                  Material
                </span>

                <span>
                  ${rupiah(subtotal)}
                </span>

              </div>

              <div class="summary-line">

                <span>
                  Delivery
                </span>

                <span>
                  ${rupiah(delivery)}
                </span>

              </div>

              <div class="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ${rupiah(total)}
                </strong>

              </div>

              <div class="hub-message">

                <strong>
                  Multi-Supplier + Hub
                </strong>

                <span>
                  ${
                    groups.length > 1
                      ? `Pesanan berasal dari ${groups.length} supplier dan dapat dikonsolidasikan di Hub.`
                      : "Pesanan dari satu supplier dapat langsung diproses."
                  }
                </span>

              </div>

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

function createOrder(form) {
  const formData = new FormData(form);
  const cart = getCart();

  const groups = groupCartBySupplier();

  const orderNumber =
    "BLD-" +
    Date.now()
      .toString()
      .slice(-8);

  const items = cart.map((item) => {
    const product = findProduct(item.productId);

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      qty: item.qty,
      supplierId: product.supplierId,
      total: product.price * item.qty
    };
  });

  const suppliersData = groups.map((group) => {

    return {
      id: group.supplier.id,
      supplierId: group.items[0].product.supplierId,
      name: group.supplier.name,
      location: group.supplier.location,

      items: group.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        qty: item.qty,
        unit: item.product.unit,
        total: item.product.price * item.qty
      })),

      status: "confirmed"
    };

  });

  const subtotal = cartSubtotal();
  const delivery = 25000;

  const order = {

    number: orderNumber,

    createdAt: new Date().toISOString(),

    customer: {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      district: formData.get("district"),
      landmark: formData.get("landmark"),
      note: formData.get("note")
    },

    delivery: {
      type: formData.get("deliveryType"),
      date: formData.get("date") || null,
      time: formData.get("time") || null
    },

    items,

    suppliers: suppliersData,

    hubStatus:
      suppliersData.length > 1
        ? "waiting"
        : "not-required",

    deliveryStatus: "waiting",

    subtotal,

    deliveryFee: delivery,

    total: subtotal + delivery
  };

  const orders = getOrders();

  orders.unshift(order);

  saveOrders(orders);

  saveCart([]);

  location.hash = `#order/${order.number}`;
}

/* =========================================================
   ORDERS DASHBOARD
========================================================= */

function ordersPage() {
  const orders = getOrders();

  return `
    ${header()}

    <main class="orders-page">

      <div class="container narrow-container">

        <a href="#home" class="back-link">
          ← Kembali ke beranda
        </a>

        <div class="page-heading">

          <h1>
            Pesanan
          </h1>

          <p>
            Semua pesanan material Anda.
          </p>

        </div>

        ${
          !orders.length
            ? `
              <div class="empty-box">

                <div class="empty-icon">
                  —
                </div>

                <h2>
                  Belum ada pesanan
                </h2>

                <p>
                  Pesanan yang Anda buat akan muncul di sini.
                </p>

                <a
                  href="#home"
                  class="primary-btn"
                >
                  Cari Material
                </a>

              </div>
            `
            : `
              <div class="orders-list">

                ${orders.map((order) => orderCard(order)).join("")}

              </div>
            `
        }

      </div>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   ORDER CARD
========================================================= */

function orderCard(order) {

  const current = getProgressIndex(order);

  return `
    <article class="order-card">

      <div class="order-card-top">

        <div>

          <span class="order-number">
            ${order.number}
          </span>

          <small>
            ${formatDate(order.createdAt)}
          </small>

        </div>

        <span class="status-pill">
          ${orderStatus(order)}
        </span>

      </div>

      <div class="order-card-main">

        <div>

          <strong>
            ${order.items.length} material
          </strong>

          <span>
            ${order.suppliers.length} supplier
          </span>

        </div>

        <div>

          <strong>
            ${rupiah(order.total)}
          </strong>

          <span>
            Total pesanan
          </span>

        </div>

      </div>

      <div class="mini-progress">

        ${progressSteps()
          .map((step, index) => `
            <div class="${index <= current ? "done" : ""}">

              <span></span>

              <small>
                ${step.short}
              </small>

            </div>
          `)
          .join("")}

      </div>

      <a
        href="#order/${order.number}"
        class="secondary-btn"
      >
        Lihat detail pesanan
      </a>

    </article>
  `;
}

/* =========================================================
   PROGRESS
========================================================= */

function progressSteps() {

  return [
    {
      short: "Pesanan"
    },
    {
      short: "Supplier"
    },
    {
      short: "Hub"
    },
    {
      short: "Kirim"
    },
    {
      short: "Selesai"
    }
  ];

}

function getProgressIndex(order) {

  if (!order) return 0;

  if (order.deliveryStatus === "delivered") {
    return 4;
  }

  if (order.deliveryStatus === "out") {
    return 3;
  }

  if (
    order.hubStatus === "ready" ||
    order.hubStatus === "consolidated"
  ) {
    return 3;
  }

  if (
    order.suppliers.every(
      (supplier) => supplier.status === "received"
    )
  ) {
    return 2;
  }

  if (
    order.suppliers.some(
      (supplier) => supplier.status !== "confirmed"
    )
  ) {
    return 1;
  }

  return 0;
}

/* =========================================================
   ORDER DETAIL
========================================================= */

function orderDetailPage(number) {

  const orders = getOrders();

  const order = orders.find(
    (item) => item.number === number
  );

  if (!order) {

    return `
      ${header()}

      <main class="empty-page">

        <div class="empty-box">

          <h1>
            Pesanan tidak ditemukan
          </h1>

          <p>
            Nomor pesanan tidak tersedia.
          </p>

          <a
            href="#orders"
            class="primary-btn"
          >
            Lihat Pesanan
          </a>

        </div>

      </main>

      ${footer()}
    `;
  }

  const progress = getProgressIndex(order);

  return `
    ${header()}

    <main class="order-detail-page">

      <div class="container narrow-container">

        <a href="#orders" class="back-link">
          ← Semua pesanan
        </a>

        <div class="order-detail-head">

          <div>

            <h1>
              ${order.number}
            </h1>

            <p>
              Dibuat ${formatDate(order.createdAt)}
            </p>

          </div>

          <span class="status-pill large">
            ${orderStatus(order)}
          </span>

        </div>


        <!-- MAIN TRACKING -->

        <section class="tracking-card">

          <div class="tracking-card-head">

            <div>

              <h2>
                Perjalanan pesanan
              </h2>

            </div>

            <div class="demo-label">
              DEMO SIMULASI
            </div>

          </div>

          <div class="main-progress">

            ${progressSteps()
              .map((step, index) => `
                <div class="${index <= progress ? "done" : ""}">

                  <span></span>

                  <small>
                    ${step.short}
                  </small>

                </div>
              `)
              .join("")}

          </div>

        </section>


        <!-- SUPPLIER -->

        <section class="detail-section">

          <div class="section-title">

            <div class="eyebrow">
              SUPPLIER
            </div>

            <h2>
              Proses dari supplier
            </h2>

          </div>

          <div class="supplier-status-list">

            ${order.suppliers
              .map((supplier, index) =>
                supplierStatusCard(
                  order,
                  supplier,
                  index
                )
              )
              .join("")}

          </div>

        </section>


        <!-- HUB -->

        ${
          order.suppliers.length > 1
            ? `
              <section class="detail-section">

                <div class="section-title">

                  <div class="eyebrow">
                    KONSOLIDASI
                  </div>

                  <h2>
                    Hub
                  </h2>

                </div>

                ${hubCard(order)}

              </section>
            `
            : ""
        }


        <!-- DELIVERY -->

        <section class="detail-section">

          <div class="section-title">

            <div class="eyebrow">
              LAST MILE
            </div>

            <h2>
              Pengiriman ke proyek
            </h2>

          </div>

          ${deliveryCard(order)}

        </section>


        <!-- ITEMS -->

        <section class="detail-section">

          <div class="section-title">

            <div class="eyebrow">
              RINCIAN
            </div>

            <h2>
              Material pesanan
            </h2>

          </div>

          <div class="detail-two-col">

            <div class="items-detail-card">

              <h2>
                Item
              </h2>

              ${order.items.map((item) => `

                <div class="detail-item">

                  <div>

                    <strong>
                      ${item.name}
                    </strong>

                    <span>
                      ${item.qty} ${item.unit} · ${rupiah(item.price)}
                    </span>

                  </div>

                  <strong>
                    ${rupiah(item.total)}
                  </strong>

                </div>

              `).join("")}

              ${
                order.customer.note
                  ? `
                    <div class="note-box">

                      <strong>
                        Catatan pengiriman
                      </strong>

                      <span>
                        ${order.customer.note}
                      </span>

                    </div>
                  `
                  : ""
              }

            </div>


            <div class="summary-card">

              <div class="summary-line">

                <span>
                  Material
                </span>

                <span>
                  ${rupiah(order.subtotal)}
                </span>

              </div>

              <div class="summary-line">

                <span>
                  Delivery
                </span>

                <span>
                  ${rupiah(order.deliveryFee)}
                </span>

              </div>

              <div class="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ${rupiah(order.total)}
                </strong>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   SUPPLIER STATUS CARD
========================================================= */

function supplierStatusCard(order, supplier, index) {

  const statusText = {
    confirmed: "Pesanan dikonfirmasi",
    pickup: "Menunggu / dalam pickup",
    transit: "Dalam perjalanan ke Hub",
    received: "Sudah diterima di Hub"
  };

  const nextAction = {
    confirmed: "Simulasikan Pickup",
    pickup: "Simulasikan Tiba di Hub",
    transit: "Simulasikan Diterima di Hub",
    received: "Sudah diterima"
  };

  return `
    <article class="supplier-status-card">

      <div class="supplier-status-head">

        <div class="supplier-avatar">
          ${supplier.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div>

          <strong>
            ${supplier.name}
          </strong>

          <span>
            ${supplier.location}
          </span>

        </div>

        <span class="status-pill">
          ${statusText[supplier.status]}
        </span>

      </div>

      <div class="supplier-materials">

        ${supplier.items.map((item) => `

          <div>

            <span>
              ${item.name}
            </span>

            <strong>
              ${item.qty} ${item.unit}
            </strong>

          </div>

        `).join("")}

      </div>

      <div class="supplier-route">

        <span>
          Supplier
        </span>

        <b>→</b>

        <span>
          Hub
        </span>

      </div>

      ${
        supplier.status !== "received"
          ? `
            <button
              class="primary-btn simulate-btn"
              data-supplier-next="${index}"
              data-order="${order.number}"
            >
              ${nextAction[supplier.status]}
            </button>
          `
          : `
            <div class="received-message">
              ✓ Material sudah diterima di Hub
            </div>
          `
      }

    </article>
  `;
}

/* =========================================================
   HUB CARD
========================================================= */

function hubCard(order) {

  const allReceived = order.suppliers.every(
    (supplier) => supplier.status === "received"
  );

  if (allReceived && order.hubStatus === "waiting") {
    order.hubStatus = "ready";

    saveOrders(
      getOrders().map((item) =>
        item.number === order.number
          ? order
          : item
      )
    );
  }

  const status =
    order.hubStatus === "ready"
      ? "Semua material sudah terkumpul"
      : "Menunggu material dari supplier";

  return `
    <div class="hub-card">

      <div class="hub-icon">
        HUB
      </div>

      <div class="hub-content">

        <h2>
          Hub Konsolidasi
        </h2>

        <p>
          Material dari beberapa supplier dikumpulkan
          terlebih dahulu sebelum diteruskan menuju proyek.
        </p>

        <div class="hub-status">

          <strong>
            ${status}
          </strong>

        </div>

        ${
          order.hubStatus === "ready"
            ? `
              <button
                class="primary-btn"
                data-hub-ready="${order.number}"
              >
                Siapkan untuk pengiriman
              </button>
            `
            : `
              <div class="received-message">
                Menunggu semua supplier menyelesaikan pengiriman.
              </div>
            `
        }

      </div>

    </div>
  `;
}

/* =========================================================
   DELIVERY CARD
========================================================= */

function deliveryCard(order) {

  let status = "Menunggu material dari Hub";

  if (order.deliveryStatus === "ready") {
    status = "Siap dikirim ke proyek";
  }

  if (order.deliveryStatus === "out") {
    status = "Dalam pengiriman ke proyek";
  }

  if (order.deliveryStatus === "delivered") {
    status = "Pesanan telah diterima";
  }

  return `
    <div class="delivery-card">

      <h2>
        Pengiriman Proyek
      </h2>

      <div class="delivery-status">

        <span class="status-dot"></span>

        <strong>
          ${status}
        </strong>

      </div>

      <div class="address-box">

        <strong>
          ${order.customer.name}
        </strong>

        <span>
          ${order.customer.phone}
        </span>

        <p>
          ${order.customer.address}
        </p>

        <small>
          ${order.customer.district}
          ${
            order.customer.landmark
              ? ` · ${order.customer.landmark}`
              : ""
          }
        </small>

        ${
          order.delivery.type === "schedule"
            ? `
              <small>
                Jadwal:
                ${order.delivery.date || "-"}
                ${order.delivery.time || ""}
              </small>
            `
            : `
              <small>
                Pengiriman secepatnya
              </small>
            `
        }

      </div>

      ${
        order.deliveryStatus === "ready"
          ? `
            <button
              class="primary-btn full-btn"
              data-delivery-start="${order.number}"
            >
              Mulai Pengiriman
            </button>
          `
          : ""
      }

      ${
        order.deliveryStatus === "out"
          ? `
            <button
              class="primary-btn full-btn"
              data-delivery-done="${order.number}"
            >
              Tandai Sudah Diterima
            </button>
          `
          : ""
      }

    </div>
  `;
}

/* =========================================================
   TRACKING ALIAS
========================================================= */

function trackingPage() {

  const orders = getOrders();

  if (!orders.length) {
    location.hash = "#orders";
    return "";
  }

  location.hash = `#order/${orders[0].number}`;

  return "";
}

/* =========================================================
   HOME BINDINGS
========================================================= */

function bindHome() {

  const form = document.querySelector("#heroSearch");

  if (form) {

    form.addEventListener("submit", (event) => {

      event.preventDefault();

      const input =
        document.querySelector("#heroSearchInput");

      const query =
        input.value.trim().toLowerCase();

      const filtered =
        products.filter((product) =>
          `${product.name} ${product.category}`
            .toLowerCase()
            .includes(query)
        );

      renderProducts(filtered);

      document
        .querySelector("#products")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    });

  }

  document
    .querySelectorAll("[data-search]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const query =
          button.dataset.search.toLowerCase();

        const filtered =
          products.filter((product) =>
            `${product.name} ${product.category}`
              .toLowerCase()
              .includes(query)
          );

        renderProducts(filtered);

        document
          .querySelector("#products")
          ?.scrollIntoView({
            behavior: "smooth"
          });

      });

    });


  document
    .querySelectorAll("[data-category]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll("[data-category]")
          .forEach((item) =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        const category =
          button.dataset.category;

        const filtered =
          category === "Semua"
            ? products
            : products.filter(
                (product) =>
                  product.category === category
              );

        renderProducts(filtered);

      });

    });


  document
    .querySelectorAll("[data-add]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        addToCart(
          Number(button.dataset.add)
        );

      });

    });

}

function renderProducts(list) {

  const grid =
    document.querySelector("#productGrid");

  const count =
    document.querySelector("#resultCount");

  if (!grid) return;

  grid.innerHTML =
    list.length
      ? list.map(productCard).join("")
      : `
        <div class="empty-inline">
          Material tidak ditemukan.
        </div>
      `;

  if (count) {
    count.textContent =
      `${list.length} material`;
  }

  grid
    .querySelectorAll("[data-add]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        addToCart(
          Number(button.dataset.add)
        );

      });

    });

}

/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

  const product =
    findProduct(productId);

  if (!product) return;

  const cart =
    getCart();

  const existing =
    cart.find(
      (item) =>
        item.productId === productId
    );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      productId,
      qty: 1
    });
  }

  saveCart(cart);

  toast(
    `${product.name} ditambahkan ke keranjang`
  );

  updateHeader();
}

function updateHeader() {

  const oldHeader =
    document.querySelector(".site-header");

  if (!oldHeader) return;

  const wrapper =
    oldHeader.parentElement;

  const newHeader =
    document.createRange().createContextualFragment(
      header()
    );

  oldHeader.replaceWith(
    newHeader.firstElementChild
  );
}

/* =========================================================
   PRODUCT BINDING
========================================================= */

function bindProduct() {

  const button =
    document.querySelector("#detailAdd");

  if (!button) return;

  button.addEventListener("click", () => {

    addToCart(
      Number(button.dataset.id)
    );

  });

}

/* =========================================================
   CART BINDING
========================================================= */

function bindCart() {

  document
    .querySelectorAll("[data-minus]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        changeQty(
          Number(button.dataset.minus),
          -1
        );

      });

    });


  document
    .querySelectorAll("[data-plus]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        changeQty(
          Number(button.dataset.plus),
          1
        );

      });

    });

}

function changeQty(productId, change) {

  const cart =
    getCart();

  const item =
    cart.find(
      (item) =>
        item.productId === productId
    );

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {

    const index =
      cart.indexOf(item);

    cart.splice(index, 1);
  }

  saveCart(cart);

  render();

  toast("Keranjang diperbarui");
}

/* =========================================================
   CHECKOUT BINDING
========================================================= */

function bindCheckout() {

  const form =
    document.querySelector("#checkoutForm");

  if (!form) return;


  const scheduleFields =
    document.querySelector("#scheduleFields");

  document
    .querySelectorAll(
      'input[name="deliveryType"]'
    )
    .forEach((radio) => {

      radio.addEventListener("change", () => {

        if (
          radio.value === "schedule" &&
          radio.checked
        ) {
          scheduleFields?.classList.add("show");
        }

        if (
          radio.value === "now" &&
          radio.checked
        ) {
          scheduleFields?.classList.remove("show");
        }

      });

    });


  form.addEventListener("submit", (event) => {

    event.preventDefault();

    createOrder(form);

  });

}

/* =========================================================
   ORDER DETAIL BINDING
========================================================= */

function bindOrderDetail() {

  document
    .querySelectorAll("[data-supplier-next]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        advanceSupplier(
          button.dataset.order,
          Number(button.dataset.supplierNext)
        );

      });

    });


  document
    .querySelectorAll("[data-hub-ready]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        prepareDelivery(
          button.dataset.hubReady
        );

      });

    });


  document
    .querySelectorAll("[data-delivery-start]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        startDelivery(
          button.dataset.deliveryStart
        );

      });

    });


  document
    .querySelectorAll("[data-delivery-done]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        completeDelivery(
          button.dataset.deliveryDone
        );

      });

    });

}

/* =========================================================
   SUPPLIER STATUS SIMULATION
========================================================= */

function advanceSupplier(orderNumber, supplierIndex) {

  const orders =
    getOrders();

  const order =
    orders.find(
      (item) =>
        item.number === orderNumber
    );

  if (!order) return;

  const supplier =
    order.suppliers[supplierIndex];

  if (!supplier) return;

  const nextStatus = {
    confirmed: "pickup",
    pickup: "transit",
    transit: "received"
  };

  supplier.status =
    nextStatus[supplier.status] ||
    supplier.status;

  if (
    order.suppliers.every(
      (item) =>
        item.status === "received"
    )
  ) {
    order.hubStatus = "ready";
  }

  saveOrders(orders);

  render();

  toast(
    `${supplier.name}: ${supplier.status}`
  );
}

/* =========================================================
   HUB
========================================================= */

function prepareDelivery(orderNumber) {

  const orders =
    getOrders();

  const order =
    orders.find(
      (item) =>
        item.number === orderNumber
    );

  if (!order) return;

  if (
    !order.suppliers.every(
      (supplier) =>
        supplier.status === "received"
    )
  ) {
    toast(
      "Masih ada supplier yang belum tiba di Hub."
    );

    return;
  }

  order.hubStatus = "consolidated";
  order.deliveryStatus = "ready";

  saveOrders(orders);

  render();

  toast(
    "Material sudah dikonsolidasikan di Hub."
  );
}

/* =========================================================
   DELIVERY
========================================================= */

function startDelivery(orderNumber) {

  const orders =
    getOrders();

  const order =
    orders.find(
      (item) =>
        item.number === orderNumber
    );

  if (!order) return;

  order.deliveryStatus = "out";

  saveOrders(orders);

  render();

  toast(
    "Material sedang dikirim ke proyek."
  );
}

function completeDelivery(orderNumber) {

  const orders =
    getOrders();

  const order =
    orders.find(
      (item) =>
        item.number === orderNumber
    );

  if (!order) return;

  order.deliveryStatus = "delivered";

  saveOrders(orders);

  render();

  toast(
    "Pesanan selesai."
  );
}

/* =========================================================
   ROUTER
========================================================= */

function render() {

  const app =
    document.querySelector("#app");

  const hash =
    location.hash || "#home";

  let content = "";

  if (hash === "#home" || hash === "#") {

    content = homePage();

  } else if (hash === "#products") {

    content = homePage();

  } else if (hash === "#cart") {

    content = cartPage();

  } else if (hash === "#checkout") {

    content = checkoutPage();

  } else if (hash === "#orders") {

    content = ordersPage();

  } else if (hash === "#tracking") {

    content = trackingPage();

  } else if (hash.startsWith("#product/")) {

    const id =
      hash.split("/")[1];

    content = productPage(id);

  } else if (hash.startsWith("#order/")) {

    const number =
      decodeURIComponent(
        hash.split("/").slice(1).join("/")
      );

    content =
      orderDetailPage(number);

  } else {

    content = homePage();

  }

  app.innerHTML = content;

  bindHome();
  bindProduct();
  bindCart();
  bindCheckout();
  bindOrderDetail();
}

/* =========================================================
   ROUTER LISTENER
========================================================= */

window.addEventListener(
  "hashchange",
  render
);

render();