import { renderBrandLogo } from '../../components/common/brand.js';
import './register.css';

const friendlyError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  if (/email address not authorized|not authorized/.test(message)) return 'Server email Supabase belum diatur untuk mengirim ke alamat publik. Admin perlu mengaktifkan SMTP khusus sebelum pendaftaran umum dibuka.';
  if (/already registered|user already exists/.test(message)) return 'Email ini sudah terdaftar. Silakan masuk atau gunakan pemulihan password.';
  if (/invalid login credentials/.test(message)) return 'Email atau password belum cocok. Periksa kembali atau gunakan Lupa password.';
  if (/password.*(weak|short)|weak password/.test(message)) return 'Password terlalu mudah ditebak. Gunakan minimal 8 karakter.';
  if (/rate limit|too many requests|over_email_send_rate_limit/.test(message)) return 'Permintaan terlalu sering. Tunggu sebentar sebelum mencoba lagi.';
  if (/invalid email/.test(message)) return 'Format email belum benar. Periksa kembali alamat email Anda.';
  if (/provider.*(not enabled|disabled)|unsupported provider/.test(message)) return 'Metode masuk ini belum diaktifkan pada Supabase Pluits. Silakan gunakan email atau Google jika tersedia.';
  return error?.message || 'Permintaan belum berhasil. Periksa koneksi lalu coba lagi.';
};

export function mountAuthPage({ supabase, mode = 'login', onAuthenticated }) {
  const app = document.querySelector('#app');
  if (!app) return;
  const appBase = new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
  const safeMode = ['login', 'register', 'forgot', 'reset', 'phone'].includes(mode) ? mode : 'login';
  const isRegister = safeMode === 'register';
  const isForgot = safeMode === 'forgot';
  const isReset = safeMode === 'reset';
  const isPhone = safeMode === 'phone';
  const title = isRegister ? 'Daftar gratis' : isForgot ? 'Pulihkan akun' : isReset ? 'Buat password baru' : isPhone ? 'Masuk dengan nomor telepon' : 'Masuk ke Pluits';
  const intro = isRegister ? 'Buat akun untuk mulai menjelajahi dan terhubung di PLUITS.' : isForgot ? 'Masukkan alamat email yang terhubung dengan akunmu.' : isReset ? 'Pilih password baru untuk akunmu.' : isPhone ? 'Masuk menggunakan nomor telepon.' : 'Selamat datang kembali. Masuk untuk melanjutkan aktivitasmu di PLUITS.';
  const switcher = isForgot || isReset || isPhone ? '' : '<nav class="pl-auth-tabs" aria-label="Jenis akses"><a href="#/account/auth?mode=login" class="' + (!isRegister ? 'is-active' : '') + '">Masuk</a><a href="#/account/auth?mode=register" class="' + (isRegister ? 'is-active' : '') + '">Daftar</a></nav>';
  let fields = '';
  if (isPhone) {
    fields = '<div class="pl-auth-field"><label for="pl-auth-phone">Nomor telepon</label><input id="pl-auth-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+628123456789" required></div>';
  } else if (isRegister) {
    fields = '<div class="pl-auth-field"><label for="pl-auth-name">Nama tampilan</label><input id="pl-auth-name" name="full_name" type="text" autocomplete="name" maxlength="80" minlength="2" placeholder="Nama yang ingin ditampilkan" required></div>' +
      '<div class="pl-auth-field"><label for="pl-auth-email">Alamat email</label><input id="pl-auth-email" name="email" type="email" autocomplete="email" inputmode="email" autocapitalize="none" spellcheck="false" placeholder="nama@email.com" required></div>' +
      '<div class="pl-auth-field"><label for="pl-auth-password">Password</label><div class="pl-register-password-wrap"><input id="pl-auth-password" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="Minimal 8 karakter" required><button class="pl-register-show" type="button" data-toggle-password aria-label="Tampilkan password" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>' +
      '<small class="pl-register-help">Buat password minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol. Hindari nama atau tanggal lahir.</small>' +
      '<label class="pl-register-consent"><input name="terms" type="checkbox" required><span>Saya menyetujui <a href="#/terms">Ketentuan Layanan</a> dan telah membaca <a href="#/privacy">Kebijakan Privasi</a> Pluits.</span></label>';
  } else if (isReset) {
    fields = '<div class="pl-auth-field"><label for="pl-auth-password">Password baru</label><div class="pl-register-password-wrap"><input id="pl-auth-password" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="Minimal 8 karakter" required><button class="pl-register-show" type="button" data-toggle-password aria-label="Tampilkan password" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div><small class="pl-register-help">Gunakan minimal 8 karakter, gabungkan huruf besar-kecil, angka, dan simbol. Jangan gunakan password lama.</small>';
  } else {
    fields = '<div class="pl-auth-field"><label for="pl-auth-email">' + (isForgot ? 'Alamat email' : 'Email, nomor HP, atau nama pengguna') + '</label><input id="pl-auth-email" name="email" type="' + (isForgot ? 'email' : 'text') + '" autocomplete="' + (isForgot ? 'email' : 'username') + '" inputmode="' + (isForgot ? 'email' : 'text') + '" autocapitalize="none" spellcheck="false" placeholder="' + (isForgot ? 'nama@email.com' : 'Email') + '" required></div>' +
      (isForgot ? '' : '<div class="pl-auth-field"><label for="pl-auth-password">Password</label><div class="pl-register-password-wrap"><input id="pl-auth-password" name="password" type="password" autocomplete="current-password" placeholder="Password akun" required><button class="pl-register-show" type="button" data-toggle-password aria-label="Tampilkan password" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>');
  }
  const buttonText = isRegister ? 'Buat akun' : isForgot ? 'Kirim tautan pemulihan' : isReset ? 'Simpan password baru' : isPhone ? 'Kirim kode OTP' : 'Masuk';
  app.innerHTML = '<div class="pl-register-page pl-auth-page pl-auth-mode-' + safeMode + '"><header class="pl-register-header">' +
    renderBrandLogo({ className: 'pl-register-logo pl-register-brand', size: 29, label: 'PLUITS, kembali ke beranda', wordmark: true }) +
    '<a class="pl-register-back" href="#/">Kembali ke beranda</a></header><main class="pl-register-main">' +
    '<aside class="pl-register-story"><span class="pl-register-eyebrow">SATU AKUN · BANYAK KEMUNGKINAN</span><h1>Mulai terhubung dengan dunia di sekitarmu.</h1>' +
    '<p>Temukan tempat, kenali komunitas, bagikan pengalaman, dan bangun identitasmu di Pluits.</p><ul><li><span>✓</span> Satu akun untuk seluruh pengalaman Pluits</li><li><span>✓</span> Kendali privasi ada di tanganmu</li><li><span>✓</span> Profil bisa dilengkapi kapan saja</li></ul></aside>' +
    '<section class="pl-register-card" aria-labelledby="pl-auth-title"><div class="pl-register-card-head"><span class="pl-register-step">AKUN PLUITS</span><h2 id="pl-auth-title">' + title + '</h2><p>' + intro + '</p></div>' +
    switcher + '<form id="pl-auth-form" class="pl-register-form" novalidate>' + fields +
    '<p id="pl-auth-message" class="pl-register-message" role="status" aria-live="polite"></p><button class="pl-register-submit" type="submit">' + buttonText + '</button></form>' +
    ((!isForgot && !isReset && !isPhone) ? '<div class="pl-auth-social"><div class="pl-auth-divider"><span>atau masuk dengan</span></div><div class="pl-auth-provider-grid"><button type="button" class="pl-auth-provider" data-provider="google"><svg class="pl-auth-provider-icon pl-auth-google" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"/></svg><span>Google</span></button><button type="button" class="pl-auth-provider is-unavailable" data-provider="facebook" disabled aria-disabled="true"><svg class="pl-auth-provider-icon pl-auth-facebook" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.4V13h2.8v8h3.3Z"/></svg><span>Facebook</span><small class="pl-auth-provider-status">Sedang dikembangkan</small></button><button type="button" class="pl-auth-provider is-unavailable" data-provider="twitter" disabled aria-disabled="true"><svg class="pl-auth-provider-icon pl-auth-x" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 17.9h1.7L7.3 4H5.5l12.3 15.9Z"/></svg><span>X</span><small class="pl-auth-provider-status">Sedang dikembangkan</small></button><button type="button" class="pl-auth-provider is-unavailable" data-provider="linkedin_oidc" disabled aria-disabled="true"><svg class="pl-auth-provider-icon pl-auth-linkedin" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.6v11.5H3.4V9Zm5.8 0h3.4v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.5v6.3H17v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.2V9Z"/></svg><span>LinkedIn</span><small class="pl-auth-provider-status">Sedang dikembangkan</small></button></div><span class="pl-auth-phone is-unavailable" aria-disabled="true">Masuk dengan nomor telepon <small class="pl-auth-inline-status">Sedang dikembangkan</small></span><p class="pl-auth-social-note">Dengan masuk, kamu menyetujui <a href="#/terms">Ketentuan Layanan</a> dan <a href="#/privacy">Kebijakan Privasi</a>.</p><button type="button" class="pl-auth-invite" data-invite><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13V2m0 0L6 6m4-4 4 4M3 11v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>Ajak teman bergabung</button></div>' : '') +
    '<section id="pl-auth-pending" class="pl-register-pending" aria-live="polite" hidden><div class="pl-register-mail-icon" aria-hidden="true">✉</div><span class="pl-register-step">SATU LANGKAH LAGI</span><h3>Periksa email kamu</h3><p>Permintaan konfirmasi akun dikirim untuk:</p><strong id="pl-auth-pending-email"></strong><ol><li>Buka email dari Pluits/Supabase.</li><li>Tekan tombol konfirmasi.</li><li>Kamu akan kembali ke Pluits.</li></ol><p id="pl-auth-pending-message" class="pl-register-message" role="status"></p><button id="pl-auth-resend" class="pl-register-secondary" type="button">Kirim ulang email</button></section>' +
    (isRegister ? '<p class="pl-register-login">Sudah punya akun? <a href="#/account/auth?mode=login">Masuk</a></p>' : isForgot || isReset ? '<p class="pl-register-login"><a href="#/account/auth?mode=login">Kembali ke Masuk</a></p>' : '<p class="pl-register-login"><a href="#/account/auth?mode=forgot">Lupa password?</a></p><p class="pl-register-login">Belum punya akun? <a href="#/account/auth?mode=register">Daftar</a></p>') +
    '<p class="pl-register-security">Privasi dan keamanan akun tetap dalam kendalimu.</p></section></main><footer class="pl-register-footer"><span class="pl-register-copyright">© 2026 PLUITS. All rights reserved.</span></footer></div>';

  const identityInput = app.querySelector('#pl-auth-email');
  if (identityInput && !isForgot && !isRegister) {
    const examples = ['Email', '+628123456789', '@nama_pengguna'];
    let exampleIndex = 0, characterIndex = 0, deleting = false;
    const typeNext = () => {
      if (!identityInput.isConnected || identityInput.value) return;
      const word = examples[exampleIndex];
      characterIndex += deleting ? -1 : 1;
      identityInput.placeholder = word.slice(0, characterIndex);
      let delay = deleting ? 48 : 92;
      if (!deleting && characterIndex >= word.length) { deleting = true; delay = 1050; }
      else if (deleting && characterIndex <= 0) { deleting = false; exampleIndex = (exampleIndex + 1) % examples.length; delay = 260; }
      window.setTimeout(typeNext, delay);
    };
    window.setTimeout(typeNext, 350);
    identityInput.addEventListener('input', () => { if (identityInput.value) identityInput.placeholder = 'Email / +628123456789 / @nama_pengguna'; });
  }
  const form = app.querySelector('#pl-auth-form');
  const message = app.querySelector('#pl-auth-message');
  const submit = form.querySelector('[type="submit"]');
  const showMessage = (target, text, type = 'error') => { target.textContent = text; target.className = 'pl-register-message is-' + type; };
  app.querySelectorAll('[data-toggle-password]').forEach((toggle) => toggle.addEventListener('click', (event) => {
    const button = event.currentTarget, input = form.querySelector('input[name="password"]');
    const reveal = input.type === 'password'; input.type = reveal ? 'text' : 'password';
    button.setAttribute('aria-label', reveal ? 'Sembunyikan password' : 'Tampilkan password');
    button.setAttribute('aria-pressed', String(reveal));
  }));
  app.querySelector('[data-invite]')?.addEventListener('click', async () => {
    const inviteUrl = new URL('#/account/auth?mode=register', appBase).toString();
    const inviteText = 'Bergabunglah dengan PLUITS — satu akun untuk komunitas, tempat, dan usaha lokal. ' + inviteUrl;
    try {
      if (navigator.share) await navigator.share({ title: 'Undangan PLUITS', text: 'Yuk bergabung dengan PLUITS.', url: inviteUrl });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(inviteText); showMessage(message, 'Tautan undangan berhasil disalin.', 'success'); }
      else showMessage(message, 'Salin tautan ini untuk mengundang teman: ' + inviteUrl, 'info');
    } catch (error) { if (error?.name !== 'AbortError') showMessage(message, 'Undangan belum dapat dibagikan dari perangkat ini.', 'error'); }
  });
  app.querySelectorAll('[data-provider]:not(:disabled)').forEach((button) => button.addEventListener('click', async () => {
    button.disabled = true;
    try { const { error } = await supabase.auth.signInWithOAuth({ provider: button.dataset.provider, options: { redirectTo: appBase } }); if (error) throw error; }
    catch (error) { showMessage(message, friendlyError(error)); button.disabled = false; }
  }));
  const resend = app.querySelector('#pl-auth-resend');
  let pendingEmail = '';
  let phoneOtpSent = false;
  let pendingPhone = '';
  resend?.addEventListener('click', async () => {
    if (!pendingEmail || resend.disabled) return;
    resend.disabled = true; resend.textContent = 'Meminta pengiriman…';
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail, options: { emailRedirectTo: appBase } });
      if (error) throw error;
      showMessage(app.querySelector('#pl-auth-pending-message'), 'Permintaan diterima server. Email belum tentu langsung masuk; periksa Inbox dan Spam.', 'success');
      resend.textContent = 'Permintaan terkirim';
    } catch (error) {
      showMessage(app.querySelector('#pl-auth-pending-message'), friendlyError(error));
      resend.disabled = false; resend.textContent = 'Coba kirim ulang';
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); message.textContent = '';
    if (!form.reportValidity()) return;
    const values = new FormData(form), email = String(values.get('email') || '').trim().toLowerCase(), password = String(values.get('password') || '');
    const fullName = String(values.get('full_name') || '').trim();
    if (isRegister && fullName.length < 2) { showMessage(message, 'Nama tampilan minimal 2 karakter.'); return; }
    if ((isRegister || isReset) && password.length < 8) { showMessage(message, 'Password minimal 8 karakter.'); return; }
    submit.disabled = true; submit.textContent = 'Memproses…';
    showMessage(message, 'Menghubungi sistem akun Pluits…', 'info');
    try {
      if (isPhone) {
        if (!phoneOtpSent) {
          pendingPhone = String(values.get('phone') || '').replace(/[\s()-]/g, '');
          if (!/^\+[1-9]\d{7,14}$/.test(pendingPhone)) throw new Error('Gunakan format internasional, contoh +628123456789.');
          const { error } = await supabase.auth.signInWithOtp({ phone: pendingPhone });
          if (error) throw error;
          phoneOtpSent = true;
          const phoneField = form.querySelector('.pl-auth-field');
          phoneField.insertAdjacentHTML('afterend', '<div class="pl-auth-field"><label for="pl-auth-otp">Kode verifikasi</label><input id="pl-auth-otp" name="otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Masukkan kode OTP" required></div>');
          showMessage(message, 'Kode OTP diminta. Periksa SMS di nomor telepon Anda.', 'success');
          submit.textContent = 'Verifikasi dan masuk';
          submit.disabled = false;
          return;
        }
        const token = String(values.get('otp') || '').trim();
        if (!token) throw new Error('Masukkan kode OTP yang dikirim melalui SMS.');
        const { error } = await supabase.auth.verifyOtp({ phone: pendingPhone, token, type: 'sms' });
        if (error) throw error;
        onAuthenticated?.();
      } else if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: appBase } });
        if (error) throw error;
        if (data.session) { onAuthenticated?.(); return; }
        pendingEmail = email;
        app.querySelector('#pl-auth-pending-email').textContent = email;
        form.hidden = true; app.querySelector('#pl-auth-pending').hidden = false; message.textContent = '';
      } else if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: appBase + '?auth=reset' });
        if (error) throw error;
        showMessage(message, 'Jika email tersebut terdaftar, tautan pemulihan akan dikirim. Periksa Inbox dan Spam.', 'success');
        submit.textContent = 'Permintaan terkirim';
      } else if (isReset) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        showMessage(message, 'Password berhasil diperbarui. Silakan masuk dengan password baru.', 'success');
        submit.textContent = 'Password diperbarui';
        setTimeout(() => { if (location.hash.includes('/account/auth')) location.hash = '#/account/auth?mode=login'; }, 1400);
      } else {
        const identity = String(values.get('email') || '').trim();
        const phone = identity.replace(/[\s()-]/g, '');
        const isPhoneIdentity = /^\+[1-9]\d{7,14}$/.test(phone);
        if (!isPhoneIdentity && !identity.includes('@')) throw new Error('Login dengan nama pengguna sedang disiapkan. Untuk saat ini, gunakan email atau nomor HP.');
        const credentials = isPhoneIdentity ? { phone, password } : { email: identity.toLowerCase(), password };
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        onAuthenticated?.();
      }
    } catch (error) {
      showMessage(message, friendlyError(error));
      submit.disabled = false; submit.textContent = isRegister ? 'Buat akun' : isForgot ? 'Kirim tautan pemulihan' : isReset ? 'Simpan password baru' : isPhone ? (phoneOtpSent ? 'Verifikasi dan masuk' : 'Kirim kode OTP') : 'Masuk';
    }
  });
}
