const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const phoneHint='Gunakan format internasional, contoh +6281234567890.';
export async function accountSecurityPage(db,user){
 const {data:profile,error}=await db.from('user_profiles').select('username,visibility,preferred_language').eq('id',user.id).single();
 if(error)throw error;
 const factors=await db.auth.mfa.listFactors();
 if(factors.error)throw factors.error;
 const verified=(factors.data?.totp||[]).filter(x=>x.status==='verified');
 const {data:{user:authUser}}=await db.auth.getUser();
 return `<div class="ua-page-heading"><div><span class="ua-eyebrow">AKUN & KEAMANAN</span><h1>Pengaturan akun</h1><p>Kelola identitas, privasi, keamanan masuk, bahasa, dan izin perangkat.</p></div><a class="ua-outline" href="#/account/settings">Kembali ke pengaturan</a></div>
 <div class="ua-security-grid">
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">IDENTITAS & PRIVASI</span><h2>Profil akun</h2>
   <form id="ua-identity-form" class="ua-security-form">
    <label>Username<input name="username" minlength="3" maxlength="30" pattern="[a-z0-9._]{3,30}" value="${esc(profile.username)}" required><small>3–30 karakter, huruf kecil, angka, titik, atau garis bawah.</small></label>
    <label>Visibilitas akun<select name="visibility"><option value="public" ${profile.visibility==='public'?'selected':''}>Publik</option><option value="private" ${profile.visibility==='private'?'selected':''}>Pribadi</option></select><small>Akun pribadi memerlukan persetujuan untuk pengikut baru.</small></label>
    <label>Bahasa aplikasi<select name="preferred_language"><option value="id" ${(profile.preferred_language||'id')==='id'?'selected':''}>Bahasa Indonesia</option><option value="en" ${profile.preferred_language==='en'?'selected':''}>English</option></select><small>Preferensi disimpan di akun. Terjemahan seluruh layar masih dalam tahap penerapan.</small></label>
    <button class="ua-primary" type="submit">Simpan identitas</button><p class="ua-form-note" id="ua-identity-note" role="status"></p>
   </form>
  </section>
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">KATA SANDI</span><h2>Ubah password</h2>
   <form id="ua-password-form" class="ua-security-form">
    <label>Password baru<input type="password" name="password" minlength="8" autocomplete="new-password" required></label>
    <label>Ulangi password baru<input type="password" name="confirm_password" minlength="8" autocomplete="new-password" required></label>
    <button class="ua-primary" type="submit">Perbarui password</button><p class="ua-form-note" id="ua-password-note" role="status"></p>
   </form>
  </section>
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">NOMOR TELEPON</span><h2>Tambahkan nomor HP</h2>
   <p class="ua-security-copy">${authUser?.phone? 'Nomor terdaftar: '+esc(authUser.phone):'Nomor HP belum ditambahkan.'} ${authUser?.phone_confirmed_at?'· Terverifikasi':''}</p>
   <form id="ua-phone-form" class="ua-security-form">
    <label>Nomor telepon<input name="phone" type="tel" inputmode="tel" placeholder="+6281234567890" value="${esc(authUser?.phone||'')}" required><small>${phoneHint}</small></label>
    <button class="ua-primary" type="submit">Kirim kode verifikasi</button><p class="ua-form-note" id="ua-phone-note" role="status"></p>
   </form>
   <form id="ua-phone-verify-form" class="ua-security-form" hidden>
    <label>Kode SMS<input name="token" inputmode="numeric" autocomplete="one-time-code" minlength="6" maxlength="8" required></label>
    <button class="ua-primary" type="submit">Verifikasi nomor</button>
   </form>
  </section>
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">VERIFIKASI DUA LANGKAH</span><h2>Authenticator (2FA)</h2>
   <p class="ua-security-copy">Gunakan aplikasi authenticator untuk menambah lapisan keamanan saat masuk.</p>
   <div id="ua-mfa-state">${verified.length?'<p class="ua-security-success">Authenticator aktif pada '+verified.length+' perangkat.</p>':'<p>Verifikasi dua langkah belum diaktifkan.</p>'}</div>
   <div id="ua-mfa-enroll" hidden></div>
   <button class="ua-primary" type="button" id="ua-mfa-start" ${verified.length?'hidden':''}>Aktifkan 2FA</button>
   ${verified.map(f=>'<button type="button" class="ua-outline ua-mfa-remove" data-factor-id="'+esc(f.id)+'">Nonaktifkan authenticator</button>').join('')}
   <p class="ua-form-note" id="ua-mfa-note" role="status"></p>
  </section>
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">IZIN PERANGKAT</span><h2>Lokasi, foto & video</h2>
   <p class="ua-security-copy">Pluits meminta izin saat fitur terkait digunakan. Anda dapat mengubah izin dari pengaturan situs di Android/browser.</p>
   <button class="ua-outline" type="button" id="ua-location-permission">Periksa izin lokasi</button><p id="ua-location-note" class="ua-form-note" role="status"></p>
   <label class="ua-security-file">Uji akses foto/video perangkat<input type="file" id="ua-media-permission" accept="image/*,video/*" multiple><small>Pemilih media bawaan perangkat akan dibuka. File tidak diunggah atau disimpan oleh halaman ini.</small></label>
   <p id="ua-media-note" class="ua-form-note" role="status"></p>
  </section>
  <section class="ua-panel ua-security-card"><span class="ua-eyebrow">VERIFIKASI OPSIONAL</span><h2>Verifikasi akun</h2>
   <p class="ua-security-copy">Tanda verifikasi pribadi belum dibuka. Sistem saat ini baru memiliki proses pengajuan untuk profil profesional dan toko, belum proses pemeriksaan identitas akun personal beserta panel peninjau dan bandingnya.</p>
   <span class="ua-security-stage">Belum tersedia — tidak ada tanda verifikasi yang akan diberikan otomatis.</span>
  </section>
 </div>`;
}
export function bindAccountSecurity(db,user){
 const identity=document.querySelector('#ua-identity-form');
 identity?.addEventListener('submit',async event=>{
  event.preventDefault();const data=new FormData(identity),username=String(data.get('username')).trim().toLowerCase(),note=document.querySelector('#ua-identity-note'),button=identity.querySelector('button');
  if(!/^[a-z0-9._]{3,30}$/.test(username)){note.textContent='Format username tidak valid.';return;}
  button.disabled=true;note.textContent='Menyimpan…';
  const {error}=await db.from('user_profiles').update({username,visibility:String(data.get('visibility')),preferred_language:String(data.get('preferred_language'))}).eq('id',user.id);
  button.disabled=false;note.textContent=error?(error.code==='23505'?'Username sudah digunakan.':error.message):'Identitas dan preferensi berhasil disimpan.';
 });
 const password=document.querySelector('#ua-password-form');
 password?.addEventListener('submit',async event=>{
  event.preventDefault();const data=new FormData(password),next=String(data.get('password')),note=document.querySelector('#ua-password-note'),button=password.querySelector('button');
  if(next!==String(data.get('confirm_password'))){note.textContent='Konfirmasi password tidak sama.';return;}
  button.disabled=true;const {error}=await db.auth.updateUser({password:next});button.disabled=false;note.textContent=error?error.message:'Password berhasil diperbarui.';if(!error)password.reset();
 });
 const phone=document.querySelector('#ua-phone-form');
 phone?.addEventListener('submit',async event=>{
  event.preventDefault();const value=String(new FormData(phone).get('phone')).trim(),note=document.querySelector('#ua-phone-note'),button=phone.querySelector('button');
  if(!/^\+[1-9]\d{7,14}$/.test(value)){note.textContent='Gunakan format internasional, contoh +6281234567890.';return;}
  button.disabled=true;const {error}=await db.auth.updateUser({phone:value});button.disabled=false;
  if(error){note.textContent=error.message;return;}
  note.textContent='Kode verifikasi dikirim jika penyedia SMS tersedia.';document.querySelector('#ua-phone-verify-form').hidden=false;
 });
 document.querySelector('#ua-phone-verify-form')?.addEventListener('submit',async event=>{
  event.preventDefault();const token=String(new FormData(event.currentTarget).get('token')).trim(),phoneValue=String(document.querySelector('#ua-phone-form [name=phone]').value).trim(),note=document.querySelector('#ua-phone-note');
  const {error}=await db.auth.verifyOtp({phone:phoneValue,token,type:'sms'});note.textContent=error?error.message:'Nomor HP berhasil diverifikasi.';
 });
 document.querySelector('#ua-mfa-start')?.addEventListener('click',async button=>{
  const node=document.querySelector('#ua-mfa-note'),start=document.querySelector('#ua-mfa-start');start.disabled=true;node.textContent='Menyiapkan authenticator…';
  const {data,error}=await db.auth.mfa.enroll({factorType:'totp',friendlyName:'Pluits authenticator'});
  start.disabled=false;if(error){node.textContent=error.message;return;}
  const factor=data.totp;const panel=document.querySelector('#ua-mfa-enroll');panel.hidden=false;
  panel.innerHTML='<p>Pindai QR ini dengan aplikasi authenticator, atau masukkan secret secara manual.</p><img class="ua-mfa-qr" src="'+esc(factor.qr_code)+'" alt="QR authenticator"><code>'+esc(factor.secret)+'</code><form id="ua-mfa-verify"><label>Kode 6 digit<input name="code" inputmode="numeric" autocomplete="one-time-code" minlength="6" maxlength="6" required></label><button class="ua-primary" type="submit">Konfirmasi 2FA</button></form>';
  panel.querySelector('form').onsubmit=async event=>{event.preventDefault();const code=String(new FormData(event.currentTarget).get('code')).trim();const result=await db.auth.mfa.challengeAndVerify({factorId:factor.id,code});node.textContent=result.error?result.error.message:'2FA aktif. Memuat ulang status keamanan…';if(!result.error)location.reload();};
  node.textContent='QR berhasil dibuat. Selesaikan verifikasi kode untuk mengaktifkan 2FA.';
 });
 document.querySelectorAll('[data-factor-id]').forEach(button=>button.addEventListener('click',async()=>{
  if(!confirm('Nonaktifkan verifikasi dua langkah pada authenticator ini?'))return;
  button.disabled=true;const {error}=await db.auth.mfa.unenroll({factorId:button.dataset.factorId});if(error){document.querySelector('#ua-mfa-note').textContent=error.message;button.disabled=false;}else location.reload();
 }));
 document.querySelector('#ua-location-permission')?.addEventListener('click',()=>{
  const note=document.querySelector('#ua-location-note');
  if(!navigator.geolocation){note.textContent='Browser tidak mendukung geolocation.';return;}
  note.textContent='Menunggu izin lokasi…';
  navigator.geolocation.getCurrentPosition(()=>{note.textContent='Izin lokasi diberikan. Koordinat tidak disimpan.';},error=>{note.textContent=error.code===1?'Izin ditolak. Ubah izin lokasi pada pengaturan situs Android/browser.':error.message;},{timeout:10000,maximumAge:60000});
 });
 document.querySelector('#ua-media-permission')?.addEventListener('change',event=>{
  const files=[...(event.target.files||[])];document.querySelector('#ua-media-note').textContent=files.length?files.length+' file dipilih. Tidak ada file yang diunggah.':'Tidak ada file dipilih.';
 });
}
