import { store, money } from '../../app/store.js';
import { shell, icon, toast } from '../../app/ui.js';

export function cart() {
  const items = store.getCart();
  const total = store.cartTotal();

  const content = items.length
    ? `<div class="section-heading compact">
        <span class="section-kicker">PESANAN</span>
        <h1>Keranjang</h1>
        <p>${items.length} jenis barang dalam keranjang</p>
      </div>
      <div class="cart-layout">
        <div class="cart-list">
          ${items.map(item => `<article class="cart-item">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="cart-item-info">
              <b>${item.title}</b>
              <span>${item.provider || 'Mitra Bali Bagus'}</span>
              <strong>Rp ${money(item.price)} <small>/ ${item.unit || 'item'}</small></strong>
            </div>
            <div class="cart-qty" aria-label="Jumlah barang">
              <button type="button" data-minus="${item.id}" aria-label="Kurangi jumlah">−</button>
              <b>${item.quantity}</b>
              <button type="button" data-plus="${item.id}" aria-label="Tambah jumlah">+</button>
            </div>
            <button class="cart-remove" type="button" data-remove="${item.id}">Hapus</button>
          </article>`).join('')}
        </div>
        <aside class="summary-card">
          <h3>Ringkasan pesanan</h3>
          <div><span>Subtotal barang</span><b>Rp ${money(total)}</b></div>
          <div><span>Pengiriman</span><span>Dihitung saat checkout</span></div>
          <hr>
          <div class="summary-total"><span>Total sementara</span><strong>Rp ${money(total)}</strong></div>
          <a class="primary-button wide-button" href="#/checkout">Lanjut checkout ${icon.arrow}</a>
          <p>Biaya dan pilihan pengiriman dikonfirmasi berdasarkan alamat serta jenis muatan.</p>
          <a class="continue-shopping" href="#/material">← Lanjut belanja</a>
        </aside>
      </div>`
    : `<div class="empty-state large">
        <h1>Keranjang masih kosong</h1>
        <p>Tambahkan material, jasa, atau layanan logistik yang Anda perlukan.</p>
        <a class="primary-button" href="#/material">Jelajahi material</a>
      </div>`;

  const html = shell(content, 'Keranjang');

  queueMicrotask(() => {
    document.querySelectorAll('[data-plus]').forEach(button => {
      button.onclick = () => {
        const item = store.getCart().find(x => x.id === button.dataset.plus);
        if (!item) return;
        store.updateCart(item.id, item.quantity + 1);
        window.dispatchEvent(new Event('bld:cart-updated'));
        location.hash = '#/cart';
      };
    });
    document.querySelectorAll('[data-minus]').forEach(button => {
      button.onclick = () => {
        const item = store.getCart().find(x => x.id === button.dataset.minus);
        if (!item) return;
        if (item.quantity <= 1) {
          store.removeFromCart(item.id);
          toast('Barang dihapus dari keranjang');
        } else {
          store.updateCart(item.id, item.quantity - 1);
        }
        window.dispatchEvent(new Event('bld:cart-updated'));
        location.hash = '#/cart';
      };
    });
    document.querySelectorAll('[data-remove]').forEach(button => {
      button.onclick = () => {
        store.removeFromCart(button.dataset.remove);
        toast('Barang dihapus dari keranjang');
        window.dispatchEvent(new Event('bld:cart-updated'));
        location.hash = '#/cart';
      };
    });
  });

  return html;
}
