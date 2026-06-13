import { useEffect, useState } from "react";
import {
  createCliente,
  deleteCliente,
  deleteOrden,
  fetchClientes,
  fetchClientesSobrePromedio,
  fetchHealth,
  fetchOrdenes,
  fetchOrdenesValidadas,
  fetchResumenOrdenes,
  updateCliente,
  updateOrdenEstado
} from "../services/api.js";

const initialClienteForm = {
  nombre: "",
  email: "",
  telefono: ""
};

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
}

export default function ApiDemo() {
  const [health, setHealth] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [resumenOrdenes, setResumenOrdenes] = useState([]);
  const [clientesSobrePromedio, setClientesSobrePromedio] = useState([]);
  const [ordenesValidadas, setOrdenesValidadas] = useState([]);
  const [clienteForm, setClienteForm] = useState(initialClienteForm);
  const [editingClienteId, setEditingClienteId] = useState("");
  const [estadoOrdenMap, setEstadoOrdenMap] = useState({});
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPanel().finally(() => setLoading(false));
  }, []);

  async function cargarPanel() {
    const [
      healthData,
      clientesData,
      ordenesData,
      resumenData,
      clientesPromedioData,
      ordenesValidadasData
    ] = await Promise.all([
      fetchHealth(),
      fetchClientes(),
      fetchOrdenes(),
      fetchResumenOrdenes(),
      fetchClientesSobrePromedio(),
      fetchOrdenesValidadas()
    ]);

    setHealth(healthData);
    setClientes(clientesData);
    setOrdenes(ordenesData);
    setResumenOrdenes(resumenData);
    setClientesSobrePromedio(clientesPromedioData);
    setOrdenesValidadas(ordenesValidadasData);
    setEstadoOrdenMap(
      Object.fromEntries(
        ordenesData.map((entry) => [entry.orden.id, entry.orden.estado])
      )
    );
  }

  async function handleClienteSubmit(event) {
    event.preventDefault();
    setFeedback("");

    try {
      if (editingClienteId) {
        await updateCliente(editingClienteId, clienteForm);
        setFeedback("Cliente actualizado correctamente.");
      } else {
        await createCliente(clienteForm);
        setFeedback("Cliente creado correctamente.");
      }

      setClienteForm(initialClienteForm);
      setEditingClienteId("");
      await cargarPanel();
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  }

  function handleEditCliente(cliente) {
    setEditingClienteId(cliente.id);
    setClienteForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono || ""
    });
  }

  async function handleDeleteCliente(id) {
    setFeedback("");

    try {
      await deleteCliente(id);
      setFeedback("Cliente eliminado correctamente.");
      if (editingClienteId === id) {
        setEditingClienteId("");
        setClienteForm(initialClienteForm);
      }
      await cargarPanel();
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  }

  async function handleEstadoOrden(ordenId) {
    setFeedback("");

    try {
      await updateOrdenEstado(ordenId, estadoOrdenMap[ordenId] || "confirmada");
      setFeedback("Estado de orden actualizado.");
      await cargarPanel();
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  }

  async function handleDeleteOrden(ordenId) {
    setFeedback("");

    try {
      await deleteOrden(ordenId);
      setFeedback("Orden eliminada correctamente.");
      await cargarPanel();
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  }

  return (
    <section className="section container">
      <div className="section__header">
        <div>
          <h1 className="section__title">
            Panel <span>API</span>
          </h1>
          <p className="section__desc">
            Vista de demostración para consumir endpoints reales de clientes, órdenes y reportes.
          </p>
        </div>
        <button className="btn btn--outline btn--sm" onClick={() => cargarPanel()}>
          Recargar panel
        </button>
      </div>

      {feedback && <div className="api-feedback">{feedback}</div>}

      {loading ? (
        <div className="loading">Cargando panel...</div>
      ) : (
        <div className="api-grid">
          <div className="api-card">
            <div className="api-card__label">Health</div>
            <h2 className="api-card__title">{health?.service || "Sin conexión"}</h2>
            <p className="api-card__metric">{health?.status || "error"}</p>
          </div>

          <div className="api-card">
            <div className="api-card__label">Clientes</div>
            <h2 className="api-card__title">CRUD PostgreSQL</h2>
            <p className="api-card__metric">{clientes.length} registros</p>
          </div>

          <div className="api-card">
            <div className="api-card__label">Órdenes</div>
            <h2 className="api-card__title">Integración relacional</h2>
            <p className="api-card__metric">{ordenes.length} órdenes</p>
          </div>

          <div className="api-card">
            <div className="api-card__label">Reportes</div>
            <h2 className="api-card__title">Vistas y subconsultas</h2>
            <p className="api-card__metric">{resumenOrdenes.length} filas</p>
          </div>

          <div className="api-panel api-panel--wide">
            <div className="api-panel__header">
              <div>
                <h2 className="api-panel__title">
                  {editingClienteId ? "Editar cliente" : "Crear cliente"}
                </h2>
                <p className="api-panel__desc">Usa `POST /clientes` y `PUT /clientes/:id`.</p>
              </div>
            </div>

            <form className="api-form" onSubmit={handleClienteSubmit}>
              <input
                className="filters__search"
                placeholder="Nombre"
                value={clienteForm.nombre}
                onChange={(event) =>
                  setClienteForm((current) => ({ ...current, nombre: event.target.value }))
                }
              />
              <input
                className="filters__search"
                placeholder="Email"
                value={clienteForm.email}
                onChange={(event) =>
                  setClienteForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              <input
                className="filters__search"
                placeholder="Teléfono"
                value={clienteForm.telefono}
                onChange={(event) =>
                  setClienteForm((current) => ({ ...current, telefono: event.target.value }))
                }
              />
              <div className="api-form__actions">
                <button className="btn btn--primary btn--sm" type="submit">
                  {editingClienteId ? "Guardar cambios" : "Crear cliente"}
                </button>
                {editingClienteId && (
                  <button
                    className="btn btn--outline btn--sm"
                    type="button"
                    onClick={() => {
                      setEditingClienteId("");
                      setClienteForm(initialClienteForm);
                    }}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="api-panel api-panel--wide">
            <div className="api-panel__header">
              <div>
                <h2 className="api-panel__title">Clientes cargados</h2>
                <p className="api-panel__desc">Muestra `GET /clientes` y `DELETE /clientes/:id`.</p>
              </div>
            </div>

            <div className="api-table-wrap">
              <table className="api-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono || "-"}</td>
                      <td>{formatDate(cliente.created_at)}</td>
                      <td className="api-table__actions">
                        <button className="btn btn--outline btn--sm" onClick={() => handleEditCliente(cliente)}>
                          Editar
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={() => handleDeleteCliente(cliente.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="api-panel api-panel--wide">
            <div className="api-panel__header">
              <div>
                <h2 className="api-panel__title">Órdenes</h2>
                <p className="api-panel__desc">Usa `GET /ordenes`, `PUT /ordenes/:id/estado` y `DELETE /ordenes/:id`.</p>
              </div>
            </div>

            <div className="api-order-list">
              {ordenes.map((entry) => (
                <article key={entry.orden.id} className="api-order-card">
                  <div className="api-order-card__top">
                    <div>
                      <div className="api-card__label">{entry.factura?.numero_factura || entry.orden.id}</div>
                      <h3 className="api-order-card__title">{formatMoney(entry.orden.total)}</h3>
                    </div>
                    <div className="api-order-card__controls">
                      <select
                        className="filters__select"
                        value={estadoOrdenMap[entry.orden.id] || entry.orden.estado}
                        onChange={(event) =>
                          setEstadoOrdenMap((current) => ({
                            ...current,
                            [entry.orden.id]: event.target.value
                          }))
                        }
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmada">confirmada</option>
                        <option value="enviado">enviado</option>
                        <option value="entregado">entregado</option>
                      </select>
                      <button className="btn btn--outline btn--sm" onClick={() => handleEstadoOrden(entry.orden.id)}>
                        Actualizar
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={() => handleDeleteOrden(entry.orden.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="api-order-card__meta">
                    <span>Cliente: {entry.factura?.razon_social || entry.orden.cliente_id}</span>
                    <span>Estado pago: {entry.pago?.estado_pago || "-"}</span>
                    <span>Items: {entry.items.length}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="api-panel">
            <div className="api-panel__header">
              <div>
                <h2 className="api-panel__title">Clientes sobre promedio</h2>
                <p className="api-panel__desc">Consume `GET /reportes/clientes-sobre-promedio`.</p>
              </div>
            </div>
            <ul className="api-list">
              {clientesSobrePromedio.map((cliente) => (
                <li key={cliente.cliente_id}>
                  <strong>{cliente.nombre}</strong>
                  <span>{formatMoney(cliente.total_comprado)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="api-panel">
            <div className="api-panel__header">
              <div>
                <h2 className="api-panel__title">Órdenes validadas</h2>
                <p className="api-panel__desc">Consume `GET /reportes/ordenes-validadas`.</p>
              </div>
            </div>
            <ul className="api-list">
              {ordenesValidadas.map((orden) => (
                <li key={orden.orden_id}>
                  <strong>{orden.orden_id.slice(0, 8)}...</strong>
                  <span>{formatMoney(orden.total_calculado_items)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
