// ================================
// CONFIGURACIÓN
// ================================
const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbydTc_2_yrbc3pvkPQr1AFqRPDCFBfLaaS936xlEWTiBLfmxySkcZOrZQnF0piJpJoxvg/exec";


// ================================
// GUARDAR PERFIL (PÁGINA 1)
// ================================
async function guardarPerfil() {
  const cc = document.getElementById("cc").value.trim();
  const peso = Number(document.getElementById("peso").value);
  const altura = Number(document.getElementById("altura").value);
  const edad = Number(document.getElementById("edad").value);
  const sexo = document.getElementById("sexo").value;
  const actividad = Number(document.getElementById("actividad").value);

  if (!cc || !peso || !altura || !edad || !sexo || !actividad) {
    alert("Complete todos los campos");
    return;
  }

  // ===== CÁLCULOS =====
  let tmb =
    sexo === "H"
      ? 10 * peso + 6.25 * altura - 5 * edad + 5
      : 10 * peso + 6.25 * altura - 5 * edad - 161;

  const calorias = Math.round(tmb * actividad);
  const proteina = Math.round((calorias * 0.23) / 4);
  const carbos = Math.round((calorias * 0.52) / 4);
  const grasas = Math.round((calorias * 0.25) / 9);

  // ===== GUARDAR LOCAL =====
  localStorage.setItem("cc", cc);
  localStorage.setItem(
    "macros",
    JSON.stringify({ calorias, proteina, carbos, grasas })
  );

  // ===== ENVIAR A GOOGLE SHEETS =====
  const payload = {
    tipo: "usuario",
    cc,
    peso,
    altura,
    edad,
    sexo,
    actividad,
    calorias,
    proteina,
    carbos,
    grasas
  };

  try {
    await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    window.location.href = "guia.html";
  } catch (error) {
    alert("Error guardando datos");
    console.error(error);
  }
}


// ================================
// MOSTRAR GUÍA (PÁGINA 2)
// ================================
function mostrarGuia() {
  const data = JSON.parse(localStorage.getItem("macros"));
  if (!data) return;

  const porcion = (valor) => Math.round(valor / 3);

  document.getElementById("guia").innerHTML = `
    <p><b>Calorías:</b> ${data.calorias} kcal</p>

    <h3>Por comida (3 al día)</h3>
    <ul>
      <li>Proteína: ${porcion(data.proteina)} g</li>
      <li>Carbohidratos: ${porcion(data.carbos)} g</li>
      <li>Grasas: ${porcion(data.grasas)} g</li>
    </ul>
  `;
}


// ================================
// GUARDAR REGISTRO DIARIO
// ================================
async function guardarRegistro() {
  const cc = localStorage.getItem("cc");
  const data = JSON.parse(localStorage.getItem("macros"));

  if (!cc || !data) return;

  const payload = {
    tipo: "registro",
    cc,
    calorias: data.calorias,
    proteina: data.proteina,
    carbos: data.carbos,
    grasas: data.grasas
  };

  try {
    await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    window.location.href = "resumen.html";
  } catch (error) {
    alert("Error guardando registro");
    console.error(error);
  }
}


// ================================
// CONSULTAR RESUMEN (PÁGINA 3)
// ================================
function consultarResumen() {
  const cc = document.getElementById("ccBusqueda").value;

  if (!cc) {
    alert("Ingrese la cédula");
    return;
  }

  fetch(`${URL}?hoja=REGISTROS&cc=${cc}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length <= 1) {
        document.getElementById("tablaResumen").innerHTML =
          "<p>No hay registros</p>";
        return;
      }

      let html = `
        <table>
          <tr>
            <th>Fecha</th>
            <th>Peso</th>
            <th>Proteína</th>
            <th>Carbos</th>
            <th>Grasas</th>
            <th>Calorías</th>
          </tr>
      `;

      data.slice(1).forEach(row => {
        html += `
          <tr>
            <td>${new Date(row[0]).toLocaleDateString()}</td>
            <td>${row[2]}</td>
            <td>${row[3]} g</td>
            <td>${row[4]} g</td>
            <td>${row[5]} g</td>
            <td>${row[6]}</td>
          </tr>
        `;
      });

      html += "</table>";
      document.getElementById("tablaResumen").innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      alert("Error consultando datos");
    });
}



// ================================
// AUTO-EJECUCIÓN SEGÚN PÁGINA
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("guia")) {
    mostrarGuia();
  }
});
