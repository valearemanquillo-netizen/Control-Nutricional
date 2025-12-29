const URL = "https://script.google.com/macros/s/AKfycbySAXW-_bKS6kS8JbrIlRTxT1RInfseNnTqtWL13CnCfPoaiBgyUbkHx5kaz6l0qjuf/exec"; // Cambia por tu Apps Script

// Guardar perfil
function guardarPerfil() {
  const cc = document.getElementById("cc").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const edad = parseInt(document.getElementById("edad").value);
  const sexo = document.getElementById("sexo").value;
  const actividad = parseFloat(document.getElementById("actividad").value);

  if (!cc || !peso || !altura || !edad || !sexo || !actividad) {
    alert("Completa todos los campos");
    return;
  }

  // Calculo estimado de calorías, proteínas, carbos y grasas
  const calorias = Math.round((10*peso + 6.25*altura - 5*edad + (sexo==="H"?5:-161))*actividad);
  const proteina = Math.round(calorias*0.23/4);
  const carbos = Math.round(calorias*0.52/4);
  const grasas = Math.round(calorias*0.25/9);

  const data = {
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

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(resp => {
      if (resp.estado === "OK") {
        // Guardamos localmente para la guía
        localStorage.setItem("guia", JSON.stringify(data));
        window.location.href = "guia.html"; // Redirige a guía diaria
      } else alert("Error al guardar perfil");
    })
    .catch(e => alert("Error al guardar perfil: "+e));
}

// Cargar guía diaria con IMC
function cargarGuia() {
  const guia = JSON.parse(localStorage.getItem("guia"));
  if (!guia) return;

  const alturaM = guia.altura/100;
  const imc = (guia.peso/(alturaM*alturaM)).toFixed(1);
  let imcCategoria = "";
  if (imc < 18.5) imcCategoria = "Bajo peso";
  else if (imc < 25) imcCategoria = "Normal";
  else if (imc < 30) imcCategoria = "Sobrepeso";
  else imcCategoria = "Obesidad";

  document.getElementById("guia").innerHTML = `
    <ul>
      <li>🥩 Proteína: <b>${guia.proteina} g</b></li>
      <li>🍚 Carbohidratos: <b>${guia.carbos} g</b></li>
      <li>🥑 Grasas: <b>${guia.grasas} g</b></li>
      <li>🔥 Calorías: <b>${guia.calorias}</b></li>
      <li>⚖️ IMC: <b>${imc} (${imcCategoria})</b></li>
    </ul>
  `;
}

if(document.getElementById("guia")) cargarGuia();

// Guardar guía diaria en REGISTROS
function guardarGuia() {
  const guia = JSON.parse(localStorage.getItem("guia"));
  if (!guia) return alert("No hay datos de guía para guardar");

  const data = {
    tipo: "registro",
    cc: guia.cc,
    peso: guia.peso,
    proteina: guia.proteina,
    carbos: guia.carbos,
    grasas: guia.grasas,
    calorias: guia.calorias
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(resp => {
      if (resp.estado === "OK") alert("Guía diaria guardada correctamente");
      else alert("Error al guardar guía diaria");
    })
    .catch(e => alert("Error: " + e));
}

// Ir a la página de resumen
function irResumen() {
  window.location.href = "resumen.html";
}

// Consultar resumen por CC
function consultarResumen() {
  const cc = document.getElementById("cc-buscar").value;
  if(!cc) return alert("Ingresa una cédula");

  fetch(`${URL}?hoja=REGISTROS`)
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(r => r[1] == cc); // Supone que columna 1 es CC
      const contenedor = document.getElementById("resumen");
      contenedor.innerHTML = "";

      filtrados.forEach((r,i)=>{
        const div = document.createElement("div");
        div.classList.add("registro");
        div.innerHTML = `
          <button class="fecha-btn" onclick="toggleRegistro(${i})">📅 ${r[0]}</button>
          <div class="detalle" id="detalle-${i}">
            <p>Peso: ${r[2]} kg</p>
            <p>Proteína: ${r[3]} g</p>
            <p>Carbos: ${r[4]} g</p>
            <p>Grasas: ${r[5]} g</p>
            <p>Calorías: ${r[6]}</p>
          </div>
        `;
        contenedor.appendChild(div);
      });
    });
}

// Toggle desplegable
function toggleRegistro(i) {
  const detalle = document.getElementById(`detalle-${i}`);
  if(!detalle) return;
  detalle.style.display = detalle.style.display === "block" ? "none" : "block";
}
