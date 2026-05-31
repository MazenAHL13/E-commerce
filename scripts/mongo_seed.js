db = db.getSiblingDB("ecommerce");

const productos = [
  {
    nombre: "Polera oversize",
    categoria: "ropa",
    precio: 25,
    stock: 80,
    marca: "UrbanWear",
    atributos: {
      tallas: ["S", "M", "L", "XL"],
      material: "algodon",
      genero: "unisex"
    },
    variantes: ["negro", "blanco", "azul"],
    etiquetas: ["ropa", "casual", "black-friday"],
    industria: ["moda"]
  },
  {
    nombre: "Laptop gamer",
    categoria: "electronica",
    precio: 1200,
    stock: 15,
    marca: "Lenovo",
    atributos: {
      voltaje: "220V",
      ram: "16GB",
      almacenamiento: "512GB SSD",
      garantia_meses: 12
    },
    variantes: ["negro", "gris"],
    etiquetas: ["gaming", "black-friday", "electronica"],
    industria: ["tecnologia", "computacion"]
  },
  {
    nombre: "Silla ergonomica",
    categoria: "muebles",
    precio: 180,
    stock: 20,
    marca: "HomeOffice",
    atributos: {
      material: "malla y metal",
      peso_kg: 12,
      requiere_armado: true
    },
    variantes: ["negro"],
    etiquetas: ["oficina", "ergonomico", "black-friday"],
    industria: ["hogar", "oficina"]
  },
  {
    nombre: "Set de velas decorativas",
    categoria: "adornos",
    precio: 18,
    stock: 50,
    marca: "CasaLuz",
    atributos: {
      material: "cera de soya",
      aroma: "vainilla",
      piezas: 3
    },
    variantes: ["crema", "rosa"],
    etiquetas: ["hogar", "decoracion", "regalo"],
    industria: ["decoracion"]
  },
  {
    nombre: "Bateria de cocina",
    categoria: "utensilios de cocina",
    precio: 95,
    stock: 25,
    marca: "ChefPro",
    atributos: {
      piezas: 8,
      material: "acero inoxidable",
      apto_induccion: true
    },
    variantes: ["plateado"],
    etiquetas: ["cocina", "hogar", "oferta"],
    industria: ["gastronomia", "hogar"]
  }
];

db.productos.deleteMany({});
db.productos.insertMany(productos);

db.productos.createIndex({ categoria: 1 });
db.productos.createIndex({ precio: 1 });
db.productos.createIndex({ marca: 1 });
db.productos.createIndex({ etiquetas: 1 });
db.productos.createIndex({ industria: 1 });

print("Coleccion productos cargada correctamente");
