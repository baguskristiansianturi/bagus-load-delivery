// ============================================================
// BAGUS LOAD & DELIVERY
// MASTER DATA
// Version: 1.0
//
// Prinsip:
// - Tidak hard-code Bali sebagai batas platform
// - Indonesia adalah data awal
// - Bahasa ID / EN
// - Location-aware
// - Material, Jasa, Logistik, Properti
// - Siap dikembangkan ke backend
// ============================================================


// ============================================================
// LANGUAGE
// ============================================================

export const LANGUAGES = [
  {
    code: 'id',
    name: 'Indonesia',
    nativeName: 'Bahasa Indonesia',
    default: true,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    default: false,
  },
]


// ============================================================
// PLATFORM TYPES
// ============================================================

export const PLATFORM_TYPES = {
  MATERIAL: 'material',
  SERVICE: 'service',
  LOGISTICS: 'logistics',
  PROPERTY: 'property',
}


// ============================================================
// PROVIDER TYPES
// ============================================================

export const PROVIDER_TYPES = [
  {
    id: 'store',
    name: {
      id: 'Toko',
      en: 'Store',
    },
  },
  {
    id: 'supplier',
    name: {
      id: 'Supplier',
      en: 'Supplier',
    },
  },
  {
    id: 'distributor',
    name: {
      id: 'Distributor',
      en: 'Distributor',
    },
  },
  {
    id: 'brand',
    name: {
      id: 'Merek',
      en: 'Brand',
    },
  },
  {
    id: 'company',
    name: {
      id: 'Perusahaan',
      en: 'Company',
    },
  },
  {
    id: 'service_provider',
    name: {
      id: 'Penyedia Jasa',
      en: 'Service Provider',
    },
  },
  {
    id: 'logistics_provider',
    name: {
      id: 'Penyedia Logistik',
      en: 'Logistics Provider',
    },
  },
  {
    id: 'property_provider',
    name: {
      id: 'Penyedia Properti',
      en: 'Property Provider',
    },
  },
]


// ============================================================
// MATERIAL CATEGORIES
// ============================================================

export const MATERIAL_CATEGORIES = [
  {
    id: 'steel-iron',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Besi & Baja',
      en: 'Steel & Iron',
    },
    slug: {
      id: 'besi-baja',
      en: 'steel-iron',
    },
    description: {
      id: 'Besi, baja konstruksi, wiremesh dan berbagai kebutuhan struktur.',
      en: 'Steel, reinforcing bars, wire mesh and structural construction materials.',
    },
    image: '/images/categories/steel.jpg',
    sortOrder: 1,
    subcategories: [
      {
        id: 'rebar',
        name: {
          id: 'Besi Beton',
          en: 'Rebar',
        },
        slug: {
          id: 'besi-beton',
          en: 'rebar',
        },
      },
      {
        id: 'deformed-bar',
        name: {
          id: 'Besi Ulir',
          en: 'Deformed Bar',
        },
        slug: {
          id: 'besi-ulir',
          en: 'deformed-bar',
        },
      },
      {
        id: 'wiremesh',
        name: {
          id: 'Wiremesh',
          en: 'Wire Mesh',
        },
        slug: {
          id: 'wiremesh',
          en: 'wire-mesh',
        },
      },
      {
        id: 'hollow',
        name: {
          id: 'Hollow',
          en: 'Hollow Section',
        },
        slug: {
          id: 'hollow',
          en: 'hollow-section',
        },
      },
      {
        id: 'canal-c',
        name: {
          id: 'Kanal C',
          en: 'C Channel',
        },
        slug: {
          id: 'kanal-c',
          en: 'c-channel',
        },
      },
      {
        id: 'un-p',
        name: {
          id: 'UNP',
          en: 'UNP Channel',
        },
        slug: {
          id: 'unp',
          en: 'unp-channel',
        },
      },
      {
        id: 'wf',
        name: {
          id: 'WF',
          en: 'Wide Flange',
        },
        slug: {
          id: 'wf',
          en: 'wide-flange',
        },
      },
      {
        id: 'h-beam',
        name: {
          id: 'H-Beam',
          en: 'H-Beam',
        },
        slug: {
          id: 'h-beam',
          en: 'h-beam',
        },
      },
      {
        id: 'steel-plate',
        name: {
          id: 'Plat Besi',
          en: 'Steel Plate',
        },
        slug: {
          id: 'plat-besi',
          en: 'steel-plate',
        },
      },
      {
        id: 'angle-bar',
        name: {
          id: 'Besi Siku',
          en: 'Angle Bar',
        },
        slug: {
          id: 'besi-siku',
          en: 'angle-bar',
        },
      },
      {
        id: 'steel-pipe',
        name: {
          id: 'Pipa Baja',
          en: 'Steel Pipe',
        },
        slug: {
          id: 'pipa-baja',
          en: 'steel-pipe',
        },
      },
      {
        id: 'steel-deck',
        name: {
          id: 'Steel Deck',
          en: 'Steel Deck',
        },
        slug: {
          id: 'steel-deck',
          en: 'steel-deck',
        },
      },
      {
        id: 'light-steel',
        name: {
          id: 'Baja Ringan',
          en: 'Light Gauge Steel',
        },
        slug: {
          id: 'baja-ringan',
          en: 'light-gauge-steel',
        },
      },
    ],
  },

  {
    id: 'cement-concrete',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Semen & Beton',
      en: 'Cement & Concrete',
    },
    slug: {
      id: 'semen-beton',
      en: 'cement-concrete',
    },
    description: {
      id: 'Semen, mortar, beton instan dan material konstruksi berbasis beton.',
      en: 'Cement, mortar, ready-mix products and concrete-based construction materials.',
    },
    image: '/images/categories/cement.jpg',
    sortOrder: 2,
    subcategories: [
      {
        id: 'portland-cement',
        name: {
          id: 'Semen Portland',
          en: 'Portland Cement',
        },
        slug: {
          id: 'semen-portland',
          en: 'portland-cement',
        },
      },
      {
        id: 'pcc-cement',
        name: {
          id: 'Semen PCC',
          en: 'PCC Cement',
        },
        slug: {
          id: 'semen-pcc',
          en: 'pcc-cement',
        },
      },
      {
        id: 'white-cement',
        name: {
          id: 'Semen Putih',
          en: 'White Cement',
        },
        slug: {
          id: 'semen-putih',
          en: 'white-cement',
        },
      },
      {
        id: 'mortar',
        name: {
          id: 'Mortar',
          en: 'Mortar',
        },
        slug: {
          id: 'mortar',
          en: 'mortar',
        },
      },
      {
        id: 'instant-concrete',
        name: {
          id: 'Beton Instan',
          en: 'Instant Concrete',
        },
        slug: {
          id: 'beton-instan',
          en: 'instant-concrete',
        },
      },
      {
        id: 'grout',
        name: {
          id: 'Grouting',
          en: 'Grout',
        },
        slug: {
          id: 'grouting',
          en: 'grout',
        },
      },
      {
        id: 'concrete-additive',
        name: {
          id: 'Additive Beton',
          en: 'Concrete Additives',
        },
        slug: {
          id: 'additive-beton',
          en: 'concrete-additives',
        },
      },
    ],
  },

  {
    id: 'sand-stone',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Pasir, Batu & Agregat',
      en: 'Sand, Stone & Aggregates',
    },
    slug: {
      id: 'pasir-batu',
      en: 'sand-stone',
    },
    description: {
      id: 'Pasir, batu, split dan berbagai agregat untuk kebutuhan konstruksi.',
      en: 'Sand, stone, crushed rock and aggregates for construction projects.',
    },
    image: '/images/categories/sand.jpg',
    sortOrder: 3,
    subcategories: [
      {
        id: 'concrete-sand',
        name: {
          id: 'Pasir Beton',
          en: 'Concrete Sand',
        },
        slug: {
          id: 'pasir-beton',
          en: 'concrete-sand',
        },
      },
      {
        id: 'masonry-sand',
        name: {
          id: 'Pasir Pasang',
          en: 'Masonry Sand',
        },
        slug: {
          id: 'pasir-pasang',
          en: 'masonry-sand',
        },
      },
      {
        id: 'fill-sand',
        name: {
          id: 'Pasir Urug',
          en: 'Fill Sand',
        },
        slug: {
          id: 'pasir-urug',
          en: 'fill-sand',
        },
      },
      {
        id: 'split',
        name: {
          id: 'Batu Split',
          en: 'Crushed Stone',
        },
        slug: {
          id: 'batu-split',
          en: 'crushed-stone',
        },
      },
      {
        id: 'river-stone',
        name: {
          id: 'Batu Kali',
          en: 'River Stone',
        },
        slug: {
          id: 'batu-kali',
          en: 'river-stone',
        },
      },
      {
        id: 'sirtu',
        name: {
          id: 'Sirtu',
          en: 'Sand and Gravel Mix',
        },
        slug: {
          id: 'sirtu',
          en: 'sand-gravel-mix',
        },
      },
      {
        id: 'basecourse',
        name: {
          id: 'Basecourse',
          en: 'Basecourse',
        },
        slug: {
          id: 'basecourse',
          en: 'basecourse',
        },
      },
      {
        id: 'stone-dust',
        name: {
          id: 'Abu Batu',
          en: 'Stone Dust',
        },
        slug: {
          id: 'abu-batu',
          en: 'stone-dust',
        },
      },
    ],
  },

  {
    id: 'brick-wall',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Bata & Dinding',
      en: 'Bricks & Walls',
    },
    slug: {
      id: 'bata-dinding',
      en: 'bricks-walls',
    },
    sortOrder: 4,
    subcategories: [
      {
        id: 'red-brick',
        name: {
          id: 'Bata Merah',
          en: 'Red Brick',
        },
        slug: {
          id: 'bata-merah',
          en: 'red-brick',
        },
      },
      {
        id: 'concrete-block',
        name: {
          id: 'Batako',
          en: 'Concrete Block',
        },
        slug: {
          id: 'batako',
          en: 'concrete-block',
        },
      },
      {
        id: 'lightweight-block',
        name: {
          id: 'Bata Ringan / Hebel',
          en: 'Lightweight Block',
        },
        slug: {
          id: 'bata-ringan-hebel',
          en: 'lightweight-block',
        },
      },
      {
        id: 'wall-panel',
        name: {
          id: 'Panel Dinding',
          en: 'Wall Panel',
        },
        slug: {
          id: 'panel-dinding',
          en: 'wall-panel',
        },
      },
      {
        id: 'plaster-mortar',
        name: {
          id: 'Mortar Plester',
          en: 'Plaster Mortar',
        },
        slug: {
          id: 'mortar-plester',
          en: 'plaster-mortar',
        },
      },
      {
        id: 'skim-coat',
        name: {
          id: 'Acian',
          en: 'Skim Coat',
        },
        slug: {
          id: 'acian',
          en: 'skim-coat',
        },
      },
    ],
  },

  {
    id: 'wood-plywood',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Kayu & Multiplek',
      en: 'Wood & Plywood',
    },
    slug: {
      id: 'kayu-multiplek',
      en: 'wood-plywood',
    },
    sortOrder: 5,
    subcategories: [
      {
        id: 'beam',
        name: {
          id: 'Balok',
          en: 'Timber Beam',
        },
        slug: {
          id: 'balok',
          en: 'timber-beam',
        },
      },
      {
        id: 'kaso',
        name: {
          id: 'Kaso',
          en: 'Timber Stud',
        },
        slug: {
          id: 'kaso',
          en: 'timber-stud',
        },
      },
      {
        id: 'board',
        name: {
          id: 'Papan',
          en: 'Timber Board',
        },
        slug: {
          id: 'papan',
          en: 'timber-board',
        },
      },
      {
        id: 'reng',
        name: {
          id: 'Reng',
          en: 'Roof Batten',
        },
        slug: {
          id: 'reng',
          en: 'roof-batten',
        },
      },
      {
        id: 'plywood',
        name: {
          id: 'Multiplek / Plywood',
          en: 'Plywood',
        },
        slug: {
          id: 'multiplek-plywood',
          en: 'plywood',
        },
      },
      {
        id: 'mdf',
        name: {
          id: 'MDF',
          en: 'MDF',
        },
        slug: {
          id: 'mdf',
          en: 'mdf',
        },
      },
      {
        id: 'hpl',
        name: {
          id: 'HPL',
          en: 'HPL',
        },
        slug: {
          id: 'hpl',
          en: 'hpl',
        },
      },
      {
        id: 'osb',
        name: {
          id: 'OSB',
          en: 'OSB',
        },
        slug: {
          id: 'osb',
          en: 'osb',
        },
      },
    ],
  },

  {
    id: 'roofing',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Atap',
      en: 'Roofing',
    },
    slug: {
      id: 'atap',
      en: 'roofing',
    },
    sortOrder: 6,
    subcategories: [
      {
        id: 'tile',
        name: {
          id: 'Genteng',
          en: 'Roof Tile',
        },
        slug: {
          id: 'genteng',
          en: 'roof-tile',
        },
      },
      {
        id: 'metal-roof',
        name: {
          id: 'Atap Metal',
          en: 'Metal Roofing',
        },
        slug: {
          id: 'atap-metal',
          en: 'metal-roofing',
        },
      },
      {
        id: 'spandek',
        name: {
          id: 'Spandek',
          en: 'Spandek Roofing',
        },
        slug: {
          id: 'spandek',
          en: 'spandek-roofing',
        },
      },
      {
        id: 'galvalume',
        name: {
          id: 'Galvalum',
          en: 'Galvalume',
        },
        slug: {
          id: 'galvalum',
          en: 'galvalume',
        },
      },
      {
        id: 'upvc-roof',
        name: {
          id: 'Atap UPVC',
          en: 'UPVC Roofing',
        },
        slug: {
          id: 'atap-upvc',
          en: 'upvc-roofing',
        },
      },
      {
        id: 'polycarbonate',
        name: {
          id: 'Polycarbonate',
          en: 'Polycarbonate',
        },
        slug: {
          id: 'polycarbonate',
          en: 'polycarbonate',
        },
      },
      {
        id: 'gutter',
        name: {
          id: 'Talang',
          en: 'Gutter',
        },
        slug: {
          id: 'talang',
          en: 'gutter',
        },
      },
    ],
  },

  {
    id: 'flooring',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Keramik, Granit & Lantai',
      en: 'Tiles & Flooring',
    },
    slug: {
      id: 'keramik-granit-lantai',
      en: 'tiles-flooring',
    },
    sortOrder: 7,
    subcategories: [
      {
        id: 'ceramic-tile',
        name: {
          id: 'Keramik',
          en: 'Ceramic Tile',
        },
        slug: {
          id: 'keramik',
          en: 'ceramic-tile',
        },
      },
      {
        id: 'granite',
        name: {
          id: 'Granit',
          en: 'Granite Tile',
        },
        slug: {
          id: 'granit',
          en: 'granite-tile',
        },
      },
      {
        id: 'homogeneous-tile',
        name: {
          id: 'Homogeneous Tile',
          en: 'Homogeneous Tile',
        },
        slug: {
          id: 'homogeneous-tile',
          en: 'homogeneous-tile',
        },
      },
      {
        id: 'natural-stone',
        name: {
          id: 'Batu Alam',
          en: 'Natural Stone',
        },
        slug: {
          id: 'batu-alam',
          en: 'natural-stone',
        },
      },
      {
        id: 'vinyl',
        name: {
          id: 'Vinyl',
          en: 'Vinyl Flooring',
        },
        slug: {
          id: 'vinyl',
          en: 'vinyl-flooring',
        },
      },
      {
        id: 'spc',
        name: {
          id: 'SPC',
          en: 'SPC Flooring',
        },
        slug: {
          id: 'spc',
          en: 'spc-flooring',
        },
      },
      {
        id: 'parquet',
        name: {
          id: 'Parket',
          en: 'Parquet',
        },
        slug: {
          id: 'parket',
          en: 'parquet',
        },
      },
    ],
  },

  {
    id: 'paint-finishing',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Cat & Finishing',
      en: 'Paint & Finishing',
    },
    slug: {
      id: 'cat-finishing',
      en: 'paint-finishing',
    },
    sortOrder: 8,
    subcategories: [
      {
        id: 'interior-paint',
        name: {
          id: 'Cat Interior',
          en: 'Interior Paint',
        },
        slug: {
          id: 'cat-interior',
          en: 'interior-paint',
        },
      },
      {
        id: 'exterior-paint',
        name: {
          id: 'Cat Exterior',
          en: 'Exterior Paint',
        },
        slug: {
          id: 'cat-exterior',
          en: 'exterior-paint',
        },
      },
      {
        id: 'metal-paint',
        name: {
          id: 'Cat Besi',
          en: 'Metal Paint',
        },
        slug: {
          id: 'cat-besi',
          en: 'metal-paint',
        },
      },
      {
        id: 'wood-paint',
        name: {
          id: 'Cat Kayu',
          en: 'Wood Paint',
        },
        slug: {
          id: 'cat-kayu',
          en: 'wood-paint',
        },
      },
      {
        id: 'waterproofing',
        name: {
          id: 'Waterproofing',
          en: 'Waterproofing',
        },
        slug: {
          id: 'waterproofing',
          en: 'waterproofing',
        },
      },
      {
        id: 'primer',
        name: {
          id: 'Primer',
          en: 'Primer',
        },
        slug: {
          id: 'primer',
          en: 'primer',
        },
      },
      {
        id: 'plamir',
        name: {
          id: 'Plamir',
          en: 'Wall Filler',
        },
        slug: {
          id: 'plamir',
          en: 'wall-filler',
        },
      },
    ],
  },

  {
    id: 'plumbing',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Plumbing & Air',
      en: 'Plumbing & Water',
    },
    slug: {
      id: 'plumbing-air',
      en: 'plumbing-water',
    },
    sortOrder: 9,
    subcategories: [
      {
        id: 'pvc-pipe',
        name: {
          id: 'Pipa PVC',
          en: 'PVC Pipe',
        },
        slug: {
          id: 'pipa-pvc',
          en: 'pvc-pipe',
        },
      },
      {
        id: 'ppr-pipe',
        name: {
          id: 'Pipa PPR',
          en: 'PPR Pipe',
        },
        slug: {
          id: 'pipa-ppr',
          en: 'ppr-pipe',
        },
      },
      {
        id: 'hdpe-pipe',
        name: {
          id: 'Pipa HDPE',
          en: 'HDPE Pipe',
        },
        slug: {
          id: 'pipa-hdpe',
          en: 'hdpe-pipe',
        },
      },
      {
        id: 'pipe-fitting',
        name: {
          id: 'Fitting',
          en: 'Pipe Fittings',
        },
        slug: {
          id: 'fitting',
          en: 'pipe-fittings',
        },
      },
      {
        id: 'valve',
        name: {
          id: 'Valve',
          en: 'Valve',
        },
        slug: {
          id: 'valve',
          en: 'valve',
        },
      },
      {
        id: 'water-pump',
        name: {
          id: 'Pompa Air',
          en: 'Water Pump',
        },
        slug: {
          id: 'pompa-air',
          en: 'water-pump',
        },
      },
      {
        id: 'water-tank',
        name: {
          id: 'Tandon Air',
          en: 'Water Tank',
        },
        slug: {
          id: 'tandon-air',
          en: 'water-tank',
        },
      },
    ],
  },

  {
    id: 'electrical',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Listrik',
      en: 'Electrical',
    },
    slug: {
      id: 'listrik',
      en: 'electrical',
    },
    sortOrder: 10,
    subcategories: [
      {
        id: 'cable',
        name: {
          id: 'Kabel',
          en: 'Cable',
        },
        slug: {
          id: 'kabel',
          en: 'cable',
        },
      },
      {
        id: 'mcb',
        name: {
          id: 'MCB',
          en: 'MCB',
        },
        slug: {
          id: 'mcb',
          en: 'mcb',
        },
      },
      {
        id: 'electrical-panel',
        name: {
          id: 'Panel Listrik',
          en: 'Electrical Panel',
        },
        slug: {
          id: 'panel-listrik',
          en: 'electrical-panel',
        },
      },
      {
        id: 'socket',
        name: {
          id: 'Stop Kontak',
          en: 'Power Socket',
        },
        slug: {
          id: 'stop-kontak',
          en: 'power-socket',
        },
      },
      {
        id: 'switch',
        name: {
          id: 'Saklar',
          en: 'Light Switch',
        },
        slug: {
          id: 'saklar',
          en: 'light-switch',
        },
      },
      {
        id: 'lighting',
        name: {
          id: 'Lampu',
          en: 'Lighting',
        },
        slug: {
          id: 'lampu',
          en: 'lighting',
        },
      },
      {
        id: 'conduit',
        name: {
          id: 'Conduit',
          en: 'Conduit',
        },
        slug: {
          id: 'conduit',
          en: 'conduit',
        },
      },
    ],
  },

  {
    id: 'sanitary',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Sanitasi & Kamar Mandi',
      en: 'Sanitary & Bathroom',
    },
    slug: {
      id: 'sanitasi-kamar-mandi',
      en: 'sanitary-bathroom',
    },
    sortOrder: 11,
    subcategories: [
      {
        id: 'toilet',
        name: {
          id: 'Closet / Toilet',
          en: 'Toilet',
        },
        slug: {
          id: 'closet-toilet',
          en: 'toilet',
        },
      },
      {
        id: 'washbasin',
        name: {
          id: 'Wastafel',
          en: 'Washbasin',
        },
        slug: {
          id: 'wastafel',
          en: 'washbasin',
        },
      },
      {
        id: 'shower',
        name: {
          id: 'Shower',
          en: 'Shower',
        },
        slug: {
          id: 'shower',
          en: 'shower',
        },
      },
      {
        id: 'faucet',
        name: {
          id: 'Kran',
          en: 'Faucet',
        },
        slug: {
          id: 'kran',
          en: 'faucet',
        },
      },
      {
        id: 'floor-drain',
        name: {
          id: 'Floor Drain',
          en: 'Floor Drain',
        },
        slug: {
          id: 'floor-drain',
          en: 'floor-drain',
        },
      },
    ],
  },

  {
    id: 'doors-windows',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Pintu, Jendela & Kusen',
      en: 'Doors, Windows & Frames',
    },
    slug: {
      id: 'pintu-jendela-kusen',
      en: 'doors-windows-frames',
    },
    sortOrder: 12,
    subcategories: [
      {
        id: 'door',
        name: {
          id: 'Pintu',
          en: 'Door',
        },
        slug: {
          id: 'pintu',
          en: 'door',
        },
      },
      {
        id: 'window',
        name: {
          id: 'Jendela',
          en: 'Window',
        },
        slug: {
          id: 'jendela',
          en: 'window',
        },
      },
      {
        id: 'frame',
        name: {
          id: 'Kusen',
          en: 'Door & Window Frame',
        },
        slug: {
          id: 'kusen',
          en: 'door-window-frame',
        },
      },
      {
        id: 'door-handle',
        name: {
          id: 'Handle Pintu',
          en: 'Door Handle',
        },
        slug: {
          id: 'handle-pintu',
          en: 'door-handle',
        },
      },
      {
        id: 'hinge',
        name: {
          id: 'Engsel',
          en: 'Hinge',
        },
        slug: {
          id: 'engsel',
          en: 'hinge',
        },
      },
      {
        id: 'lock',
        name: {
          id: 'Kunci',
          en: 'Lock',
        },
        slug: {
          id: 'kunci',
          en: 'lock',
        },
      },
    ],
  },

  {
    id: 'ceiling-partition',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Plafon & Partisi',
      en: 'Ceiling & Partition',
    },
    slug: {
      id: 'plafon-partisi',
      en: 'ceiling-partition',
    },
    sortOrder: 13,
    subcategories: [
      {
        id: 'gypsum',
        name: {
          id: 'Gypsum',
          en: 'Gypsum Board',
        },
        slug: {
          id: 'gypsum',
          en: 'gypsum-board',
        },
      },
      {
        id: 'grc',
        name: {
          id: 'GRC',
          en: 'GRC Board',
        },
        slug: {
          id: 'grc',
          en: 'grc-board',
        },
      },
      {
        id: 'pvc-ceiling',
        name: {
          id: 'Plafon PVC',
          en: 'PVC Ceiling',
        },
        slug: {
          id: 'plafon-pvc',
          en: 'pvc-ceiling',
        },
      },
      {
        id: 'fiber-cement',
        name: {
          id: 'Fiber Cement',
          en: 'Fiber Cement Board',
        },
        slug: {
          id: 'fiber-cement',
          en: 'fiber-cement-board',
        },
      },
      {
        id: 'ceiling-frame',
        name: {
          id: 'Rangka Plafon',
          en: 'Ceiling Frame',
        },
        slug: {
          id: 'rangka-plafon',
          en: 'ceiling-frame',
        },
      },
    ],
  },

  {
    id: 'construction-chemical',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Perekat & Chemical',
      en: 'Adhesives & Construction Chemicals',
    },
    slug: {
      id: 'perekat-chemical',
      en: 'adhesives-construction-chemicals',
    },
    sortOrder: 14,
    subcategories: [
      {
        id: 'adhesive',
        name: {
          id: 'Perekat',
          en: 'Adhesive',
        },
        slug: {
          id: 'perekat',
          en: 'adhesive',
        },
      },
      {
        id: 'sealant',
        name: {
          id: 'Sealant',
          en: 'Sealant',
        },
        slug: {
          id: 'sealant',
          en: 'sealant',
        },
      },
      {
        id: 'silicone',
        name: {
          id: 'Silicone',
          en: 'Silicone',
        },
        slug: {
          id: 'silicone',
          en: 'silicone',
        },
      },
      {
        id: 'epoxy',
        name: {
          id: 'Epoxy',
          en: 'Epoxy',
        },
        slug: {
          id: 'epoxy',
          en: 'epoxy',
        },
      },
      {
        id: 'bonding-agent',
        name: {
          id: 'Bonding Agent',
          en: 'Bonding Agent',
        },
        slug: {
          id: 'bonding-agent',
          en: 'bonding-agent',
        },
      },
    ],
  },

  {
    id: 'tools',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Perkakas & Alat',
      en: 'Tools & Equipment',
    },
    slug: {
      id: 'perkakas-alat',
      en: 'tools-equipment',
    },
    sortOrder: 15,
    subcategories: [
      {
        id: 'hand-tools',
        name: {
          id: 'Hand Tools',
          en: 'Hand Tools',
        },
        slug: {
          id: 'hand-tools',
          en: 'hand-tools',
        },
      },
      {
        id: 'power-tools',
        name: {
          id: 'Power Tools',
          en: 'Power Tools',
        },
        slug: {
          id: 'power-tools',
          en: 'power-tools',
        },
      },
      {
        id: 'drill',
        name: {
          id: 'Bor',
          en: 'Drill',
        },
        slug: {
          id: 'bor',
          en: 'drill',
        },
      },
      {
        id: 'grinder',
        name: {
          id: 'Gerinda',
          en: 'Grinder',
        },
        slug: {
          id: 'gerinda',
          en: 'grinder',
        },
      },
      {
        id: 'welding-machine',
        name: {
          id: 'Mesin Las',
          en: 'Welding Machine',
        },
        slug: {
          id: 'mesin-las',
          en: 'welding-machine',
        },
      },
      {
        id: 'ladder',
        name: {
          id: 'Tangga',
          en: 'Ladder',
        },
        slug: {
          id: 'tangga',
          en: 'ladder',
        },
      },
      {
        id: 'measuring-tools',
        name: {
          id: 'Alat Ukur',
          en: 'Measuring Tools',
        },
        slug: {
          id: 'alat-ukur',
          en: 'measuring-tools',
        },
      },
    ],
  },

  {
    id: 'hardware',
    type: PLATFORM_TYPES.MATERIAL,
    name: {
      id: 'Hardware & Aksesoris',
      en: 'Hardware & Accessories',
    },
    slug: {
      id: 'hardware-aksesoris',
      en: 'hardware-accessories',
    },
    sortOrder: 16,
    subcategories: [
      {
        id: 'nails',
        name: {
          id: 'Paku',
          en: 'Nails',
        },
        slug: {
          id: 'paku',
          en: 'nails',
        },
      },
      {
        id: 'screws',
        name: {
          id: 'Sekrup',
          en: 'Screws',
        },
        slug: {
          id: 'sekrup',
          en: 'screws',
        },
      },
      {
        id: 'bolts',
        name: {
          id: 'Baut',
          en: 'Bolts',
        },
        slug: {
          id: 'baut',
          en: 'bolts',
        },
      },
      {
        id: 'nuts',
        name: {
          id: 'Mur',
          en: 'Nuts',
        },
        slug: {
          id: 'mur',
          en: 'nuts',
        },
      },
      {
        id: 'fisher',
        name: {
          id: 'Fisher',
          en: 'Wall Plugs',
        },
        slug: {
          id: 'fisher',
          en: 'wall-plugs',
        },
      },
      {
        id: 'bracket',
        name: {
          id: 'Bracket',
          en: 'Bracket',
        },
        slug: {
          id: 'bracket',
          en: 'bracket',
        },
      },
    ],
  },
]


// ============================================================
// MATERIAL ATTRIBUTES
// ============================================================

export const MATERIAL_ATTRIBUTES = {
  diameter: {
    id: 'diameter',
    name: {
      id: 'Diameter',
      en: 'Diameter',
    },
    type: 'number',
    unit: 'mm',
    filterable: true,
    searchable: true,
  },

  length: {
    id: 'length',
    name: {
      id: 'Panjang',
      en: 'Length',
    },
    type: 'number',
    unit: 'm',
    filterable: true,
    searchable: true,
  },

  width: {
    id: 'width',
    name: {
      id: 'Lebar',
      en: 'Width',
    },
    type: 'number',
    unit: 'mm',
    filterable: true,
    searchable: true,
  },

  thickness: {
    id: 'thickness',
    name: {
      id: 'Tebal',
      en: 'Thickness',
    },
    type: 'number',
    unit: 'mm',
    filterable: true,
    searchable: true,
  },

  weight: {
    id: 'weight',
    name: {
      id: 'Berat',
      en: 'Weight',
    },
    type: 'number',
    unit: 'kg',
    filterable: true,
    searchable: true,
  },

  brand: {
    id: 'brand',
    name: {
      id: 'Merek',
      en: 'Brand',
    },
    type: 'select',
    filterable: true,
    searchable: true,
  },

  color: {
    id: 'color',
    name: {
      id: 'Warna',
      en: 'Color',
    },
    type: 'select',
    filterable: true,
    searchable: true,
  },

  size: {
    id: 'size',
    name: {
      id: 'Ukuran',
      en: 'Size',
    },
    type: 'select',
    filterable: true,
    searchable: true,
  },

  stock: {
    id: 'stock',
    name: {
      id: 'Ketersediaan',
      en: 'Availability',
    },
    type: 'stock',
    filterable: true,
    searchable: false,
  },

  location: {
    id: 'location',
    name: {
      id: 'Lokasi',
      en: 'Location',
    },
    type: 'location',
    filterable: true,
    searchable: false,
  },
}


// ============================================================
// SERVICES
// ============================================================

export const SERVICE_CATEGORIES = [
  {
    id: 'construction-workers',
    name: {
      id: 'Tukang Bangunan',
      en: 'Construction Workers',
    },
    slug: {
      id: 'tukang-bangunan',
      en: 'construction-workers',
    },
    subcategories: [
      {
        id: 'masonry',
        name: {
          id: 'Tukang Batu',
          en: 'Masonry',
        },
      },
      {
        id: 'carpentry',
        name: {
          id: 'Tukang Kayu',
          en: 'Carpentry',
        },
      },
      {
        id: 'steel-worker',
        name: {
          id: 'Tukang Besi',
          en: 'Steel Worker',
        },
      },
      {
        id: 'ceiling-worker',
        name: {
          id: 'Tukang Plafon',
          en: 'Ceiling Installer',
        },
      },
      {
        id: 'tile-worker',
        name: {
          id: 'Tukang Keramik',
          en: 'Tile Installer',
        },
      },
      {
        id: 'painter',
        name: {
          id: 'Tukang Cat',
          en: 'Painter',
        },
      },
    ],
  },

  {
    id: 'plumbing-service',
    name: {
      id: 'Plumbing',
      en: 'Plumbing',
    },
    slug: {
      id: 'plumbing',
      en: 'plumbing',
    },
    subcategories: [
      {
        id: 'pipe-repair',
        name: {
          id: 'Perbaikan Pipa',
          en: 'Pipe Repair',
        },
      },
      {
        id: 'water-installation',
        name: {
          id: 'Instalasi Air',
          en: 'Water Installation',
        },
      },
      {
        id: 'pump-service',
        name: {
          id: 'Servis Pompa',
          en: 'Pump Service',
        },
      },
      {
        id: 'tank-installation',
        name: {
          id: 'Instalasi Tandon',
          en: 'Water Tank Installation',
        },
      },
    ],
  },

  {
    id: 'electrical-service',
    name: {
      id: 'Listrik',
      en: 'Electrical',
    },
    slug: {
      id: 'listrik',
      en: 'electrical',
    },
    subcategories: [
      {
        id: 'electrical-installation',
        name: {
          id: 'Instalasi Listrik',
          en: 'Electrical Installation',
        },
      },
      {
        id: 'electrical-repair',
        name: {
          id: 'Perbaikan Listrik',
          en: 'Electrical Repair',
        },
      },
      {
        id: 'panel-installation',
        name: {
          id: 'Instalasi Panel',
          en: 'Panel Installation',
        },
      },
      {
        id: 'lighting-installation',
        name: {
          id: 'Instalasi Lampu',
          en: 'Lighting Installation',
        },
      },
      {
        id: 'cctv',
        name: {
          id: 'CCTV',
          en: 'CCTV',
        },
      },
    ],
  },

  {
    id: 'ac-service',
    name: {
      id: 'AC',
      en: 'Air Conditioning',
    },
    slug: {
      id: 'ac',
      en: 'air-conditioning',
    },
    subcategories: [
      {
        id: 'ac-cleaning',
        name: {
          id: 'Cuci AC',
          en: 'AC Cleaning',
        },
      },
      {
        id: 'ac-repair',
        name: {
          id: 'Servis AC',
          en: 'AC Repair',
        },
      },
      {
        id: 'ac-installation',
        name: {
          id: 'Pasang AC',
          en: 'AC Installation',
        },
      },
      {
        id: 'ac-uninstall',
        name: {
          id: 'Bongkar AC',
          en: 'AC Removal',
        },
      },
    ],
  },

  {
    id: 'renovation',
    name: {
      id: 'Renovasi',
      en: 'Renovation',
    },
    slug: {
      id: 'renovasi',
      en: 'renovation',
    },
    subcategories: [
      {
        id: 'house-renovation',
        name: {
          id: 'Renovasi Rumah',
          en: 'House Renovation',
        },
      },
      {
        id: 'bathroom-renovation',
        name: {
          id: 'Renovasi Kamar Mandi',
          en: 'Bathroom Renovation',
        },
      },
      {
        id: 'kitchen-renovation',
        name: {
          id: 'Renovasi Dapur',
          en: 'Kitchen Renovation',
        },
      },
      {
        id: 'waterproofing-service',
        name: {
          id: 'Waterproofing',
          en: 'Waterproofing Service',
        },
      },
    ],
  },

  {
    id: 'cleaning',
    name: {
      id: 'Cleaning',
      en: 'Cleaning',
    },
    slug: {
      id: 'cleaning',
      en: 'cleaning',
    },
    subcategories: [
      {
        id: 'general-cleaning',
        name: {
          id: 'General Cleaning',
          en: 'General Cleaning',
        },
      },
      {
        id: 'sofa-cleaning',
        name: {
          id: 'Cuci Sofa',
          en: 'Sofa Cleaning',
        },
      },
      {
        id: 'mattress-cleaning',
        name: {
          id: 'Cuci Kasur',
          en: 'Mattress Cleaning',
        },
      },
      {
        id: 'post-renovation',
        name: {
          id: 'Cleaning Pasca Renovasi',
          en: 'Post-Renovation Cleaning',
        },
      },
    ],
  },

  {
    id: 'technician',
    name: {
      id: 'Teknisi',
      en: 'Technicians',
    },
    slug: {
      id: 'teknisi',
      en: 'technicians',
    },
    subcategories: [
      {
        id: 'electronics',
        name: {
          id: 'Teknisi Elektronik',
          en: 'Electronics Technician',
        },
      },
      {
        id: 'pump-technician',
        name: {
          id: 'Teknisi Pompa',
          en: 'Pump Technician',
        },
      },
      {
        id: 'machinery',
        name: {
          id: 'Teknisi Mesin',
          en: 'Machinery Technician',
        },
      },
      {
        id: 'cctv-technician',
        name: {
          id: 'Teknisi CCTV',
          en: 'CCTV Technician',
        },
      },
    ],
  },
]


// ============================================================
// LOGISTICS
// ============================================================

export const VEHICLE_TYPES = [
  {
    id: 'motorcycle',
    name: {
      id: 'Motor',
      en: 'Motorcycle',
    },
  },
  {
    id: 'pickup',
    name: {
      id: 'Pickup',
      en: 'Pickup',
    },
  },
  {
    id: 'carry',
    name: {
      id: 'Carry',
      en: 'Carry',
    },
  },
  {
    id: 'l300',
    name: {
      id: 'L300',
      en: 'L300',
    },
  },
  {
    id: 'engkel',
    name: {
      id: 'Engkel',
      en: 'Light Truck',
    },
  },
  {
    id: 'double',
    name: {
      id: 'Double',
      en: 'Double Truck',
    },
  },
  {
    id: 'cdd',
    name: {
      id: 'CDD',
      en: 'CDD Truck',
    },
  },
  {
    id: 'fuso',
    name: {
      id: 'Fuso',
      en: 'Fuso Truck',
    },
  },
  {
    id: 'tronton',
    name: {
      id: 'Tronton',
      en: 'Tronton Truck',
    },
  },
]


export const LOGISTICS_CATEGORIES = [
  {
    id: 'courier',
    name: {
      id: 'Kurir',
      en: 'Courier',
    },
    slug: {
      id: 'kurir',
      en: 'courier',
    },
  },
  {
    id: 'material-delivery',
    name: {
      id: 'Pengiriman Material',
      en: 'Material Delivery',
    },
    slug: {
      id: 'pengiriman-material',
      en: 'material-delivery',
    },
  },
  {
    id: 'moving',
    name: {
      id: 'Jasa Pindahan',
      en: 'Moving Service',
    },
    slug: {
      id: 'jasa-pindahan',
      en: 'moving-service',
    },
  },
  {
    id: 'loading-unloading',
    name: {
      id: 'Bongkar Muat',
      en: 'Loading & Unloading',
    },
    slug: {
      id: 'bongkar-muat',
      en: 'loading-unloading',
    },
  },
  {
    id: 'pickup-delivery',
    name: {
      id: 'Pickup & Delivery',
      en: 'Pickup & Delivery',
    },
    slug: {
      id: 'pickup-delivery',
      en: 'pickup-delivery',
    },
  },
  {
    id: 'project-delivery',
    name: {
      id: 'Pengiriman Proyek',
      en: 'Project Delivery',
    },
    slug: {
      id: 'pengiriman-proyek',
      en: 'project-delivery',
    },
  },
]


// ============================================================
// PROPERTY
// ============================================================

export const PROPERTY_TYPES = [
  {
    id: 'house',
    name: {
      id: 'Rumah',
      en: 'House',
    },
    slug: {
      id: 'rumah',
      en: 'house',
    },
  },
  {
    id: 'villa',
    name: {
      id: 'Villa',
      en: 'Villa',
    },
    slug: {
      id: 'villa',
      en: 'villa',
    },
  },
  {
    id: 'land',
    name: {
      id: 'Tanah',
      en: 'Land',
    },
    slug: {
      id: 'tanah',
      en: 'land',
    },
  },
  {
    id: 'shop-house',
    name: {
      id: 'Ruko',
      en: 'Shop House',
    },
    slug: {
      id: 'ruko',
      en: 'shop-house',
    },
  },
  {
    id: 'warehouse',
    name: {
      id: 'Gudang',
      en: 'Warehouse',
    },
    slug: {
      id: 'gudang',
      en: 'warehouse',
    },
  },
  {
    id: 'boarding-house',
    name: {
      id: 'Kost',
      en: 'Boarding House',
    },
    slug: {
      id: 'kost',
      en: 'boarding-house',
    },
  },
  {
    id: 'apartment',
    name: {
      id: 'Apartemen',
      en: 'Apartment',
    },
    slug: {
      id: 'apartemen',
      en: 'apartment',
    },
  },
]


export const PROPERTY_TRANSACTION_TYPES = [
  {
    id: 'sale',
    name: {
      id: 'Dijual',
      en: 'For Sale',
    },
  },
  {
    id: 'rent',
    name: {
      id: 'Disewa',
      en: 'For Rent',
    },
  },
]


// ============================================================
// LOCATION
//
// Data lokasi demo. Struktur dibuat generik agar nanti
// dapat diganti dengan database/API tanpa mengubah UI.
// ============================================================

export const LOCATION_DATA = {
  country: {
    id: 'id',
    code: 'ID',
    name: {
      id: 'Indonesia',
      en: 'Indonesia',
    },
    slug: {
      id: 'indonesia',
      en: 'indonesia',
    },
  },

  provinces: [
    {
      id: 'bali',
      code: '51',
      name: {
        id: 'Bali',
        en: 'Bali',
      },
      slug: {
        id: 'bali',
        en: 'bali',
      },
      active: true,

      cities: [
        {
          id: 'denpasar',
          code: '5171',
          type: 'city',
          name: {
            id: 'Denpasar',
            en: 'Denpasar',
          },
          slug: {
            id: 'denpasar',
            en: 'denpasar',
          },
          active: true,
        },

        {
          id: 'badung',
          code: '5103',
          type: 'regency',
          name: {
            id: 'Badung',
            en: 'Badung',
          },
          slug: {
            id: 'badung',
            en: 'badung',
          },
          active: true,
        },

        {
          id: 'gianyar',
          code: '5104',
          type: 'regency',
          name: {
            id: 'Gianyar',
            en: 'Gianyar',
          },
          slug: {
            id: 'gianyar',
            en: 'gianyar',
          },
          active: true,
        },

        {
          id: 'tabanan',
          code: '5102',
          type: 'regency',
          name: {
            id: 'Tabanan',
            en: 'Tabanan',
          },
          slug: {
            id: 'tabanan',
            en: 'tabanan',
          },
          active: true,
        },

        {
          id: 'gianyar',
          code: '5104',
          type: 'regency',
          name: {
            id: 'Gianyar',
            en: 'Gianyar',
          },
          slug: {
            id: 'gianyar',
            en: 'gianyar',
          },
          active: true,
        },
      ],
    },

    {
      id: 'lampung',
      code: '18',
      name: {
        id: 'Lampung',
        en: 'Lampung',
      },
      slug: {
        id: 'lampung',
        en: 'lampung',
      },
      active: false,

      cities: [
        {
          id: 'bandar-lampung',
          code: '1871',
          type: 'city',
          name: {
            id: 'Bandar Lampung',
            en: 'Bandar Lampung',
          },
          slug: {
            id: 'bandar-lampung',
            en: 'bandar-lampung',
          },
          active: false,
        },
      ],
    },

    {
      id: 'jakarta',
      code: '31',
      name: {
        id: 'DKI Jakarta',
        en: 'Jakarta',
      },
      slug: {
        id: 'dki-jakarta',
        en: 'jakarta',
      },
      active: false,

      cities: [
        {
          id: 'central-jakarta',
          code: '3171',
          type: 'city',
          name: {
            id: 'Jakarta Pusat',
            en: 'Central Jakarta',
          },
          slug: {
            id: 'jakarta-pusat',
            en: 'central-jakarta',
          },
          active: false,
        },
      ],
    },

    {
      id: 'east-java',
      code: '35',
      name: {
        id: 'Jawa Timur',
        en: 'East Java',
      },
      slug: {
        id: 'jawa-timur',
        en: 'east-java',
      },
      active: false,

      cities: [
        {
          id: 'surabaya',
          code: '3578',
          type: 'city',
          name: {
            id: 'Surabaya',
            en: 'Surabaya',
          },
          slug: {
            id: 'surabaya',
            en: 'surabaya',
          },
          active: false,
        },
      ],
    },
  ],
}


// ============================================================
// REGION STATUS
// ============================================================

export const REGION_STATUS = {
  ACTIVE: 'active',
  COMING_SOON: 'coming_soon',
  PAUSED: 'paused',
}


export const REGIONS = [
  {
    id: 'bali',
    countryId: 'id',
    provinceId: 'bali',
    status: REGION_STATUS.ACTIVE,
  },
  {
    id: 'lampung',
    countryId: 'id',
    provinceId: 'lampung',
    status: REGION_STATUS.COMING_SOON,
  },
  {
    id: 'jakarta',
    countryId: 'id',
    provinceId: 'jakarta',
    status: REGION_STATUS.COMING_SOON,
  },
  {
    id: 'east-java',
    countryId: 'id',
    provinceId: 'east-java',
    status: REGION_STATUS.COMING_SOON,
  },
]


// ============================================================
// LOCATION SOURCE
// ============================================================

export const LOCATION_SOURCE = {
  MANUAL: 'manual',
  GPS: 'gps',
  IP: 'ip',
  ADDRESS: 'address',
  PROJECT: 'project',
}


// ============================================================
// FULFILLMENT
// ============================================================

export const FULFILLMENT_METHODS = [
  {
    id: 'self_pickup',
    name: {
      id: 'Ambil Sendiri',
      en: 'Self Pickup',
    },
    paymentRequiredAtCheckout: false,
  },

  {
    id: 'platform_delivery',
    name: {
      id: 'Pengiriman Bagus',
      en: 'Bagus Delivery',
    },
    paymentRequiredAtCheckout: true,
  },

  {
    id: 'provider_delivery',
    name: {
      id: 'Pengiriman Penyedia',
      en: 'Provider Delivery',
    },
    paymentRequiredAtCheckout: true,
  },
]


// ============================================================
// PAYMENT METHODS
// ============================================================

export const PAYMENT_METHODS = [
  {
    id: 'none',
    name: {
      id: 'Tidak ada pembayaran melalui Bagus',
      en: 'No payment through Bagus',
    },
    availableFor: ['self_pickup'],
  },

  {
    id: 'cod',
    name: {
      id: 'COD',
      en: 'Cash on Delivery',
    },
    availableFor: [
      'platform_delivery',
      'provider_delivery',
    ],
    providerReceivesDirectly: true,
  },

  {
    id: 'online',
    name: {
      id: 'Pembayaran Online',
      en: 'Online Payment',
    },
    availableFor: [
      'platform_delivery',
      'provider_delivery',
    ],
    providerReceivesDirectly: false,
  },

  {
    id: 'direct_transfer',
    name: {
      id: 'Transfer Langsung ke Penyedia',
      en: 'Direct Transfer to Provider',
    },
    availableFor: [
      'provider_delivery',
    ],
    providerReceivesDirectly: true,
  },
]


// ============================================================
// ORDER STATUS
// ============================================================

export const ORDER_STATUSES = {
  PENDING_PROVIDER_CONFIRMATION: {
    id: 'PENDING_PROVIDER_CONFIRMATION',
    name: {
      id: 'Menunggu Konfirmasi Penyedia',
      en: 'Waiting for Provider Confirmation',
    },
  },

  CONFIRMED: {
    id: 'CONFIRMED',
    name: {
      id: 'Pesanan Dikonfirmasi',
      en: 'Order Confirmed',
    },
  },

  READY_FOR_PICKUP: {
    id: 'READY_FOR_PICKUP',
    name: {
      id: 'Siap Diambil',
      en: 'Ready for Pickup',
    },
  },

  PICKED_UP: {
    id: 'PICKED_UP',
    name: {
      id: 'Sudah Diambil',
      en: 'Picked Up',
    },
  },

  IN_TRANSIT: {
    id: 'IN_TRANSIT',
    name: {
      id: 'Dalam Perjalanan',
      en: 'In Transit',
    },
  },

  RECEIVED_AT_HUB: {
    id: 'RECEIVED_AT_HUB',
    name: {
      id: 'Diterima di Hub',
      en: 'Received at Hub',
    },
  },

  READY_FOR_DELIVERY: {
    id: 'READY_FOR_DELIVERY',
    name: {
      id: 'Siap Dikirim',
      en: 'Ready for Delivery',
    },
  },

  OUT_FOR_DELIVERY: {
    id: 'OUT_FOR_DELIVERY',
    name: {
      id: 'Sedang Diantar',
      en: 'Out for Delivery',
    },
  },

  DELIVERED: {
    id: 'DELIVERED',
    name: {
      id: 'Terkirim',
      en: 'Delivered',
    },
  },

  COMPLETED: {
    id: 'COMPLETED',
    name: {
      id: 'Selesai',
      en: 'Completed',
    },
  },

  CANCELLED: {
    id: 'CANCELLED',
    name: {
      id: 'Dibatalkan',
      en: 'Cancelled',
    },
  },
}


// ============================================================
// PAYMENT STATUS
// ============================================================

export const PAYMENT_STATUSES = {
  NOT_REQUIRED: 'NOT_REQUIRED',
  PENDING: 'PENDING',
  PAID: 'PAID',
  COD_PENDING: 'COD_PENDING',
  SETTLED: 'SETTLED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
}


// ============================================================
// COMMISSION
// ============================================================

export const COMMISSION_RULES = [
  {
    providerType: 'individual',
    transactionType: 'material',
    rate: 0.02,
  },

  {
    providerType: 'company',
    transactionType: 'material',
    rate: 0.03,
  },

  {
    providerType: 'individual',
    transactionType: 'service',
    rate: 0.03,
  },

  {
    providerType: 'company',
    transactionType: 'service',
    rate: 0.03,
  },
]


// ============================================================
// WALLET TRANSACTION TYPES
// ============================================================

export const WALLET_TRANSACTION_TYPES = {
  COMMISSION: 'COMMISSION',
  PAYMENT_SETTLEMENT: 'PAYMENT_SETTLEMENT',
  BALANCE_TOPUP: 'BALANCE_TOPUP',
  REFUND: 'REFUND',
  ADJUSTMENT: 'ADJUSTMENT',
  WITHDRAWAL: 'WITHDRAWAL',
}


// ============================================================
// SERVICE AREA
// ============================================================

export const SERVICE_AREA_TYPES = [
  {
    id: 'city',
    name: {
      id: 'Kota / Kabupaten',
      en: 'City / Regency',
    },
  },

  {
    id: 'district',
    name: {
      id: 'Kecamatan',
      en: 'District',
    },
  },

  {
    id: 'radius',
    name: {
      id: 'Radius',
      en: 'Radius',
    },
  },

  {
    id: 'province',
    name: {
      id: 'Provinsi',
      en: 'Province',
    },
  },
]


// ============================================================
// SEARCH SORT
// ============================================================

export const SEARCH_SORT_OPTIONS = [
  {
    id: 'relevance',
    name: {
      id: 'Paling Relevan',
      en: 'Most Relevant',
    },
  },

  {
    id: 'price_asc',
    name: {
      id: 'Harga Terendah',
      en: 'Lowest Price',
    },
  },

  {
    id: 'price_desc',
    name: {
      id: 'Harga Tertinggi',
      en: 'Highest Price',
    },
  },

  {
    id: 'nearest',
    name: {
      id: 'Terdekat',
      en: 'Nearest',
    },
  },

  {
    id: 'rating',
    name: {
      id: 'Rating',
      en: 'Rating',
    },
  },

  {
    id: 'newest',
    name: {
      id: 'Terbaru',
      en: 'Newest',
    },
  },
]


// ============================================================
// SEARCH SYNONYMS
// ============================================================

export const SEARCH_SYNONYMS = {
  besi: [
    'besi',
    'steel',
    'iron',
    'rebar',
    'besi beton',
  ],

  semen: [
    'semen',
    'cement',
  ],

  pasir: [
    'pasir',
    'sand',
  ],

  truck: [
    'truck',
    'truk',
    'angkutan',
    'angkut',
  ],

  pickup: [
    'pickup',
    'pick up',
    'mobil pickup',
  ],

  tukang: [
    'tukang',
    'worker',
    'construction worker',
    'builder',
  ],

  listrik: [
    'listrik',
    'electrical',
    'electric',
  ],

  plumbing: [
    'plumbing',
    'pipa',
    'air',
  ],

  ac: [
    'ac',
    'air conditioner',
    'air conditioning',
  ],
}


// ============================================================
// HOMEPAGE CATEGORY SHORTCUTS
//
// Homepage tidak menampilkan seluruh 16 kategori.
// Ini hanya kategori utama yang tampil di layar.
// ============================================================

export const HOMEPAGE_MATERIAL_CATEGORY_IDS = [
  'steel-iron',
  'cement-concrete',
  'sand-stone',
  'wood-plywood',
  'roofing',
  'flooring',
  'paint-finishing',
  'plumbing',
  'electrical',
  'sanitary',
]


// ============================================================
// HOMEPAGE SECTIONS
// ============================================================

export const HOMEPAGE_SECTIONS = [
  {
    id: 'materials-nearby',
    type: 'material',
    locationAware: true,
  },

  {
    id: 'material-prices',
    type: 'price',
    locationAware: true,
  },

  {
    id: 'services-nearby',
    type: 'service',
    locationAware: true,
  },

  {
    id: 'logistics-nearby',
    type: 'logistics',
    locationAware: true,
  },

  {
    id: 'properties-nearby',
    type: 'property',
    locationAware: true,
  },

  {
    id: 'promotions',
    type: 'promotion',
    locationAware: true,
  },

  {
    id: 'articles',
    type: 'article',
    locationAware: false,
  },
]


// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function localized(item, language = 'id') {
  if (!item) return ''

  if (typeof item === 'string') {
    return item
  }

  return (
    item[language] ??
    item.id ??
    item.en ??
    ''
  )
}


export function getMaterialCategory(categoryId) {
  return MATERIAL_CATEGORIES.find(
    category => category.id === categoryId
  )
}


export function getMaterialSubcategory(categoryId, subcategoryId) {
  const category = getMaterialCategory(categoryId)

  if (!category) return null

  return category.subcategories?.find(
    item => item.id === subcategoryId
  )
}


export function getActiveRegions() {
  return REGIONS.filter(
    region => region.status === REGION_STATUS.ACTIVE
  )
}


export function getRegionStatus(regionId) {
  const region = REGIONS.find(
    item => item.id === regionId
  )

  return region?.status ?? REGION_STATUS.COMING_SOON
}


export function getProvince(provinceId) {
  return LOCATION_DATA.provinces.find(
    province => province.id === provinceId
  )
}


export function getCity(provinceId, cityId) {
  const province = getProvince(provinceId)

  if (!province) return null

  return province.cities.find(
    city => city.id === cityId
  )
}


export function getFulfillmentMethod(methodId) {
  return FULFILLMENT_METHODS.find(
    method => method.id === methodId
  )
}


export function getPaymentMethodsForFulfillment(fulfillmentId) {
  return PAYMENT_METHODS.filter(
    payment => payment.availableFor.includes(fulfillmentId)
  )
}


export function getOrderStatus(statusId) {
  return Object.values(ORDER_STATUSES).find(
    status => status.id === statusId
  )
}


export function getCommissionRate(providerType, transactionType) {
  const rule = COMMISSION_RULES.find(
    item =>
      item.providerType === providerType &&
      item.transactionType === transactionType
  )

  return rule?.rate ?? 0
}


// ============================================================
// DEFAULT APPLICATION CONTEXT
//
// Tidak ada "default Bali" di sini.
// Bali hanya menjadi contoh lokasi demo.
// ============================================================

export const DEFAULT_APP_CONTEXT = {
  language: 'id',

  location: {
    countryId: 'id',
    provinceId: null,
    cityId: null,
    districtId: null,

    source: null,
    confidence: null,
  },

  search: {
    query: '',
    category: null,
    sort: 'relevance',
  },
}