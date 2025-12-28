/*************************
 * CONFIGURACIÓN
 *************************/
const URL = "https://script.google.com/macros/s/AKfycbzq95bWyWNDTuULrHoTs65HN2wS97rtPXAwdCbsUQJ2hqkzxG_oI-VC7wp67c_tMb9UDw/exec";

let macrosUsuario = {};
let ccActual = "";

/*************************
 * NAVEGACIÓN
 *************************/
function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach(p => {
    p.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

mostrar("perfil");

/*************************
 * GUARDAR PERFIL
 *************************/
function guardarPerfil() {
  // 1️⃣ LEER INPUTS
  const cc = document.getElementById("cc").value;
  const peso = +document.getElementById("peso").value;
  const altura = +document.getElementById("altura").value;
  const edad = +document.getElementById("edad").value;
  const sexo = document.getElementById("sexo").value;
  const actividad = +document.getElementById("actividad").value;

  if (!cc || !peso || !altura || !edad) {
    alert("Completa todos los campos");
    return;
  }

  ccActual = cc;

  // 2️⃣ CÁLCULOS NUTRICIONALES (BASE MÉDICA)
  let tmb = sexo === "H"
    ? 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad)
    : 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * edad);

  const calorias = Math.round(tmb * actividad);
  const proteina = Math.round(peso * 2);
  const grasas = Math.round((calorias * 0.25) / 9);
  const carbos = Math.round((calorias - (proteina * 4) - (grasas * 9)) / 4);

  macrosUsuario = { calorias, proteina, carbos, grasas };

  // 3️⃣ ENVIAR A APPS SCRIPT
  const data = {
    tipo: "usuario",
    cc,
    peso,
    altura,
    edad,
    sexo,
    actividad
  };

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  // 4️⃣ PASAR A SEGUNDA PANTALLA
  mostrar("registro");
  mostrarGuia();
}

/*************************
 * MOSTRAR GUÍA NUTRICIONAL
 *************************/
function mostrarGuia() {
  document.getElementById("guia").innerHTML = `
    <h3>Guía diaria recomendada</h3>
    <p><strong>Calorías:</strong> ${macrosUsuario.calorias} kcal</p>

    <h4>Distribución por comida</h4>
    <ul>
      <li>🥣 Desayuno:
        ${Math.round(macrosUsuario.proteina * 0.3)}g proteína,
        ${Math.round(macrosUsuario.carbos * 0.3)}g carbos,
        ${Math.round(macrosUsuario.grasas * 0.3)}g grasas
      </li>
      <li>🍛 Almuerzo:
        ${Math.round(macrosUsuario.proteina * 0.4)}g proteína,
        ${Math.round(macrosUsuario.carbos * 0.4)}g carbos,
        ${Math.round(macrosUsuario.grasas * 0.4)}g grasas
      </li>
      <li>🍽 Cena:
        ${Math.round(macrosUsuario.proteina * 0.3)}g proteína,
        ${Math.round(macrosUsuario.carbos * 0.3)}g carbos,
        ${Math.round(macrosUsuario.grasas * 0.3)}g grasas
      </li>
    </ul>
  `;
}

/*************************
 * GUARDAR REGISTRO DIARIO
 *************************/
function guardarRegistro() {
  const data = {
    tipo: "registro",
    cc: ccActual,
    calorias: macrosUsuario.calorias,
    proteina: macrosUsuario.proteina,
    carbos: macrosUsuario.carbos,
    grasas: macrosUsuario.grasas
  };

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Registro guardado");
  mostrar("resumen");
}

/*************************
 * CONSULTAR HISTORIAL
 *************************/
function consultarResumen() {
  const cc = document.getElementById("ccBuscar").value;

  if (!cc) {
    alert("Ingresa una CC");
    return;
  }

  fetch(`${URL}?cc=${cc}`)
    .then(res => res.json())
    .then(data => {
      let html = "<h3>Histórico</h3><ul>";
      data.forEach(r => {
        html += `
          <li>
            📅 ${new Date(r[0]).toLocaleDateString()} -
            🔥 ${r[2]} kcal |
            🥩 ${r[3]}g |
            🍚 ${r[4]}g |
            🧈 ${r[5]}g
          </li>`;
      });
      html += "</ul>";
      document.getElementById("historial").innerHTML = html;
    });
}
