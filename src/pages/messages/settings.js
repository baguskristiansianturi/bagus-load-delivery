import './settings.css';

const groups = [
  {
    id:'privacy', icon:'◉', title:'Privasi & Keamanan', description:'Atur siapa yang dapat menghubungi dan melihat aktivitas pesan Anda.',
    items:[
      ['Status Aktivitas','Atur siapa yang dapat melihat saat Anda aktif.'],
      ['Tanda Dibaca','Atur apakah orang lain dapat melihat pesan telah dibaca.'],
      ['Indikator Mengetik','Atur apakah orang lain dapat melihat saat Anda mengetik.'],
      ['Siapa yang Dapat Mengirim Pesan','Semua orang, akun yang Anda ikuti, atau kontak terhubung.'],
      ['Akun Diblokir','Lihat akun yang tidak dapat menghubungi Anda.']
    ]
  },
  {
    id:'requests', icon:'✉', title:'Permintaan Pesan', description:'Kelola pesan dari orang yang belum terhubung dengan Anda.',
    items:[
      ['Penyaringan Permintaan','Pisahkan pesan dari orang yang dikenal dan yang belum dikenal.'],
      ['Spam & Permintaan Mencurigakan','Saring spam, tautan berisiko, dan aktivitas mencurigakan.'],
      ['Persetujuan Percakapan','Atur kapan permintaan menjadi percakapan biasa.']
    ]
  },
  {
    id:'notifications', icon:'♧', title:'Notifikasi Pesan', description:'Pilih pemberitahuan yang ingin Anda terima.',
    items:[
      ['Pesan Baru','Pemberitahuan pesan masuk di kotak masuk utama.'],
      ['Permintaan Pesan','Pemberitahuan saat ada permintaan percakapan baru.'],
      ['Suara Notifikasi','Aktifkan atau nonaktifkan suara pesan.'],
      ['Pratinjau Pesan','Tampilkan atau sembunyikan isi pesan di notifikasi.'],
      ['Jeda Notifikasi','Atur waktu tenang agar tidak terganggu.']
    ]
  },
  {
    id:'appearance', icon:'◐', title:'Tampilan & Pengalaman', description:'Sesuaikan tampilan dan pengalaman berkirim pesan.',
    items:[
      ['Tema','Terang, gelap, atau mengikuti pengaturan perangkat.'],
      ['Ukuran Teks','Sesuaikan ukuran teks agar nyaman dibaca.'],
      ['Enter untuk Mengirim','Pilih apakah Enter mengirim pesan atau membuat baris baru.'],
      ['Animasi','Kurangi gerakan dan animasi jika diperlukan.']
    ]
  },
  {
    id:'media', icon:'▧', title:'Media & Data', description:'Atur penggunaan data dan media dalam percakapan.',
    items:[
      ['Putar Video Otomatis','Atur apakah video diputar secara otomatis.'],
      ['Unduh Media Otomatis','Atur kapan foto dan video diunduh otomatis.'],
      ['Hemat Data','Kurangi penggunaan data seluler saat melihat media.'],
      ['Kualitas Unggahan','Pilih kualitas foto dan video saat dikirim.']
    ]
  },
  {
    id:'support', icon:'?', title:'Bantuan & Keamanan Akun', description:'Dapatkan bantuan terkait pesan dan keamanan akun.',
    items:[
      ['Laporkan Percakapan','Laporkan spam, pelecehan, atau konten yang melanggar aturan.'],
      ['Pusat Bantuan Pesan','Panduan mengelola pesan dan melindungi akun Anda.'],
      ['Informasi Privasi','Pelajari cara PLUITS mengelola data pesan.']
    ]
  }
];

export function messageSettingsPage(){
  return `<main class="pl-dm-settings">
    <header class="pl-dm-settings-head">
      <a class="pl-dm-settings-back" href="#/inbox" aria-label="Back to Messages"><span aria-hidden="true">‹</span><small>Pesan</small></a>
      <div class="pl-dm-settings-head-copy"><span>PLUITS · PESAN</span><h1>Pengaturan Pesan</h1></div>
      
    </header>
    <div class="pl-dm-settings-body">
      <div class="pl-dm-settings-intro">
        <span class="pl-dm-settings-eyebrow">PREFERENSI PESAN</span>
        <h2>Atur pengalaman berkirim pesan</h2>
        <p>Pengaturan yang direncanakan untuk privasi, permintaan, notifikasi, tampilan, media, dan bantuan.</p>
      </div>
      <div class="pl-dm-settings-groups">
        ${groups.map((group,index)=>`<details class="pl-dm-settings-group"  id="dm-setting-${group.id}">
          <summary><span class="pl-dm-settings-icon" aria-hidden="true">${group.icon}</span><span class="pl-dm-settings-group-copy"><strong>${group.title}</strong><small>${group.description}</small></span><span class="pl-dm-settings-chevron" aria-hidden="true">⌄</span></summary>
          <div class="pl-dm-settings-items">${group.items.map(item=>`<div class="pl-dm-settings-item"><span><strong>${item[0]}</strong><small>${item[1]}</small></span><em>Rancangan</em></div>`).join('')}</div>
        </details>`).join('')}
      </div>
      <p class="pl-dm-settings-footnote">Pengaturan ini masih berupa rancangan dan belum mengubah preferensi atau kontrol privasi akun Anda.</p>
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
