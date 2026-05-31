import { getMongoDb } from "../db/mongo.js";

export async function buscarProductos(filters) {
  const db = getMongoDb();
  const collection = db.collection("productos");
  const query = buildProductosQuery(filters);

  return collection.find(query).limit(50).toArray();
}

function buildProductosQuery({ categoria, precioMin, precioMax, etiqueta, marca, industria }) {
  const and = [];

  if (categoria) {
    and.push({ categoria });
  }

  if (precioMin || precioMax) {
    const precio = {};

    if (precioMin) {
      precio.$gt = Number(precioMin);
    }

    if (precioMax) {
      precio.$lt = Number(precioMax);
    }

    and.push({ precio });
  }

  if (industria) {
    and.push({ industria });
  }

  if (etiqueta || marca) {
    const or = [];

    if (etiqueta) {
      or.push({ etiquetas: etiqueta });
    }

    if (marca) {
      or.push({ marca });
    }

    and.push({ $or: or });
  }

  if (and.length === 0) {
    return {};
  }

  if (and.length === 1) {
    return and[0];
  }

  return { $and: and };
}
