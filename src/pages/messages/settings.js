import './settings.css';

const groups = [
  {
    id:'privacy', icon:'◉', title:'Privasi dan keamanan', description:'Atur siapa yang dapat menghubungi dan melihat aktivitas pesan Anda.',
    items:[
      ['Status online','Pilih siapa yang dapat melihat saat Anda sedang aktif.'],
      ['Tanda pesan dibaca','Kendalikan apakah pengirim mengetahui pesan sudah dibaca.'],
      ['Indikator sedang mengetik','Atur visibilitas aktivitas saat menulis pesan.'],
      ['Siapa yang dapat mengirim pesan','Semua orang, akun yang Anda ikuti, atau orang yang terhubung.'],
      ['Akun diblokir','Tinjau dan kelola akun yang tidak dapat menghubungi Anda.']
    ]
  },
  {
    id:'requests', icon:'✉', title:'Permintaan pesan', description:'Kendalikan pesan dari orang yang belum terhubung dengan Anda.',
    items:[
      ['Filter permintaan','Pisahkan pesan dari orang yang dikenal dan belum dikenal.'],
      ['Permintaan mencurigakan','Penyaringan pesan spam, tautan berisiko, dan aktivitas mencurigakan.'],
      ['Persetujuan percakapan','Tentukan kapan permintaan berubah menjadi percakapan utama.']
    ]
  },
  {
    id:'notifications', icon:'♧', title:'Notifikasi pesan', description:'Pilih pemberitahuan yang ingin Anda terima.',
    items:[
      ['Pesan baru','Notifikasi untuk pesan masuk dari percakapan utama.'],
      ['Permintaan pesan','Pemberitahuan ketika ada permintaan percakapan baru.'],
      ['Suara notifikasi','Aktifkan atau senyapkan suara pesan.'],
      ['Pratinjau pesan','Tampilkan atau sembunyikan isi pesan pada notifikasi.'],
      ['Jeda notifikasi','Atur waktu tenang agar tidak terganggu.']
    ]
  },
  {
    id:'appearance', icon:'◐', title:'Tampilan dan pengalaman', description:'Sesuaikan cara Anda membaca dan menggunakan ruang pesan.',
    items:[
      ['Tema tampilan','Terang, gelap, atau mengikuti pengaturan perangkat.'],
      ['Ukuran teks','Atur ukuran huruf agar percakapan nyaman dibaca.'],
      ['Enter untuk mengirim','Pilih apakah tombol Enter mengirim pesan atau membuat baris baru.'],
      ['Animasi','Kurangi gerakan dan animasi bila diperlukan.']
    ]
  },
  {
    id:'media', icon:'▧', title:'Foto, video, dan data', description:'Kelola penggunaan data dan pengalaman media dalam percakapan.',
    items:[
      ['Putar otomatis video','Atur apakah video diputar otomatis.'],
      ['Unduh media otomatis','Pilih kapan foto dan video dimuat otomatis.'],
      ['Hemat penggunaan data','Kurangi pemakaian data seluler saat membuka media.'],
      ['Kualitas unggahan','Pilih kualitas media saat mengirim foto dan video.']
    ]
  },
  {
    id:'support', icon:'?', title:'Bantuan dan keamanan akun', description:'Temukan bantuan saat mengalami masalah dalam percakapan.',
    items:[
      ['Laporkan percakapan','Laporkan spam, pelecehan, atau konten yang melanggar aturan.'],
      ['Pusat bantuan pesan','Panduan mengelola pesan dan melindungi akun.'],
      ['Informasi privasi','Pelajari bagaimana Pluits mengelola data pesan.']
    ]
  }
];

export function messageSettingsPage(){
  return `<main class="pl-dm-settings">
    <header class="pl-dm-settings-head">
      <a class="pl-dm-settings-back" href="#/inbox" aria-label="Kembali ke Inbox"><span aria-hidden="true">‹</span><small>Inbox</small></a>
      <div class="pl-dm-settings-head-copy"><span>PLUITS · PESAN</span><h1>Pengaturan pesan</h1></div>
      <span class="pl-dm-settings-head-mark" aria-hidden="true">•••</span>
    </header>
    <div class="pl-dm-settings-body">
      <div class="pl-dm-settings-intro">
        <span class="pl-dm-settings-eyebrow">PREFERENSI PESAN</span>
        <h2>Atur pengalaman percakapan Anda</h2>
        <p>Daftar ini merupakan rancangan menu pengaturan pesan PLUITS. Pilih bagian untuk melihat cakupan pengaturannya.</p>
      </div>
      <div class="pl-dm-settings-groups">
        ${groups.map((group,index)=>`<details class="pl-dm-settings-group" ${index===0?'open':''} id="dm-setting-${group.id}">
          <summary><span class="pl-dm-settings-icon" aria-hidden="true">${group.icon}</span><span class="pl-dm-settings-group-copy"><strong>${group.title}</strong><small>${group.description}</small></span><span class="pl-dm-settings-chevron" aria-hidden="true">⌄</span></summary>
          <div class="pl-dm-settings-items">${group.items.map(item=>`<div class="pl-dm-settings-item"><span><strong>${item[0]}</strong><small>${item[1]}</small></span><em>Rancangan</em></div>`).join('')}</div>
        </details>`).join('')}
      </div>
      <p class="pl-dm-settings-footnote">Pengaturan di atas adalah daftar usulan untuk ditinjau terlebih dahulu. Belum ada perubahan preferensi atau privasi yang diterapkan ke akun Anda.</p>
    </div>
  </main>`;
}

export function bindMessageSettingsPage(){
  document.querySelectorAll('.pl-dm-settings-group').forEach(group=>{
    group.addEventListener('toggle',()=>{
      group.classList.toggle('is-open',group.open);
    });
  });
}
