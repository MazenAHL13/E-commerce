import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
  obtenerClientePorId
} from "../services/clientes.service.js";

export async function getClientes(_req, res, next) {
  try {
    const clientes = await listarClientes();
    return res.json(clientes);
  } catch (error) {
    return next(error);
  }
}

export async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;
    const cliente = await obtenerClientePorId(id);
    return res.json(cliente);
  } catch (error) {
    if (error.message === "CLIENTE_NO_EXISTE") {
      return res.status(404).json({
        error: "cliente no encontrado"
      });
    }

    return next(error);
  }
}

export async function postCliente(req, res, next) {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        error: "nombre y email son obligatorios"
      });
    }

    const cliente = await crearCliente({ nombre, email, telefono });
    return res.status(201).json(cliente);
  } catch (error) {
    return next(error);
  }
}

export async function putCliente(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;

    if (!nombre && !email && telefono === undefined) {
      return res.status(400).json({
        error: "debe enviar al menos un campo para actualizar"
      });
    }

    const cliente = await actualizarCliente(id, { nombre, email, telefono });
    return res.json(cliente);
  } catch (error) {
    if (error.message === "CLIENTE_NO_EXISTE") {
      return res.status(404).json({
        error: "cliente no encontrado"
      });
    }

    return next(error);
  }
}

export async function deleteCliente(req, res, next) {
  try {
    const { id } = req.params;
    const cliente = await eliminarCliente(id);
    return res.json({
      mensaje: "cliente eliminado",
      cliente
    });
  } catch (error) {
    if (error.message === "CLIENTE_NO_EXISTE") {
      return res.status(404).json({
        error: "cliente no encontrado"
      });
    }

    return next(error);
  }
}
