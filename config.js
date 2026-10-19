// Pega aquí la URL de tu implementación de Apps Script (termina en /exec)
var API_URL = 'https://script.google.com/macros/s/AKfycbxJuJukjfFoves1OuF_vTUXdIWaXtySqPbIgfYMJxHxomj3T3JhHumAexAEhgw4ilbY/exec';

// Llamadas a la API. No necesitas editar nada debajo de esta línea.
function conTiempo(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise(function (_, rechazar) {
      setTimeout(function () { rechazar(new Error('La conexión tardó demasiado')); }, ms);
    })
  ]);
}

function leerRespuesta(r) {
  if (!r.ok) throw new Error('Error del servidor (' + r.status + ')');
  return r.json().then(function (d) {
    if (!d.ok) throw new Error(d.error || 'Error desconocido');
    return d.data;
  });
}

function apiGet(accion) {
  if (API_URL.indexOf('http') !== 0) return Promise.reject(new Error('Falta configurar API_URL en config.js'));
  return conTiempo(fetch(API_URL + '?accion=' + encodeURIComponent(accion)), 25000).then(leerRespuesta);
}

function apiPost(datos) {
  if (API_URL.indexOf('http') !== 0) return Promise.reject(new Error('Falta configurar API_URL en config.js'));
  // text/plain evita la verificación CORS previa, que Apps Script no soporta
  return conTiempo(fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  }), 25000).then(leerRespuesta);
}
