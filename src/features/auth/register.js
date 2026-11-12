import { renderBrandLogo } from '../../components/common/brand.js';
import './register.css';

const copyError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  if (/email address not authorized|not authorized/.test(message)) return 'Server email Supabase belum diatur untuk mengirim ke alamat publik. Admin perlu mengaktifkan SMTP khusus sebelum pendaftaran umum dibuka.';
  if (/already registered|user already exists/.test(message)) return 'Email ini mungkin sudah terdaftar. Coba masuk atau gunakan fitur pemulihan password.';
  if (/password.*(weak|short)|weak password/.test(message)) return 'Password terlalu mudah ditebak. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.';
  if (/rate limit|too many requests|over_email_send_rate_limit/.test(message)) return 'Permintaan email terlalu sering. Tunggu sebentar sebelum mencoba lagi.';
  if (/invalid email/.test(message)) return 'Format email belum benar. Periksa kembali alamat email Anda.';
  return error?.message || 'Pendaftaran belum berhasil. Periksa koneksi lalu coba lagi.';
};

export function mountRegisterPage({ supabase, onAuthenticated }) {
  const app = document.querySelector('#app');
  if (!app) return;
  const appBase = new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
  app.innerHTML = '<div class="pl-register-page">' +
    '<header class="pl-register-header"><a class="pl-register-logo" href="#/" aria-label="Pluits, kembali ke beranda">' +
    renderBrandLogo({ className: 'pl-register-brand', size: 34, label: 'Pluits' }) +
    '</a><a class="pl-register-back" href="#/">Kembali ke beranda</a></header>' +
    '<main class="pl-register-main">' +
    '<aside class="pl-register-story"><span class="pl-register-eyebrow">SATU AKUN · BANYAK KEMUNGKINAN</span>' +
    '<h1>Mulai terhubung dengan dunia di sekitarmu.</h1>' +
    '<p>Temukan tempat, kenali komunitas, bagikan pengalaman, dan bangun identitasmu di Pluits.</p>' +
    '<ul><li><span aria-hidden="true">✓</span> Satu akun untuk seluruh pengalaman Pluits</li>' +
    '<li><span aria-hidden="true">✓</span> Kendali privasi ada di tanganmu</li>' +
    '<li><span aria-hidden="true">✓</span> Profil bisa dilengkapi kapan saja</li></ul></aside>' +
    '<section class="pl-register-card" aria-labelledby="pl-register-title">' +
    '<div class="pl-register-card-head"><span class="pl-register-step">BUAT AKUN PLUITS</span>' +
    '<h2 id="pl-register-title">Daftar gratis</h2>' +
    '<p>Mulai dengan tiga informasi dasar. Detail profil bisa ditambahkan nanti.</p></div>' +
    '<form id="pl-register-form" class="pl-register-form" novalidate>' +
    '<label for="pl-register-name">Nama tampilan</label>' +
    '<input id="pl-register-name" name="full_name" type="text" autocomplete="name" maxlength="80" minlength="2" placeholder="Nama yang ingin ditampilkan" required>' +
    '<label for="pl-register-email">Alamat email</label>' +
    '<input id="pl-register-email" name="email" type="email" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" placeholder="nama@email.com" required>' +
    '<label for="pl-register-password">Password</label>' +
    '<div class="pl-register-password-wrap"><input id="pl-register-password" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="Minimal 8 karakter" aria-describedby="pl-register-password-help" required>' +
    '<button class="pl-register-show" type="button" data-toggle-password aria-label="Tampilkan password" aria-pressed="false">Lihat</button></div>' +
    '<small id="pl-register-password-help" class="pl-register-help">Gunakan minimal 8 karakter. Jangan gunakan password yang sama dengan akun penting lainnya.</small>' +
    '<label class="pl-register-consent"><input name="terms" type="checkbox" required>' +
    '<span>Saya menyetujui <a href="#/terms">Ketentuan Layanan</a> dan telah membaca <a href="#/privacy">Kebijakan Privasi</a> Pluits.</span></label>' +
    '<p id="pl-register-error" class="pl-register-message" role="status" aria-live="polite"></p>' +
    '<button class="pl-register-submit" type="submit">Buat akun</button></form>' +
    '<section id="pl-register-pending" class="pl-register-pending" aria-live="polite" hidden>' +
    '<div class="pl-register-mail-icon" aria-hidden="true">✉</div><span class="pl-register-step">SATU LANGKAH LAGI</span>' +
    '<h3>Periksa email kamu</h3><p>Kami sudah meminta Supabase mengirim tautan konfirmasi ke:</p>' +
    '<strong id="pl-register-pending-email"></strong><ol><li>Buka email dari Pluits/Supabase.</li>' +
    '<li>Tekan tombol konfirmasi di dalam email.</li><li>Kamu akan kembali ke Pluits untuk melanjutkan.</li></ol>' +
    '<p id="pl-register-resend-status" class="pl-register-message" role="status"></p>' +
    '<button id="pl-register-resend" class="pl-register-secondary" type="button">Kirim ulang email</button>' +
    '<button id="pl-register-change-email" class="pl-register-text-button" type="button">Gunakan email lain</button></section>' +
    '<p class="pl-register-login">Sudah punya akun? <a href="#/account/login">Masuk</a></p>' +
    '<p class="pl-register-security">Pendaftaran dilindungi oleh sistem autentikasi Supabase.</p></section></main>' +
    '<footer class="pl-register-footer">PLUITS · Akunmu, kendalimu.</footer></div>';

  const form = app.querySelector('#pl-register-form');
  const submit = form.querySelector('[type="submit"]');
  const message = app.querySelector('#pl-register-error');
  const pending = app.querySelector('#pl-register-pending');
  const resend = app.querySelector('#pl-register-resend');
  const resendStatus = app.querySelector('#pl-register-resend-status');
  let pendingEmail = '';

  const showMessage = (target, text, type = 'error') => {
    target.textContent = text;
    target.className = 'pl-register-message is-' + type;
  };

  app.querySelector('[data-toggle-password]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const input = app.querySelector('#pl-register-password');
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Sembunyikan' : 'Lihat';
    button.setAttribute('aria-label', reveal ? 'Sembunyikan password' : 'Tampilkan password');
    button.setAttribute('aria-pressed', String(reveal));
  });

  app.querySelector('#pl-register-change-email')?.addEventListener('click', () => {
    pending.hidden = true;
    form.hidden = false;
    message.textContent = '';
    app.querySelector('#pl-register-email')?.focus();
  });

  resend?.addEventListener('click', async () => {
    if (!pendingEmail || resend.disabled) return;
    resend.disabled = true;
    resend.textContent = 'Meminta pengiriman…';
    showMessage(resendStatus, 'Menghubungi server email Pluits…', 'info');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: { emailRedirectTo: appBase }
      });
      if (error) throw error;
      showMessage(resendStatus, 'Permintaan pengiriman diterima server. Email belum tentu langsung masuk; periksa Inbox, Spam, dan Promosi.', 'success');
      resend.textContent = 'Permintaan terkirim';
    } catch (error) {
      showMessage(resendStatus, copyError(error));
      resend.disabled = false;
      resend.textContent = 'Coba kirim ulang';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const fullName = String(values.get('full_name') || '').trim();
    const email = String(values.get('email') || '').trim().toLowerCase();
    const password = String(values.get('password') || '');
    if (fullName.length < 2) {
      showMessage(message, 'Nama tampilan minimal 2 karakter.');
      app.querySelector('#pl-register-name')?.focus();
      return;
    }
    if (password.length < 8) {
      showMessage(message, 'Password minimal 8 karakter.');
      app.querySelector('#pl-register-password')?.focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Membuat akun…';
    showMessage(message, 'Mengirim permintaan pendaftaran dengan aman…', 'info');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: appBase }
      });
      if (error) throw error;
      if (data.session) {
        onAuthenticated?.();
        return;
      }
      pendingEmail = email;
      app.querySelector('#pl-register-pending-email').textContent = email;
      form.hidden = true;
      pending.hidden = false;
      message.textContent = '';
      resend.disabled = false;
      resend.textContent = 'Kirim ulang email';
    } catch (error) {
      showMessage(message, copyError(error));
      submit.disabled = false;
      submit.textContent = 'Coba lagi';
    }
  });
}
