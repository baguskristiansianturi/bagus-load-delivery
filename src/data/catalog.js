const I=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=82`;
export const PRODUCTS=[
{id:'mat-001',type:'material',category:'besi-baja',title:'Besi Beton 10 mm',price:78000,oldPrice:85000,unit:'batang',provider:'Supplier Bangunan Nusantara',rating:4.8,stock:'Tersedia',image:I('1504307651254-35680f356dfd')},
{id:'mat-002',type:'material',category:'besi-baja',title:'Besi Ulir 13 mm',price:142000,unit:'batang',provider:'Mitra Besi Bali',rating:4.8,stock:'Tersedia',image:I('1590644365607-1c5a4b5e9bca')},
{id:'mat-003',type:'material',category:'semen-beton',title:'Semen Portland 40 kg',price:68500,oldPrice:73000,unit:'sak',provider:'Mitra Material',rating:4.9,stock:'Tersedia',image:I('1590644365607-1c5a4b5e9bca')},
{id:'mat-004',type:'material',category:'kayu-multiplek',title:'Multiplek 12 mm',price:168000,unit:'lembar',provider:'Toko Kayu Jaya',rating:4.7,stock:'Tersedia',image:I('1531835551805-16d864c8d1c6')},
{id:'mat-005',type:'material',category:'cat-pelapis',title:'Cat Tembok Interior 5 kg',price:119000,oldPrice:135000,unit:'kaleng',provider:'Pusat Cat Indonesia',rating:4.8,stock:'Siap dikirim',image:I('1562259949-e8e7689d7828')},
{id:'mat-006',type:'material',category:'pipa-plumbing',title:'Pipa PVC 3/4 Inch',price:28500,unit:'batang',provider:'Mitra Plumbing',rating:4.8,stock:'Tersedia',image:I('1581094794329-c8112a89af12')},
{id:'mat-007',type:'material',category:'pasir-batu',title:'Batu Split 1/2',price:340000,unit:'m³',provider:'Supplier Batu Mandiri',rating:4.7,stock:'Pesan dahulu',image:I('1590579491624-f98f36d4c763')},
{id:'mat-008',type:'material',category:'atap',title:'Genteng Metal Pasir',price:98000,unit:'lembar',provider:'Mitra Atap Bali',rating:4.7,stock:'Tersedia',image:I('1600607687939-ce8a6c25118c')},
];
export const SERVICES=[
{id:'svc-001',type:'service',category:'tukang-bangunan',title:'Tukang Bangunan Harian',price:180000,unit:'orang/hari',provider:'Mitra Tukang Bali',rating:4.8,stock:'Bisa dipesan',image:I('1503387762-592deb58ef4e')},
{id:'svc-002',type:'service',category:'listrik',title:'Instalasi & Perbaikan Listrik',price:250000,unit:'kunjungan',provider:'Teknik Bali Mandiri',rating:4.9,stock:'Bisa dipesan',image:I('1621905252507-b35492cc74b4')},
{id:'svc-003',type:'service',category:'plumbing',title:'Perbaikan Plumbing',price:200000,unit:'kunjungan',provider:'Mitra Plumbing Service',rating:4.8,stock:'Bisa dipesan',image:I('1607472586893-edb57bdc0e39')},
{id:'svc-004',type:'service',category:'renovasi',title:'Survey Renovasi Rumah',price:150000,unit:'kunjungan',provider:'Bagus Renovation Partner',rating:4.7,stock:'Bisa dipesan',image:I('1505693416388-ac5ce068fe85')},
];
export const LOGISTICS=[
{id:'log-001',type:'logistics',category:'pickup',title:'Pickup Pengiriman Material',price:250000,unit:'trip',provider:'Bagus Delivery Partner',rating:4.8,stock:'Bisa dipesan',image:I('1601584115197-04ecc0da31d8')},
{id:'log-002',type:'logistics',category:'l300',title:'L300 Angkutan Proyek',price:350000,unit:'trip',provider:'Mitra Angkutan Bali',rating:4.8,stock:'Bisa dipesan',image:I('1586191582056-d8e8b2a2f8b6')},
{id:'log-003',type:'logistics',category:'truck',title:'Truck Engkel Material',price:650000,unit:'trip',provider:'Bali Project Transport',rating:4.9,stock:'Bisa dipesan',image:I('1558618666-fcd25c85cd64')},
{id:'log-004',type:'logistics',category:'bongkar-muat',title:'Tenaga Bongkar Muat',price:150000,unit:'orang',provider:'Tenaga Proyek Bali',rating:4.7,stock:'Bisa dipesan',image:I('1586528116493-da8b8c4a7c2e')},
];
export const PROPERTIES=[
{id:'prop-001',type:'property',category:'rumah',title:'Rumah Minimalis Siap Huni',price:1250000000,unit:'unit',provider:'Mitra Properti Bali',rating:4.7,stock:'Dijual',image:I('1600585154340-be6161a56a0c')},
{id:'prop-002',type:'property',category:'tanah',title:'Tanah Kavling Dekat Akses Utama',price:450000000,unit:'are',provider:'Bali Land Partner',rating:4.8,stock:'Dijual',image:I('1500382017468-9049fed747ef')},
{id:'prop-003',type:'property',category:'ruko',title:'Ruko 2 Lantai Area Strategis',price:28000000,unit:'tahun',provider:'Mitra Properti Bali',rating:4.6,stock:'Disewa',image:I('1560518883-ce09059eeffa')},
{id:'prop-004',type:'property',category:'villa',title:'Villa Private dengan Kolam',price:35000000,unit:'tahun',provider:'Bali Villa Partner',rating:4.8,stock:'Disewa',image:I('1600607687939-ce8a6c25118c')},
];
export const ALL_CATALOG=[...PRODUCTS,...SERVICES,...LOGISTICS,...PROPERTIES];
export const getItem=id=>ALL_CATALOG.find(x=>x.id===id);
