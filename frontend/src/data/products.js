export const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "gpu", label: "Tarjetas Gráficas" },
  { id: "perifericos", label: "Periféricos" },
  { id: "monitores", label: "Monitores" },
  { id: "audio", label: "Audio" },
  { id: "sillas", label: "Sillas Gaming" },
  { id: "pc", label: "PC Gaming" }
];

export const MOCK_PRODUCTS = [
  {
    id: "rtx-4090-supreme",
    nombre: "NVIDIA GeForce RTX 4090 SUPREME",
    categoria: "gpu",
    precio: 1899,
    precioAnterior: 2199,
    stock: 8,
    marca: "ASUS ROG",
    imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=450&fit=crop",
    descripcion:
      "La GPU definitiva para gaming 4K y creación de contenido. 24GB GDDR6X, ray tracing de última generación y refrigeración líquida personalizada.",
    atributos: {
      vram: "24GB GDDR6X",
      nucleos_cuda: 16384,
      tdp: "450W",
      bus: "PCIe 4.0 x16"
    },
    variantes: ["negro"],
    etiquetas: ["flagship", "4k", "ray-tracing"],
    industria: ["gaming", "streaming"],
    destacado: true
  },
  {
    id: "teclado-phantom-rgb",
    nombre: "Phantom MK-900 RGB Mecánico",
    categoria: "perifericos",
    precio: 189,
    stock: 45,
    marca: "HyperX",
    imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=450&fit=crop",
    descripcion:
      "Teclado mecánico full-size con switches ópticos, iluminación RGB por tecla y reposamuñecas magnético de espuma viscoelástica.",
    atributos: {
      switches: "Ópticos lineales",
      layout: "Full-size (104 teclas)",
      polling_rate: "8000Hz",
      anti_ghosting: "N-key rollover"
    },
    variantes: ["negro", "blanco"],
    etiquetas: ["rgb", "mecanico", "esports"],
    industria: ["gaming"]
  },
  {
    id: "monitor-odyssey-240",
    nombre: "Odyssey Neo G9 49\" 240Hz",
    categoria: "monitores",
    precio: 1499,
    precioAnterior: 1799,
    stock: 12,
    marca: "Samsung",
    imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=450&fit=crop",
    descripcion:
      "Monitor ultrawide curvo DQHD con Mini LED, 240Hz y 1ms de respuesta. La inmersión definitiva para simuladores y shooters competitivos.",
    atributos: {
      resolucion: "5120 x 1440",
      panel: "Mini LED VA",
      refresh_rate: "240Hz",
      curvatura: "1000R"
    },
    variantes: ["negro"],
    etiquetas: ["ultrawide", "240hz", "mini-led"],
    industria: ["gaming", "productividad"],
    destacado: true
  },
  {
    id: "auriculares-void-pro",
    nombre: "Void Pro X Wireless 7.1",
    categoria: "audio",
    precio: 279,
    stock: 30,
    marca: "SteelSeries",
    imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=450&fit=crop",
    descripcion:
      "Auriculares inalámbricos con sonido surround 7.1, micrófono retráctil con cancelación de ruido y 40 horas de batería.",
    atributos: {
      drivers: "50mm neodimio",
      conectividad: "2.4GHz + Bluetooth 5.2",
      bateria_horas: 40,
      peso_g: 320
    },
    variantes: ["negro", "blanco"],
    etiquetas: ["wireless", "7.1", "esports"],
    industria: ["gaming", "streaming"]
  },
  {
    id: "silla-titan-elite",
    nombre: "Titan Elite X Ergonómica",
    categoria: "sillas",
    precio: 549,
    stock: 18,
    marca: "Secretlab",
    imagen: "https://images.unsplash.com/photo-1598550476339-d983d48df170?w=600&h=450&fit=crop",
    descripcion:
      "Silla gaming premium con soporte lumbar 4D, reposacabezas magnético, cuero NEO™ híbrido y estructura de acero reforzado.",
    atributos: {
      peso_max_kg: 180,
      reclinacion: "85° - 165°",
      material: "Cuero NEO híbrido",
      garantia_anos: 5
    },
    variantes: ["negro", "morado"],
    etiquetas: ["ergonomico", "premium"],
    industria: ["gaming", "oficina"]
  },
  {
    id: "mouse-apex-pro",
    nombre: "Apex Pro Wireless",
    categoria: "perifericos",
    precio: 149,
    stock: 60,
    marca: "Logitech G",
    imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=450&fit=crop",
    descripcion:
      "Mouse ultraligero de 63g con sensor HERO 2 de 32K DPI, switches mecánicos y carga inalámbrica POWERPLAY compatible.",
    atributos: {
      dpi_max: 32000,
      peso_g: 63,
      polling_rate: "2000Hz",
      botones: 5
    },
    variantes: ["negro", "blanco"],
    etiquetas: ["wireless", "ultraligero", "fps"],
    industria: ["gaming"]
  },
  {
    id: "pc-nexus-ultra",
    nombre: "NEXUS ULTRA Prebuilt i9 + RTX 4080",
    categoria: "pc",
    precio: 3299,
    stock: 5,
    marca: "NEXUS",
    imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=450&fit=crop",
    descripcion:
      "PC gaming ensamblado a mano con Intel Core i9-14900K, RTX 4080 Super, 64GB DDR5 y SSD NVMe 2TB. Listo para dominar cualquier título.",
    atributos: {
      cpu: "Intel Core i9-14900K",
      gpu: "RTX 4080 Super 16GB",
      ram: "64GB DDR5-6000",
      almacenamiento: "2TB NVMe Gen4"
    },
    variantes: ["negro con RGB"],
    etiquetas: ["prebuilt", "flagship", "i9"],
    industria: ["gaming", "streaming", "creacion"],
    destacado: true
  },
  {
    id: "vr-quest-pro",
    nombre: "Meta Quest Pro VR Headset",
    categoria: "perifericos",
    precio: 999,
    precioAnterior: 1199,
    stock: 15,
    marca: "Meta",
    imagen: "https://images.unsplash.com/photo-1622979135225-d2fe269b5a0e?w=600&h=450&fit=crop",
    descripcion:
      "Headset VR standalone con tracking de ojos y cara, controles Touch Pro y pantallas pancake de alta resolución para experiencias inmersivas.",
    atributos: {
      resolucion_por_ojo: "1800 x 1920",
      refresh_rate: "90Hz",
      fov: "106°",
      almacenamiento: "256GB"
    },
    variantes: ["gris"],
    etiquetas: ["vr", "standalone", "mixed-reality"],
    industria: ["gaming", "productividad"]
  }
];
