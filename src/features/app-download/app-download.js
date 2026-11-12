import './app-download.css';

function playIcon(){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#34A853" d="M3.4 2.8c-.3.3-.4.8-.4 1.4v15.6c0 .6.1 1.1.4 1.4l9-9.2z"/><path fill="#4285F4" d="m3.4 21.2 11-11.2 3.3 3.3-12.2 7.1c-.8.5-1.6.8-2.1.8z"/><path fill="#FBBC04" d="m14.4 10 3.3-3.3 3.4 2c1.2.7 1.2 1.9 0 2.6l-3.4 2z"/><path fill="#EA4335" d="M3.4 2.8c.5 0 1.3.3 2.1.8l12.2 7.1-3.3 3.3z"/></svg>';
}
function appleIcon(){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.7 12.8c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.6 0-3.1.9-3.9 2.3-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 2.9 2.4 1.2 0 1.6-.8 3-.8s1.8.8 3 .8 2-.1 2.8-1.5c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-4.2zM14.5 6.5c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.3z"/></svg>';
}

export function renderAppDownload(){
 return `<section class="pl-app-download" aria-labelledby="pl-app-download-title">
  <div class="pl-app-download-inner">
   <div class="pl-app-download-copy">
    <span class="pl-app-download-eyebrow">PLUITS · MOBILE EXPERIENCE</span>
    <h2 id="pl-app-download-title">Pengalaman PLUITS, lebih dekat dalam genggaman.</h2>
    <p>Jelajahi cerita, temukan komunitas, dan tetap terhubung melalui perangkat favoritmu.</p>
    <span class="pl-app-download-note"><span aria-hidden="true">✦</span> Satu ruang untuk terhubung dan menemukan hal baru.</span>
   </div>
   <div class="pl-app-download-platforms" aria-label="Aplikasi PLUITS untuk perangkat mobile">
    <div class="pl-app-store-card" aria-label="PLUITS untuk iPhone dan iPad, segera hadir">
     <span class="pl-app-store-icon pl-app-store-apple">${appleIcon()}</span>
     <span class="pl-app-store-text"><small>Download on the</small><strong>App Store</strong><em>Untuk iPhone &amp; iPad</em></span>
     <span class="pl-app-store-status">Coming soon</span>
    </div>
    <div class="pl-app-store-card" aria-label="PLUITS untuk Android, segera hadir">
     <span class="pl-app-store-icon pl-app-store-play">${playIcon()}</span>
     <span class="pl-app-store-text"><small>GET IT ON</small><strong>Google Play</strong><em>Untuk perangkat Android</em></span>
     <span class="pl-app-store-status">Coming soon</span>
    </div>
   </div>
  </div>
 </section>`;
}
