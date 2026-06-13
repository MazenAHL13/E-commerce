import { ObjectId } from "mongodb";
import { getMongoDb } from "../db/mongo.js";

export async function crearProducto(producto) {
  const db = getMongoDb();
  const collection = db.collection("productos");

  const documento = {
    ...producto,
    created_at: new Date()
  };

  const result = await collection.insertOne(documento);

  return {
    _id: result.insertedId,
    ...documento
  };
}

export async function buscarProductos(filters) {
  const db = getMongoDb();
  const collection = db.collection("productos");
  const query = buildProductosQuery(filters);

  return collection.find(query).limit(50).toArray();
}

export async function actualizarProducto(id, producto) {
  const db = getMongoDb();
  const collection = db.collection("productos");
  const objectId = parseObjectId(id);

  const updateFields = Object.fromEntries(
    Object.entries(producto).filter(([, value]) => value !== undefined)
  );

  if (Object.keys(updateFields).length === 0) {
    throw new Error("DATOS_INVALIDOS");
  }

  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: updateFields
    },
    {
      returnDocument: "after"
    }
  );

  if (!result) {
    throw new Error("PRODUCTO_NO_EXISTE");
  }

  return result;
}

export async function eliminarProducto(id) {
  const db = getMongoDb();
  const collection = db.collection("productos");
  const objectId = parseObjectId(id);

  const result = await collection.findOneAndDelete({ _id: objectId });

  if (!result) {
    throw new Error("PRODUCTO_NO_EXISTE");
  }

  return result;
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

function parseObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("ID_INVALIDO");
  }

  return new ObjectId(id);
}
