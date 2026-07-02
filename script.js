// referencias del dom
const formulario = document.getElementById("productForm");
const nombreInput = document.getElementById("nombre");
const cantidadInput = document.getElementById("cantidad");
const precioInput = document.getElementById("precio");

const totalProductosEl = document.getElementById("totalProductos");
const totalUnidadesEl = document.getElementById("totalUnidades");
const valorTotalEl = document.getElementById("valorTotal");

const tablaProductos = document.getElementById("tablaProductos");
const botonFormulario = formulario.querySelector("button");

// estado de la aplicación
let productos = [];

// control de edición
let editando = false;
let indexEditando = null;

// URL de tu API
const API_URL = "http://localhost:3000/productos";

// cargar al iniciar
obtenerProductos();

// evento del formulario
formulario.addEventListener("submit", agregarProducto);

// =====================
// GET productos (API)
// =====================
async function obtenerProductos() {
    const res = await fetch(API_URL);
    productos = await res.json();

    mostrarProductos();
    actualizarDashboard();
}

// =====================
// POST / PUT productos
// =====================
async function agregarProducto(evento) {
    evento.preventDefault();

    const producto = {
        nombre: nombreInput.value,
        cantidad: Number(cantidadInput.value),
        precio: Number(precioInput.value)
    };

    if (editando) {

        const id = productos[indexEditando].id;

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        editando = false;
        indexEditando = null;
        botonFormulario.textContent = "Guardar";

    } else {

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
    }

    formulario.reset();
    obtenerProductos();
}

// =====================
// Render tabla
// =====================
function mostrarProductos() {

    tablaProductos.innerHTML = "";

    productos.forEach((producto, index) => {

        tablaProductos.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td class="${estadoStock(producto.cantidad)}">
                    ${producto.cantidad}
                </td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>
                    <button onclick="cargarProducto(${index})">Editar</button>
                    <button onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// =====================
// Cargar producto en form
// =====================
function cargarProducto(index) {

    editando = true;
    indexEditando = index;

    nombreInput.value = productos[index].nombre;
    cantidadInput.value = productos[index].cantidad;
    precioInput.value = productos[index].precio;

    botonFormulario.textContent = "Actualizar";
}

// =====================
// DELETE producto
// =====================
async function eliminarProducto(index) {

    const id = productos[index].id;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    obtenerProductos();
}

// =====================
// Dashboard
// =====================
function actualizarDashboard() {

    totalProductosEl.textContent = productos.length;

    const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
    totalUnidadesEl.textContent = totalUnidades;

    const valorTotal = productos.reduce((acc, p) => acc + (p.cantidad * p.precio), 0);
    valorTotalEl.textContent = `$${valorTotal.toFixed(2)}`;
}

// =====================
// Estado stock
// =====================
function estadoStock(cantidad) {

    if (cantidad <= 3) return "bajo";
    if (cantidad <= 10) return "medio";
    return "alto";
}